package joyrun

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/meilisearch/meilisearch-go"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/tkrajina/gpxgo/gpx"

	"pocketbase/services/trailmerge"
	"pocketbase/util"
)

// 悦跑圈 API 基地址
const joyrunAPIBase = "https://open.thejoyrun.com"

// SyncJoyrun 定时同步入口，由 cron 调度
func SyncJoyrun(app core.App, client meilisearch.ServiceManager) error {
	integrations, err := app.FindAllRecords("integrations", dbx.NewExp("true"))
	if err != nil {
		return err
	}

	for _, i := range integrations {
		encryptionKey := os.Getenv("POCKETBASE_ENCRYPTION_KEY")
		if len(encryptionKey) == 0 {
			return errors.New("POCKETBASE_ENCRYPTION_KEY not set")
		}

		userId := i.GetString("user")
		actor, err := app.FindFirstRecordByData("activitypub_actors", "user", userId)
		if err != nil {
			warning := fmt.Sprintf("no actor found for user: %s\n", userId)
			fmt.Print(warning)
			app.Logger().Warn(warning)
			continue
		}

		ctx, err := util.GetSafeActorContext(nil, actor)
		if err != nil {
			continue
		}

		joyrunString := i.GetString("joyrun")
		joyrunIntegration := JoyrunIntegration{
			Merge: trailmerge.DefaultIntegrationAutoMergeSettings(),
		}
		json.Unmarshal([]byte(joyrunString), &joyrunIntegration)

		if !joyrunIntegration.Active || joyrunIntegration.Phone == "" || joyrunIntegration.Password == "" {
			continue
		}

		j := &JoyrunApi{}

		decryptedPassword, err := security.Decrypt(joyrunIntegration.Password, encryptionKey)
		if err != nil {
			warning := fmt.Sprintf("unable to decrypt joyrun password: %v\n", err)
			fmt.Print(warning)
			app.Logger().Warn(warning)
			continue
		}

		err = j.Login(joyrunIntegration.Phone, string(decryptedPassword))
		if err != nil {
			warning := fmt.Sprintf("joyrun login failed: %v\n", err)
			fmt.Print(warning)
			app.Logger().Warn(warning)
			continue
		}

		var after int64 = 0
		if joyrunIntegration.After != "" {
			t, err := time.Parse("2006-01-02", joyrunIntegration.After)
			if err != nil {
				return err
			}
			after = t.Unix()
		}

		page := 1
		totalPages := 1
		for page <= totalPages {
			activities, tp, err := j.fetchActivities(page)
			if err != nil {
				warning := fmt.Sprintf("error fetching activities from joyrun (page %d): %v\n", page, err)
				fmt.Print(warning)
				app.Logger().Warn(warning)
				break
			}
			totalPages = tp

			allAlreadySynced, err := syncTrailsWithActivities(app, client, ctx, j, joyrunIntegration, userId, actor, activities, after)
			if err != nil {
				warning := fmt.Sprintf("error syncing joyrun activities with trails: %v\n", err)
				fmt.Print(warning)
				app.Logger().Warn(warning)
				break
			}
			if allAlreadySynced {
				break
			}
			page++
		}
	}

	return nil
}

// --------------- API 客户端 ---------------

type JoyrunApi struct {
	UserID string
	Token  string
}

func (j *JoyrunApi) buildHeader(req *http.Request) {
	if j.Token != "" {
		req.Header.Set("Authorization", "Bearer "+j.Token)
	}
}

func sendJoyrunRequest(req *http.Request) ([]byte, error) {
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("joyrun API error (%d): %s", resp.StatusCode, string(body))
	}

	return io.ReadAll(resp.Body)
}

// Login 悦跑圈账号登录（手机号 + 密码）
func (j *JoyrunApi) Login(phone, password string) error {
	loginBody := map[string]string{
		"phone":    phone,
		"password": password,
	}
	bodyBytes, _ := json.Marshal(loginBody)

	req, err := http.NewRequest("POST", joyrunAPIBase+"/auth/login", bytes.NewBuffer(bodyBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	data, err := sendJoyrunRequest(req)
	if err != nil {
		return err
	}

	var resp LoginResponse
	if err := json.Unmarshal(data, &resp); err != nil {
		return fmt.Errorf("failed to parse login response: %w", err)
	}

	j.Token = resp.AccessToken
	j.UserID = strconv.FormatInt(resp.UserID, 10)

	if j.Token == "" {
		return errors.New("joyrun login returned empty token")
	}

	return nil
}

// fetchActivities 获取活动列表（分页）
func (j *JoyrunApi) fetchActivities(page int) ([]JoyrunActivity, int, error) {
	url := fmt.Sprintf("%s/v2/activity/list?page=%d&page_size=20&sort=date", joyrunAPIBase, page)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, 0, err
	}
	j.buildHeader(req)

	data, err := sendJoyrunRequest(req)
	if err != nil {
		return nil, 0, err
	}

	var resp JoyrunActivityListResponse
	if err := json.Unmarshal(data, &resp); err != nil {
		return nil, 0, err
	}

	return resp.Data, resp.Pages, nil
}

// fetchActivityDetail 获取活动详情（含 GPS 轨迹）
func (j *JoyrunApi) fetchActivityDetail(activityID int64) (*JoyrunActivityDetail, error) {
	url := fmt.Sprintf("%s/v2/activity/%d?with_tracks=true&with_photos=true", joyrunAPIBase, activityID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	j.buildHeader(req)

	data, err := sendJoyrunRequest(req)
	if err != nil {
		return nil, err
	}

	var detail JoyrunActivityDetail
	if err := json.Unmarshal(data, &detail); err != nil {
		return nil, err
	}

	return &detail, nil
}

// --------------- 同步逻辑 ---------------

func syncTrailsWithActivities(
	app core.App,
	client meilisearch.ServiceManager,
	ctx context.Context,
	j *JoyrunApi,
	integration JoyrunIntegration,
	user string,
	actor *core.Record,
	activities []JoyrunActivity,
	after int64,
) (bool, error) {
	allAlreadySynced := true
	for _, activity := range activities {
		// 过滤掉 after 日期之前的活动
		if after > 0 && activity.StartDate.Unix() < after {
			continue
		}

		existingTrail, err := util.FindTrailByExternalReference(app, "joyrun", strconv.FormatInt(activity.ID, 10))
		if err != nil {
			return false, err
		}
		if existingTrail != nil {
			continue
		}
		allAlreadySynced = false

		detail, err := j.fetchActivityDetail(activity.ID)
		if err != nil {
			app.Logger().Warn(fmt.Sprintf("Unable to fetch joyrun activity '%s' detail: %v", activity.Name, err))
			continue
		}

		gpxFile, err := generateActivityGPX(detail)
		if err != nil {
			app.Logger().Warn(fmt.Sprintf("Unable to generate GPX for joyrun activity '%s': %v", activity.Name, err))
			continue
		}

		trailID, err := createTrailFromActivity(app, detail, gpxFile, user, actor.Id, integration.Privacy)
		if err != nil {
			app.Logger().Warn(fmt.Sprintf("Unable to create trail for joyrun activity '%s': %v", activity.Name, err))
			continue
		}

		if err := trailmerge.TryAutoMergeImportedTrail(app, client, ctx, actor, trailID, integration.Merge); err != nil {
			app.Logger().Warn(fmt.Sprintf("Unable to auto-merge imported joyrun activity '%s': %v", activity.Name, err))
		}
	}
	return allAlreadySynced, nil
}

// --------------- Trail 创建 ---------------

func createTrailFromActivity(
	app core.App,
	activity *JoyrunActivityDetail,
	gpxFile *filesystem.File,
	user string,
	actor string,
	privacy string,
) (string, error) {
	collection, err := app.FindCollectionByNameOrId("trails")
	if err != nil {
		return "", err
	}

	// 活动类型映射：悦跑圈 type → wanderer 分类
	activityTypeMap := map[int]string{
		1: "Walking", // 跑步 → Walking
		2: "Biking",  // 骑行 → Biking
		3: "Hiking",  // 徒步 → Hiking
		5: "Workout", // 室内跑 → Workout
	}
	categoryName := activityTypeMap[activity.Type]
	category, _ := app.FindFirstRecordByData("categories", "name", categoryName)
	categoryId := ""
	if category != nil {
		categoryId = category.Id
	}

	public := activity.IsPublic
	if privacy == "settings" {
		privacySettings := struct {
			Trails string `json:"trails"`
		}{}
		settings, _ := app.FindFirstRecordByData("settings", "user", user)
		_ = settings.UnmarshalJSONField("privacy", &privacySettings)
		public = privacySettings.Trails == "public"
	}

	// 从轨迹点提取起始坐标
	lat, lon := activity.StartLat, activity.StartLon
	if lat == 0 && lon == 0 && len(activity.Tracks) > 0 {
		lat = activity.Tracks[0].Lat
		lon = activity.Tracks[0].Lon
	}

	record := core.NewRecord(collection)
	record.Load(map[string]any{
		"name":           activity.Name,
		"description":    activity.Description,
		"public":         public,
		"completed":      true,
		"distance":       activity.Distance,
		"elevation_gain": activity.ElevationGain,
		"elevation_loss": activity.ElevationLoss,
		"duration":       activity.Duration,
		"date":           activity.StartDate,
		"lat":            lat,
		"lon":            lon,
		"difficulty":     "easy",
		"category":       categoryId,
		"author":         actor,
	})

	if gpxFile != nil {
		record.Set("gpx", gpxFile)
	}

	// 处理活动照片
	var photos []*filesystem.File
	for _, photo := range activity.Photos {
		if photo.URL == "" {
			continue
		}
		p, err := fetchPhotoFromURL(photo.URL)
		if err != nil {
			app.Logger().Warn(fmt.Sprintf("Failed to fetch joyrun photo %d: %v", photo.ID, err))
			continue
		}
		photos = append(photos, p)
	}
	if len(photos) > 0 {
		record.Set("photos", photos)
	}

	if err := app.Save(record); err != nil {
		return "", err
	}
	if err := util.EnsureTrailExternalReference(app, record.Id, "joyrun", strconv.FormatInt(activity.ID, 10)); err != nil {
		return "", err
	}

	// 已完成活动创建 summit_log
	summitCollection, err := app.FindCollectionByNameOrId("summit_logs")
	if err != nil {
		return "", err
	}
	summitLog := core.NewRecord(summitCollection)
	summitLog.Load(map[string]any{
		"distance":       activity.Distance,
		"elevation_gain": activity.ElevationGain,
		"elevation_loss": activity.ElevationLoss,
		"duration":       activity.Duration,
		"date":           activity.StartDate,
		"author":         actor,
		"trail":          record.Id,
	})
	if err := app.Save(summitLog); err != nil {
		return "", err
	}

	return record.Id, nil
}

// --------------- GPX 生成 ---------------

func generateActivityGPX(activity *JoyrunActivityDetail) (*filesystem.File, error) {
	if len(activity.Tracks) == 0 {
		return nil, nil
	}

	var points []gpx.GPXPoint
	for _, tp := range activity.Tracks {
		ele := gpx.NewNullableFloat64(tp.Elevation)
		points = append(points, gpx.GPXPoint{
			Point:     gpx.Point{Latitude: tp.Lat, Longitude: tp.Lon, Elevation: *ele},
			Timestamp: time.Unix(tp.Timestamp, 0),
		})
	}

	gpxData := &gpx.GPX{
		Version: "1.1",
		Creator: "Joyrun GPX Exporter",
		Tracks: []gpx.GPXTrack{
			{
				Name: activity.Name,
				Segments: []gpx.GPXTrackSegment{
					{Points: points},
				},
			},
		},
	}

	gpxXML, err := gpxData.ToXml(gpx.ToXmlParams{Version: "1.1", Indent: true})
	if err != nil {
		return nil, err
	}

	return filesystem.NewFileFromBytes(gpxXML, activity.Name+".gpx")
}

// --------------- 工具函数 ---------------

func fetchPhotoFromURL(url string) (*filesystem.File, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch photo: status %d", resp.StatusCode)
	}

	var buf bytes.Buffer
	if _, err := io.Copy(&buf, resp.Body); err != nil {
		return nil, err
	}

	return filesystem.NewFileFromBytes(buf.Bytes(), "joyrun_photo")
}

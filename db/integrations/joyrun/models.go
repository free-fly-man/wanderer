package joyrun

import (
	"time"

	"pocketbase/services/trailmerge"
)

// JoyrunIntegration 悦跑圈集成配置（存储在 PocketBase integrations 表的 joyrun 字段）
type JoyrunIntegration struct {
	Active    bool                                    `json:"active"`
	Phone     string                                  `json:"phone"`
	Password  string                                  `json:"password"`
	Privacy   string                                  `json:"privacy"`
	After     string                                  `json:"after,omitempty"`
	Merge     trailmerge.IntegrationAutoMergeSettings `json:"merge"`
}

// LoginResponse 悦跑圈登录响应
type LoginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	UserID      int64  `json:"user_id"`
}

// JoyrunActivityListResponse 活动列表响应
type JoyrunActivityListResponse struct {
	Total    int              `json:"total"`
	Page     int              `json:"page"`
	Pages    int              `json:"pages"`
	PageSize int              `json:"page_size"`
	Data     []JoyrunActivity `json:"data"`
}

// JoyrunActivity 悦跑圈活动概要
type JoyrunActivity struct {
	ID             int64     `json:"id"`
	Name           string    `json:"name"`
	Type           int       `json:"type"` // 1=跑步, 2=骑行, 3=徒步, 5=室内跑
	Distance       float64   `json:"distance"`
	Duration       int       `json:"duration"` // 秒
	Calorie        float64   `json:"calorie"`
	AvgSpeed       float64   `json:"avg_speed"`
	MaxSpeed       float64   `json:"max_speed"`
	ElevationGain  float64   `json:"elevation_gain"`
	ElevationLoss  float64   `json:"elevation_loss"`
	StartDate      time.Time `json:"start_date"`
	StartLat       float64   `json:"start_lat"`
	StartLon       float64   `json:"start_lon"`
	IsPublic       bool      `json:"is_public"`
	TotalDistance   float64   `json:"total_distance"`
	Steps          int       `json:"steps"`
}

// JoyrunActivityDetail 悦跑圈活动详情（含 GPS 轨迹）
type JoyrunActivityDetail struct {
	JoyrunActivity
	Description string              `json:"description"`
	Tracks      []JoyrunTrackPoint  `json:"tracks"`
	Photos      []JoyrunPhoto       `json:"photos"`
}

// JoyrunTrackPoint GPS 轨迹点
type JoyrunTrackPoint struct {
	Lat       float64 `json:"lat"`
	Lon       float64 `json:"lon"`
	Elevation float64 `json:"elevation"`
	Timestamp int64   `json:"timestamp"` // Unix 秒
	Speed     float64 `json:"speed"`
}

// JoyrunPhoto 活动照片
type JoyrunPhoto struct {
	ID  int64  `json:"id"`
	URL string `json:"url"`
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

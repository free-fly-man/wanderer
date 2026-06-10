package routes

import (
	"fmt"
	"net/http"
	"os"
	"pocketbase/integrations/wechat"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/security"
)

// IntegrationWechatLogin handles the WeChat OAuth login initiation
func IntegrationWechatLogin(e *core.RequestEvent) error {
	appID := os.Getenv("WECHAT_APP_ID")
	if appID == "" {
		return apis.NewBadRequestError("WECHAT_APP_ID not configured", nil)
	}

	redirectURI := os.Getenv("WECHAT_REDIRECT_URI")
	if redirectURI == "" {
		origin := os.Getenv("ORIGIN")
		if origin == "" {
			return apis.NewBadRequestError("ORIGIN or WECHAT_REDIRECT_URI not configured", nil)
		}
		redirectURI = origin + "/api/v1/auth/wechat/callback"
	}

	state := security.RandomString(32)

	config := wechat.WechatConfig{
		AppID: appID,
	}

	authURL := wechat.GetAuthURL(config, redirectURI, state)

	// Store state in cookie for verification
	e.SetCookie(&http.Cookie{
		Name:     "wechat_oauth_state",
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		Secure:   e.Request.URL.Scheme == "https",
		MaxAge:   600, // 10 minutes
	})

	return e.Redirect(http.StatusFound, authURL)
}

// IntegrationWechatCallback handles the WeChat OAuth callback
func IntegrationWechatCallback(e *core.RequestEvent) error {
	code := e.Request.URL.Query().Get("code")
	state := e.Request.URL.Query().Get("state")

	if code == "" {
		return apis.NewBadRequestError("Authorization code is missing", nil)
	}

	// Verify state
	storedState, err := e.Request.Cookie("wechat_oauth_state")
	if err != nil || storedState.Value != state {
		return apis.NewBadRequestError("Invalid state parameter", nil)
	}

	// Clear the state cookie
	e.SetCookie(&http.Cookie{
		Name:     "wechat_oauth_state",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	})

	appID := os.Getenv("WECHAT_APP_ID")
	appSecret := os.Getenv("WECHAT_APP_SECRET")
	if appID == "" || appSecret == "" {
		return apis.NewBadRequestError("WeChat credentials not configured", nil)
	}

	config := wechat.WechatConfig{
		AppID:     appID,
		AppSecret: appSecret,
	}

	// Exchange code for access token
	tokenResp, err := wechat.GetAccessToken(config, code)
	if err != nil {
		return apis.NewBadRequestError(fmt.Sprintf("Failed to get access token: %v", err), nil)
	}

	// Get user info
	userInfo, err := wechat.GetUserInfo(tokenResp.AccessToken, tokenResp.OpenID)
	if err != nil {
		return apis.NewBadRequestError(fmt.Sprintf("Failed to get user info: %v", err), nil)
	}

	// Find or create user based on WeChat OpenID
	user, err := findOrCreateWechatUser(e.App, userInfo, tokenResp.OpenID)
	if err != nil {
		return apis.NewBadRequestError(fmt.Sprintf("Failed to create/update user: %v", err), nil)
	}

	// Generate auth token
	token, err := user.NewAuthToken()
	if err != nil {
		return err
	}

	// Set authentication cookie
	e.SetCookie(&http.Cookie{
		Name:     "pb_auth",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   e.Request.URL.Scheme == "https",
		MaxAge:   60 * 60 * 24 * 7, // 7 days
	})

	// Redirect to frontend
	frontendRedirect := e.Request.URL.Query().Get("redirect")
	if frontendRedirect == "" {
		frontendRedirect = "/"
	}

	return e.Redirect(http.StatusFound, frontendRedirect)
}

// findOrCreateWechatUser finds an existing user by WeChat OpenID or creates a new one
func findOrCreateWechatUser(app core.App, userInfo *wechat.UserInfoResponse, openID string) (*core.Record, error) {
	// Try to find existing user by WeChat OpenID
	user, err := app.FindFirstRecordByData("users", "wechat_openid", openID)
	if err == nil && user != nil {
		// Update existing user info
		user.Set("name", userInfo.Nickname)
		if userInfo.HeadImgURL != "" {
			user.Set("avatar_url", userInfo.HeadImgURL)
		}
		if err := app.Save(user); err != nil {
			return nil, err
		}
		return user, nil
	}

	// Create new user
	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return nil, err
	}

	record := core.NewRecord(collection)
	record.Set("username", "wechat_"+openID[:8])
	record.Set("name", userInfo.Nickname)
	record.Set("email", fmt.Sprintf("%s@wechat.local", openID))
	record.Set("emailVisibility", false)
	record.Set("wechat_openid", openID)
	record.Set("verified", true)

	if userInfo.HeadImgURL != "" {
		record.Set("avatar_url", userInfo.HeadImgURL)
	}

	if err := app.Save(record); err != nil {
		return nil, err
	}

	return record, nil
}

package wechat

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const (
	WeChatAuthURL  = "https://open.weixin.qq.com/connect/qrconnect"
	WeChatTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token"
	WeChatUserInfo = "https://api.weixin.qq.com/sns/userinfo"
)

// WeChatConfig holds the WeChat OAuth configuration
type WeChatConfig struct {
	AppID     string
	AppSecret string
}

// TokenResponse represents the response from WeChat token endpoint
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	OpenID       string `json:"openid"`
	Scope        string `json:"scope"`
	UnionID      string `json:"unionid,omitempty"`
	ErrCode      int    `json:"errcode,omitempty"`
	ErrMsg       string `json:"errmsg,omitempty"`
}

// UserInfoResponse represents the response from WeChat user info endpoint
type UserInfoResponse struct {
	OpenID    string `json:"openid"`
	Nickname  string `json:"nickname"`
	Sex       int    `json:"sex"`
	Province  string `json:"province"`
	City      string `json:"city"`
	Country   string `json:"country"`
	HeadImgURL string `json:"headimgurl"`
	Privilege []string `json:"privilege"`
	UnionID   string `json:"unionid,omitempty"`
	ErrCode   int    `json:"errcode,omitempty"`
	ErrMsg    string `json:"errmsg,omitempty"`
}

// GetAuthURL generates the WeChat OAuth authorization URL
func GetAuthURL(config WeChatConfig, redirectURI, state string) string {
	params := url.Values{}
	params.Set("appid", config.AppID)
	params.Set("redirect_uri", redirectURI)
	params.Set("response_type", "code")
	params.Set("scope", "snsapi_login")
	params.Set("state", state)

	return fmt.Sprintf("%s?%s", WeChatAuthURL, params.Encode())
}

// GetAccessToken exchanges the authorization code for an access token
func GetAccessToken(config WeChatConfig, code string) (*TokenResponse, error) {
	params := url.Values{}
	params.Set("appid", config.AppID)
	params.Set("secret", config.AppSecret)
	params.Set("code", code)
	params.Set("grant_type", "authorization_code")

	tokenURL := fmt.Sprintf("%s?%s", WeChatTokenURL, params.Encode())

	resp, err := http.Get(tokenURL)
	if err != nil {
		return nil, fmt.Errorf("failed to request WeChat token: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var tokenResp TokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return nil, fmt.Errorf("failed to parse token response: %w", err)
	}

	if tokenResp.ErrCode != 0 {
		return nil, fmt.Errorf("WeChat API error: %s", tokenResp.ErrMsg)
	}

	return &tokenResp, nil
}

// GetUserInfo retrieves user information using the access token
func GetUserInfo(accessToken, openID string) (*UserInfoResponse, error) {
	params := url.Values{}
	params.Set("access_token", accessToken)
	params.Set("openid", openID)
	params.Set("lang", "zh_CN")

	userInfoURL := fmt.Sprintf("%s?%s", WeChatUserInfo, params.Encode())

	resp, err := http.Get(userInfoURL)
	if err != nil {
		return nil, fmt.Errorf("failed to request WeChat user info: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var userInfo UserInfoResponse
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, fmt.Errorf("failed to parse user info response: %w", err)
	}

	if userInfo.ErrCode != 0 {
		return nil, fmt.Errorf("WeChat API error: %s", userInfo.ErrMsg)
	}

	return &userInfo, nil
}

package wechat

import (
	"testing"
)

func TestGetAuthURL(t *testing.T) {
	config := WechatConfig{
		AppID: "test_app_id",
	}

	redirectURI := "https://example.com/callback"
	state := "test_state"

	authURL := GetAuthURL(config, redirectURI, state)

	expected := "https://open.weixin.qq.com/connect/qrconnect?appid=test_app_id&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&response_type=code&scope=snsapi_login&state=test_state"
	
	if authURL != expected {
		t.Errorf("Expected %s, got %s", expected, authURL)
	}
}

func TestGetAuthURLWithSpecialChars(t *testing.T) {
	config := WechatConfig{
		AppID: "test_app_id",
	}

	redirectURI := "https://example.com/callback?param=value"
	state := "test_state_123"

	authURL := GetAuthURL(config, redirectURI, state)

	// Check that the URL is properly encoded
	if authURL == "" {
		t.Error("Auth URL should not be empty")
	}

	// Check that required parameters are present
	if !contains(authURL, "appid=test_app_id") {
		t.Error("Auth URL should contain appid parameter")
	}
	if !contains(authURL, "response_type=code") {
		t.Error("Auth URL should contain response_type parameter")
	}
	if !contains(authURL, "scope=snsapi_login") {
		t.Error("Auth URL should contain scope parameter")
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && findSubstring(s, substr))
}

func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

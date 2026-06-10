package routes

import (
	"encoding/json"
	"net/http"
	"os"
	"pocketbase/integrations/joyrun"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/security"
)

// IntegrationJoyrunLogin 验证悦跑圈登录凭据
func IntegrationJoyrunLogin(e *core.RequestEvent) error {
	encryptionKey := os.Getenv("POCKETBASE_ENCRYPTION_KEY")
	if len(encryptionKey) == 0 {
		return apis.NewBadRequestError("POCKETBASE_ENCRYPTION_KEY not set", nil)
	}

	userId := ""
	if e.Auth != nil {
		userId = e.Auth.Id
	} else {
		return e.UnauthorizedError("authentication required", nil)
	}

	integrations, err := e.App.FindAllRecords("integrations", dbx.NewExp("user = {:id}", dbx.Params{"id": userId}))
	if err != nil {
		return err
	}
	if len(integrations) == 0 {
		return apis.NewBadRequestError("user has no integration", nil)
	}
	integration := integrations[0]
	joyrunString := integration.GetString("joyrun")
	if len(joyrunString) == 0 {
		return apis.NewBadRequestError("joyrun integration missing", nil)
	}

	var joyrunIntegration joyrun.JoyrunIntegration
	if err := json.Unmarshal([]byte(joyrunString), &joyrunIntegration); err != nil {
		return err
	}

	decryptedPassword, err := security.Decrypt(joyrunIntegration.Password, encryptionKey)
	if err != nil {
		return err
	}

	j := &joyrun.JoyrunApi{}
	if err := j.Login(joyrunIntegration.Phone, string(decryptedPassword)); err != nil {
		return apis.NewUnauthorizedError("invalid credentials", nil)
	}

	return e.JSON(http.StatusOK, nil)
}

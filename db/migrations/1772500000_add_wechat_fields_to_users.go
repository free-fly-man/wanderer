package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		collection, err := dao.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		// Add wechat_openid field
		collection.Schema.AddField(&schema.SchemaField{
			Name:     "wechat_openid",
			Type:     schema.FieldTypeText,
			Required: false,
			System:   false,
			Options: &schema.TextOptions{
				Max: 100,
			},
		})

		// Add avatar_url field for storing WeChat avatar
		collection.Schema.AddField(&schema.SchemaField{
			Name:     "avatar_url",
			Type:     schema.FieldTypeText,
			Required: false,
			System:   false,
			Options: &schema.TextOptions{
				Max: 500,
			},
		})

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db)

		collection, err := dao.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		// Remove wechat_openid field
		collection.Schema.RemoveField("wechat_openid")

		// Remove avatar_url field
		collection.Schema.RemoveField("avatar_url")

		return dao.SaveCollection(collection)
	})
}

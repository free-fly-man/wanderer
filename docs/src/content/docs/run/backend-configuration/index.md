---
title: Backend configuration
# 后端配置
description: How to access the PocketBase backend
# 如何访问 PocketBase 后端
---

For many configuration options, it is necessary that you are able to access the PocketBase backend. 
<!-- 对于许多配置选项，有必要能够访问 PocketBase 后端。 -->
PocketBase comes with a handy dashboard that allows you to configure basically everything in the backend.
<!-- PocketBase 带有一个便捷的管理面板，允许你基本上配置后端的所有内容。 -->

If you are using docker make sure to forward the internal port 8090 to a public port. 
<!-- 如果你使用 docker，请确保将内部端口 8090 转发到公共端口。 -->
With the default configuration, the PocketBase admin panel is available at `http://localhost:8090/_/`. 
<!-- 使用默认配置，PocketBase 管理面板可在 `http://localhost:8090/_/` 访问。 -->
If this is your first time visiting the panel you will need to create an admin account.
<!-- 如果这是你第一次访问管理面板，你需要创建一个管理员账户。 -->
To create backend access navigate to the location of your `docker-compose.yaml` file on the server and type:
<!-- 要创建后端访问权限，请导航到服务器上 `docker-compose.yaml` 文件的位置并输入： -->

```sh
docker compose exec -it db /pocketbase superuser upsert email@example.com myverysecurepassword
```

Via the online dashboard, you will now have access with the user "email@example.com" and the password "myverysecurepassword" to all tables in the backend and can modify the underlying data directly.
<!-- 通过在线管理面板，你现在可以使用用户 "email@example.com" 和密码 "myverysecurepassword" 访问后端中的所有表，并可以直接修改底层数据。 -->

For specific configuration guides see:
<!-- 具体配置指南请参阅： -->

- [SMTP settings](./smtp/)
- [Auth providers](./auth-providers/)
- [Backup server](./backup-server/)
- [Custom categories](./custom-categories/)
- [Adjust Filesize Limits](./adjust-filesize-limits/)

To learn more about what you can do in the admin dashboard please refer to PocketBase's [documentation](https://pocketbase.io/docs/).
<!-- 要了解有关管理面板中可以执行的操作的更多信息，请参阅 PocketBase 的[文档](https://pocketbase.io/docs/)。 -->

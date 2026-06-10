---
title: Configure Authentication Providers
# 配置身份验证提供商
description: Adjust login methods
# 调整登录方法
redirectFrom:
  - /run/backend-configuration/#auth-providers
---

### Create an OAuth app
<!-- 创建 OAuth 应用 -->

This step will vary wildly from provider to provider. Please refer to your provider's documentation for the specific steps.
<!-- 这一步因提供商而异。请参阅你的提供商的文档以获取具体步骤。 -->

No matter your provider, you will need a redirect URL. This redirect URL must have the following format: `$ORIGIN/login/redirect`. 
<!-- 无论你的提供商是什么，你都需要一个重定向 URL。此重定向 URL 必须具有以下格式：`$ORIGIN/login/redirect`。 -->
`$ORIGIN` refers to the `ORIGIN` environment variable that defines the public host at which your <span class="-tracking-[0.075em]">wanderer</span> instance can be reached. 
<!-- `$ORIGIN` 指的是定义你的 wanderer 实例可访问的公共主机的 `ORIGIN` 环境变量。 -->
So for the default installation, the redirect URL is `http://localhost:3000/login/redirect`.
<!-- 因此对于默认安装，重定向 URL 为 `http://localhost:3000/login/redirect`。 -->

In any case, once you have successfully created your OAuth app you will receive a Client ID and a Client Secret.
<!-- 无论如何，一旦你成功创建了 OAuth 应用，你将收到一个 Client ID 和 Client Secret。 -->

### Enable a provider in PocketBase
<!-- 在 PocketBase 中启用提供商 -->
![Pocketbase OAuth](../../../../assets/guides/pocketbase_oauth.png)

In the PocketBase admin panel navigate to the `users` table. Click the gear icon at the top to open the table's settings and navigate to `Options`.
<!-- 在 PocketBase 管理面板中导航到 `users` 表。点击顶部的齿轮图标打开表的设置并导航到 `Options`。 -->
In the tab `OAuth2`, add your provider and fill in the Client ID and Client Secret from the step before and save your changes.
<!-- 在 `OAuth2` 选项卡中，添加你的提供商并填写上一步骤中的 Client ID 和 Client Secret，然后保存更改。 -->

### Disable password authentication
<!-- 禁用密码身份验证 -->

After enabling the neccessary OAuth2 providers for your application you may want to disable the standard local password authentication.
<!-- 在为你的应用程序启用必要的 OAuth2 提供商之后，你可能想禁用标准的本地密码身份验证。 -->

![Pocketbase OAuth](../../../../assets/guides/pocketbase_password.png)

In the PocketBase admin panel navigate to the `users` table.
<!-- 在 PocketBase 管理面板中导航到 `users` 表。 -->
Click the gear icon at the top to open the table's settings and navigate to `Options`.
<!-- 点击顶部的齿轮图标打开表的设置并导航到 `Options`。 -->

In the tab `Identity/Password`, toggle the switch and save the configuration.
<!-- 在 `Identity/Password` 选项卡中，切换开关并保存配置。 -->

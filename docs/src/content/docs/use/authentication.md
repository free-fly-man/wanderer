---
title: Authentication
# 身份验证
description: Authentication with email/password and OAuth
# 通过邮箱/密码和 OAuth 进行身份验证
---

For the majority of <span class="-tracking-[0.075em]">wanderer</span>'s features you need an account to interact with them.
<!-- 对于 wanderer 的大部分功能，你需要一个账户才能使用。 -->

## Email/Username & Password
<!-- 邮箱/用户名和密码 -->

The quickest way to create an account is by heading over to `/register` and entering a username, a valid email address, and a password of your choice.
<!-- 创建账户的最快方式是前往 `/register`，输入用户名、有效的电子邮件地址和你选择的密码。 -->
After registering you will be redirected to the homepage and can start creating your first trail.
<!-- 注册后你将被重定向到主页，可以开始创建你的第一条路线。 -->

:::note
The username must be at least 3 characters long, the password at least 8.
<!-- 用户名必须至少 3 个字符，密码至少 8 个字符。 -->
:::

## OAuth2
<!-- OAuth2 -->

Alternatively, <span class="-tracking-[0.075em]">wanderer</span> supports authenticating via OAuth2. The following providers are supported:
<!-- 另外，wanderer 支持通过 OAuth2 进行身份验证。支持以下提供商： -->

- GitHub
- Apple
- Google
- Microsoft
- Yandex
- Facebook
- Instagram
- GitLab
- Bitbucket
- Gitee
- Gitea
- Discord
- Twitter
- Kakao
- VK
- Spotify
- Twitch
- Patreon (v2)
- Strava
- LiveChat
- mailcow
- OpenID Connect

![wanderer OAuth](../../../assets/guides/wanderer_oauth.png)

If your instance offers OAuth logins, the enabled providers appear in <span class="-tracking-[0.075em]">wanderer</span>'s login form. Click the button, authorize <span class="-tracking-[0.075em]">wanderer</span>, and wait for the authentication to finish. You are now logged in and can use <span class="-tracking-[0.075em]">wanderer</span> like any other user.
<!-- 如果你的实例提供 OAuth 登录，已启用的提供商将显示在 wanderer 的登录表单中。点击按钮，授权 wanderer，然后等待身份验证完成。你现在已登录，可以像任何其他用户一样使用 wanderer。 -->

For instructions on enabling OAuth2 providers for your own instance, see the [OAuth2 setup guide](/run/backend-configuration/oauth2/).
<!-- 有关为你自己的实例启用 OAuth2 提供商的说明，请参阅 [OAuth2 设置指南](/run/backend-configuration/oauth2/)。 -->

## API Tokens
<!-- API 令牌 -->

API tokens allow external tools and automated processes to interact with your <span class="-tracking-[0.075em]">wanderer</span> account without requiring your login credentials.
<!-- API 令牌允许外部工具和自动化进程与你的 wanderer 账户交互，而无需你的登录凭据。 -->

:::danger
API tokens grant full access to your account. Do not share them with untrusted parties.
<!-- API 令牌授予对你账户的完全访问权限。不要与不可信的方分享。 -->
:::

To manage your tokens:
<!-- 要管理你的令牌： -->
1. Log in to your <span class="-tracking-[0.075em]">wanderer</span> instance.
<!-- 1. 登录你的 wanderer 实例。 -->
2. Navigate to **Settings** > **Account** > **API Tokens**.
<!-- 2. 导航到**设置** > **账户** > **API 令牌**。 -->
3. Click **Generate new token**, provide a descriptive name and optionally an expiration date and click "Save".
<!-- 3. 点击**生成新令牌**，提供描述性名称和可选的过期日期，然后点击“保存”。 -->
4. **Copy the token immediately.** For security, it will not be shown again.
<!-- 4. **立即复制令牌。** 出于安全考虑，它不会再次显示。 -->


## Forgot your password?
<!-- 忘记密码？ -->
<span class="-tracking-[0.075em]">wanderer</span> offers the option to send password reset emails in case a user forgets his password.
<!-- wanderer 提供发送密码重置电子邮件的选项，以防用户忘记密码。 -->
You can click the "Forgot password" link in the login form. After requesting the reset the user will receive an email with a unique link to reset their password.
<!-- 你可以点击登录表单中的“忘记密码”链接。请求重置后，用户将收到一封包含唯一链接的电子邮件来重置密码。 -->
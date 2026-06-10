---
title: Integrations
# 集成
description: How to set up third-party integrations with wanderer.
# 如何设置与 wanderer 的第三方集成。
---

You can automatically sync trails to <span class="-tracking-[0.075em]">wanderer</span> at regular intervals using the third-party integration feature. Currently, we support three providers: **Strava**, **komoot** and **hammerhead**.
<!-- 你可以使用第三方集成功能定期自动将路线同步到 wanderer。目前，我们支持三个提供商：**Strava**、**komoot** 和 **hammerhead**。 -->

It is important to note that synchronization only works from the provider to <span class="-tracking-[0.075em]">wanderer</span> and not the other way around. Additionally, if a trail has already been synced to <span class="-tracking-[0.075em]">wanderer</span>, subsequent changes made in the provider will not be transferred unless the trail is deleted in <span class="-tracking-[0.075em]">wanderer</span>. Hammerhead also supports manual uploads from a trail's action menu, which is separate from the nightly sync.
<!-- 重要的是，同步仅从提供商到 wanderer，而不是反过来。此外，如果路线已同步到 wanderer，后续在提供商中所做的更改将不会传输，除非在 wanderer 中删除该路线。Hammerhead 还支持从路线操作菜单手动上传，这与每晚同步是分开的。 -->

## Strava Integration
<!-- Strava 集成 -->

### Creating an App in Strava
<!-- 在 Strava 中创建应用 -->

Before integrating Strava with <span class="-tracking-[0.075em]">wanderer</span>, you need to create an API application in Strava. Visit [Strava's API settings](https://www.strava.com/settings/api) and follow the steps to create a new API application. Your setup should resemble the following:
<!-- 在将 Strava 与 wanderer 集成之前，你需要在 Strava 中创建一个 API 应用。访问 [Strava 的 API 设置](https://www.strava.com/settings/api) 并按照步骤创建新的 API 应用。你的设置应类似于以下内容： -->

![Strava API Application](../../../assets/guides/strava_api_app.png)

### Setting Up the Integration
<!-- 设置集成 -->

1. Copy the **Client ID** and **Client Secret**.
<!-- 1. 复制 **Client ID** 和 **Client Secret**。 -->
2. Go to the integrations page in <span class="-tracking-[0.075em]">wanderer</span>'s settings.
<!-- 2. 进入 wanderer 设置中的集成页面。 -->
3. Click the settings button for the Strava integration.
<!-- 3. 点击 Strava 集成的设置按钮。 -->
4. Enter your **Client ID** and **Client Secret**.
<!-- 4. 输入你的 **Client ID** 和 **Client Secret**。 -->
5. Choose whether you want to sync routes, activities, or both.
<!-- 5. 选择你想同步路线、活动还是两者都同步。 -->

![wanderer Strava Integration](../../../assets/guides/wanderer_integration_strava.png)

6. Save the settings and toggle the integration on.
<!-- 6. 保存设置并打开集成开关。 -->
7. You will be redirected to Strava's authorization page. Keep all checkboxes selected and click **Authorize**.
<!-- 7. 你将被重定向到 Strava 的授权页面。保持所有复选框选中，然后点击**授权**。 -->
8. You will then be redirected back to <span class="-tracking-[0.075em]">wanderer</span>. The Strava integration is now active.
<!-- 8. 然后你将被重定向回 wanderer。Strava 集成现在已激活。 -->

## komoot Integration
<!-- komoot 集成 -->

The komoot integration requires only your komoot username and password:
<!-- komoot 集成只需要你的 komoot 用户名和密码： -->

1. Open the komoot settings from the integrations menu.
<!-- 1. 从集成菜单打开 komoot 设置。 -->
2. Enter your komoot credentials.
<!-- 2. 输入你的 komoot 凭据。 -->
3. Save the settings.
<!-- 3. 保存设置。 -->
4. Toggle the integration on. It will become active immediately.
<!-- 4. 打开集成开关。它将立即激活。 -->

Your planned and completed trails will now sync with <span class="-tracking-[0.075em]">wanderer</span>.
<!-- 你计划和已完成的路线现在将与 wanderer 同步。 -->

## Hammerhead Integration
<!-- Hammerhead 集成 -->

The Hammerhead integration requires your Hammerhead account details:
<!-- Hammerhead 集成需要你的 Hammerhead 账户详细信息： -->

1. Open the Hammerhead settings from the integrations menu.
<!-- 1. 从集成菜单打开 Hammerhead 设置。 -->
2. Enter your Hammerhead email and password.
<!-- 2. 输入你的 Hammerhead 电子邮件和密码。 -->
3. Choose whether you want to sync planned tours, completed tours, or both.
<!-- 3. 选择你想同步计划行程、已完成行程还是两者都同步。 -->
4. (Optional) Set an "ignore trails before" date to avoid syncing duplicates if your Hammerhead account is already connected to other services.
<!-- 4. （可选）设置“忽略此日期之前的路线”以避免在你的 Hammerhead 账户已连接到其他服务时同步重复项。 -->
5. Save the settings and toggle the integration on. It will become active immediately after a successful login.
<!-- 5. 保存设置并打开集成开关。它将在成功登录后立即激活。 -->

## Sync Interval
<!-- 同步间隔 -->

By default, trails are synced every night at **02:00 AM**. You can modify this schedule using the `POCKETBASE_CRON_SYNC_SCHEDULE` [environment variable](/run/environment-configuration#pocketbase).
<!-- 默认情况下，路线每天凌晨 **02:00** 同步。你可以使用 `POCKETBASE_CRON_SYNC_SCHEDULE` [环境变量](/run/environment-configuration#pocketbase)修改此计划。 -->

:::note
Please set a reasonable sync interval. Both Strava and komoot impose usage limits on their APIs. Exceeding these limits may result in rejected requests or account suspension.
<!-- 请设置合理的同步间隔。Strava 和 komoot 都对其 API 施加了使用限制。超过这些限制可能导致请求被拒绝或账户暂停。 -->
:::

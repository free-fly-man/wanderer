---
title: SMTP settings
# SMTP 设置
description: Configure email notifications
# 配置电子邮件通知
redirectFrom:
  - /run/backend-configuration/#configure-smtp-settings
---

<span class="-tracking-[0.075em]">wanderer</span> can send email notifications to users (e.g. when a user gains a new follower). 
<!-- wanderer 可以向用户发送电子邮件通知（例如，当用户获得新关注者时）。 -->
This is also relevant to send password reset notifications. 
<!-- 这也与发送密码重置通知相关。 -->
To enable sending email, you need to configure your SMPT settings in PocketBase.
<!-- 要启用发送电子邮件，你需要在 PocketBase 中配置 SMTP 设置。 -->

![Pocketbase Mail Settings](../../../../assets/guides/pocketbase_mail_settings.png)

In the pocketbase admin panel go to Settings -> Mail settings an enable "Use SMTP mail server". 
<!-- 在 PocketBase 管理面板中，转到 Settings -> Mail settings 并启用“Use SMTP mail server”。 -->
Enter the details of your SMTP server and send a test email to ensure your configuration is correct. 
<!-- 输入你的 SMTP 服务器的详细信息并发送测试电子邮件以确保配置正确。 -->
On the same page you can also adjust the email template of the password reset email.
<!-- 在同一页面上，你还可以调整密码重置电子邮件的电子邮件模板。 -->

Alternatively, you can set these options via the respective [environment variables](/run/environment-configuration/#pocketbase).
<!-- 或者，你可以通过相应的[环境变量](/run/environment-configuration/#pocketbase)设置这些选项。 -->

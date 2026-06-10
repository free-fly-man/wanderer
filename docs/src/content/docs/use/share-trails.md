---
title: Share trails
# 分享路线
description: How to share trails with other users
# 如何与其他用户分享路线
---

<span class="-tracking-[0.075em]">wanderer</span> allows you to share your trails with other users. You can either publish you trail making it accessible for everyone or share it with specific users. To get started head over to `/trails` and select the trail you want to share or publish.
<!-- wanderer 允许你与其他用户分享路线。你可以发布路线使其对所有人可见，或与特定用户分享。要开始使用，请前往 `/trails` 并选择你想分享或发布的路线。 -->

## Publish a trail
<!-- 发布路线 -->

From the <span class="inline-block w-8 h-8 bg-primary rounded-full text-center text-white">⋮</span> menu select "Edit". In the panel on the right toggle the "Public" switch to on and save the trail. Your trail is now public and everyone can see it. Even people without an account.
<!-- 从 <span>⋮</span> 菜单中选择“编辑”。在右侧面板中，将“公开”开关打开并保存路线。你的路线现在是公开的，所有人都可以看到它，甚至是没有账户的人。 -->


## Share a trail
<!-- 分享路线 -->

![Share trail](../../../assets/guides/wanderer_share.gif)

If you want to be more particular about who can see your trail you can instead share your trail. From the <span class="inline-block w-8 h-8 bg-primary rounded-full text-center text-white">⋮</span> menu select "Share". In the dialog, search for the user you want to share your trail with. You can now choose the permission the user should have. You can choose between "View" or "Edit". A user with "Edit" permission can change all data (including the route) of the trail.
<!-- 如果你想更精确地控制谁能看到你的路线，可以选择分享路线。从 <span>⋮</span> 菜单中选择“分享”。在对话框中，搜索你想分享路线的用户。你现在可以选择用户应具有的权限，可以选择“查看”或“编辑”。具有“编辑”权限的用户可以更改路线的所有数据（包括路线本身）。 -->

If you no longer want to share the trail with a user, simply click the red trashcan icon next to their name.
<!-- 如果你不再想与某个用户分享路线，只需点击其姓名旁边的红色垃圾桶图标。 -->

:::note
<span class="-tracking-[0.075em]">wanderer</span> supports trail sharing between users on different instances (servers), thanks to its federated design. However, there are important limitations to be aware of:
<!-- wanderer 支持不同实例（服务器）上用户之间的路线分享，这得益于其联邦化设计。但是，有一些重要的限制需要注意： -->

- **The trail must be public** in order to be shareable with users on other instances.
<!-- **路线必须是公开的**，才能与其他实例上的用户分享。 -->
- **Shared trails are view-only**: The user you share it with will be able to view the trail and engage with it (like or comment), but **they cannot edit it**.
<!-- **分享的路线仅供查看**：与之分享的用户可以查看路线并与其互动（点赞或评论），但**无法编辑**。 -->
- Sharing a trail with another user is similar to a **mention** in the fediverse—it notifies them and gives them visibility, but does not grant collaborative access.
<!-- 与另一个用户分享路线类似于联邦宇宙中的**提及**——它会通知对方并给予可见性，但不会授予协作权限。 -->

If you're looking for true collaboration on a trail (such as shared editing), both users must be on the same instance.
<!-- 如果你寻求真正的路线协作（如共享编辑），两个用户必须在同一实例上。 -->
:::
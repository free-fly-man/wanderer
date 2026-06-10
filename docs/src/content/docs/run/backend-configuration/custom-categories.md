---
title: Custom categories
# 自定义类别
description: How to create custom trail categories
# 如何创建自定义路线类别
---

<span class="-tracking-[0.075em]">wanderer</span> uses categories to classify what kind of activity a trail belongs to. 
<!-- wanderer 使用类别来分类路线属于什么类型的活动。 -->
Out of the box you get: Biking, Canoeing, Climbing, Hiking, Skiing and Walking. 
<!-- 开箱即用，你可以得到：骑行、划独木舟、攀岩、徒步、滑雪和步行。 -->
However, you can adapt these categories to your needs or add completely new ones.
<!-- 但是，你可以根据自己的需要调整这些类别或添加全新的类别。 -->

## Modifying categories
<!-- 修改类别 -->

![Pocketbase Categories](../../../../assets/guides/pocketbase_categories.png)

In the PocketBase admin panel, click on the `categories` table in the list on the left side. 
<!-- 在 PocketBase 管理面板中，点击左侧列表中的 `categories` 表。 -->
All existing categories will be listed here. 
<!-- 所有现有类别将在此列出。 -->
To edit one simply click on the row, edit the data you want to change, and click "Save". 
<!-- 要编辑一个，只需点击该行，编辑你要更改的数据，然后点击“保存”。 -->
To delete a category check the box at the beginning of the row and click "Delete selected". 
<!-- 要删除类别，请勾选行开头的复选框，然后点击“删除所选”。 -->
To create a new category click the "New record" button in the top right corner, give your new category a name and a background image, and click "Save".
<!-- 要创建新类别，请点击右上角的“新记录”按钮，给你的新类别一个名称和背景图片，然后点击“保存”。 -->

## Category settings
<!-- 类别设置 -->

Categories can optionally define additional settings in the `settings` JSON field.
<!-- 类别可以选择性地在 `settings` JSON 字段中定义额外设置。 -->
This field may be left empty.
<!-- 此字段可以留空。 -->
When no settings are configured, <span class="-tracking-[0.075em]">wanderer</span> uses the built-in defaults.
<!-- 未配置设置时，wanderer 使用内置默认值。 -->

Currently, the following setting is supported:
<!-- 目前支持以下设置： -->

```json
{
  "wp_merge_enabled": true,
  "wp_merge_radius": 50
}
```

`wp_merge_enabled` controls whether geotagged photos are grouped into waypoint clusters.
<!-- `wp_merge_enabled` 控制带地理标记的照片是否分组到航点聚类中。 -->
Set it to `false` to create one waypoint per photo.
<!-- 将其设置为 `false` 可为每张照片创建一个航点。 -->

`wp_merge_radius` controls how close geotagged photos have to be to each other, in meters, before they are grouped into the same waypoint when adding waypoint photos to a trail.
<!-- `wp_merge_radius` 控制在向路线添加航点照片时，带地理标记的照片必须彼此多近（以米为单位）才会被分组到同一航点。 -->
Set it to `0` to only merge photos with the exact same coordinates, or increase the value to merge photos across a wider area.
<!-- 将其设置为 `0` 仅合并具有完全相同坐标的照片，或增加值以合并更广泛区域的照片。 -->

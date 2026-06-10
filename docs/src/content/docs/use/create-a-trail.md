---
title: Create a trail
# 创建路线
description: How to create a trail by uploading or drawing a trail using Valhalla
# 如何通过上传或使用 Valhalla 绘制路线来创建路线
---

## What is a trail?
<!-- 什么是路线？ -->

In <span class="-tracking-[0.075em]">wanderer</span>, a trail is a digital route that includes GPS data and descriptive metadata like name, difficulty, category, photos, and waypoints. Trails can be explored by others and searched in the app.
<!-- 在 wanderer 中，路线是包含 GPS 数据和描述性元数据（如名称、难度、类别、照片和航点）的数字路线。路线可以被其他人探索并在应用中搜索。 -->



## Create a trail
<!-- 创建路线 -->

To start, click the  <button class="h-10 text-white rounded-lg px-4 py-2 mx-2 bg-primary font-semibold transition-all hover:bg-primary-hover focus:ring-4 ring-zinc-400 leading-none">+ New Trail</button> button in the top right corner.
<!-- 要开始，请点击右上角的 <button>+ 新路线</button> 按钮。 -->



## Step 1: Pick a route
<!-- 第 1 步：选择路线 -->

Each trail must begin with a route. There are two ways to provide one:
<!-- 每条路线必须以一条路线开始。有两种提供方式： -->

### Upload a file
<!-- 上传文件 -->

Click the **Upload file** button to select a GPS file. Accepted formats are **GPX**, **FIT**, **TCX**, or **KML**.
<!-- 点击**上传文件**按钮选择 GPS 文件。接受的格式为 **GPX**、**FIT**、**TCX** 或 **KML**。 -->

After uploading:
<!-- 上传后： -->

- The map centers on the route
<!-- 地图居中于路线 -->
- Elevation profile and speed (if available) are rendered
<!-- 渲染高程剖面图和速度（如果可用） -->
- Distance, elevation gain/loss, and other metadata are extracted
<!-- 提取距离、海拔增益/损失和其他元数据 -->
- The form fields on the left will be partially prefilled with data that extracted from the file
<!-- 左侧的表单字段将部分预填充从文件中提取的数据 -->

### Draw a route
<!-- 绘制路线 -->

Click the **Draw a route** button to manually define a route on the map. While in drawing mode:
<!-- 点击**绘制路线**按钮在地图上手动定义路线。在绘制模式下： -->

- Click on the map to place waypoints
<!-- 点击地图放置航点 -->
- <span class="-tracking-[0.075em]">wanderer</span> will automatically route between points using the [Valhalla routing engine](https://github.com/valhalla/valhalla)
<!-- wanderer 将使用 [Valhalla 路线引擎](https://github.com/valhalla/valhalla) 自动在点之间规划路线 -->
- You can drag points to reposition them
<!-- 你可以拖动点来重新定位 -->
- The anchor list next to the map shows start, intermediate, and finish points with segment distance and elevation stats
<!-- 地图旁边的锚点列表显示起点、中间点和终点，以及段落距离和高程统计 -->
- Hover an item in the anchor list to highlight its marker on the map
<!-- 悬停在锚点列表中的项目上以在地图上高亮其标记 -->
- Reorder intermediate anchors from the list to adjust the route sequence
<!-- 从列表中重新排序中间锚点以调整路线顺序 -->
- Use the top-left menu to change routing mode (e.g. walking, cycling)
<!-- 使用左上角菜单更改路线模式（如步行、骑行） -->
- To remove a point, click on it and then click the red trash icon
<!-- 要删除一个点，点击它然后点击红色垃圾桶图标 -->

If you disable Valhalla routing, straight lines will be used between points instead.
<!-- 如果你禁用 Valhalla 路线规划，将改用点之间的直线。 -->

To finish drawing, click **Stop drawing**.
<!-- 要完成绘制，点击**停止绘制**。 -->

:::tip
<span class="-tracking-[0.075em]">wanderer</span> uses a public, donation-financed Valhalla server by default. Please consider supporting it at [https://www.fossgis.de/verein/spenden/](https://www.fossgis.de/verein/spenden/).
<!-- wanderer 默认使用由捐款资助的公共 Valhalla 服务器。请考虑在 [https://www.fossgis.de/verein/spenden/](https://www.fossgis.de/verein/spenden/) 支持它。 -->
:::



## Step 2: Fill out trail details
<!-- 第 2 步：填写路线详情 -->

### Basic Info
<!-- 基本信息 -->

- **Name** – Required. Every trail needs a name.
<!-- **名称** – 必填。每条路线都需要一个名称。 -->
- **Location** – Autofilled if available in the uploaded file.
<!-- **位置** – 如果上传文件中可用，则自动填充。 -->
- **Date** – Defaults to today.
<!-- **日期** – 默认为今天。 -->
- **Description** – Use the editor to describe your trail in as much detail as you want.
<!-- **描述** – 使用编辑器尽可能详细地描述你的路线。 -->
- **Distance / Duration / Elevation** – These are automatically calculated but can be manually adjusted if needed.
<!-- **距离 / 时长 / 高程** – 这些是自动计算的，但可以根据需要手动调整。 -->
- **Tags** – Add descriptive tags to help categorize and search for your trail (e.g. forest, sunset, dog-friendly). Start typing to add a tag and press Enter to confirm.
<!-- **标签** – 添加描述性标签以帮助分类和搜索你的路线（如森林、日落、可带宠物）。开始输入以添加标签，按 Enter 确认。 -->
- **Difficulty** – Select the trail's difficulty (e.g. Easy, Moderate, Hard)
<!-- **难度** – 选择路线难度（如简单、中等、困难） -->
- **Category** – Choose the activity type (e.g. Hiking, Cycling)
<!-- **类别** – 选择活动类型（如徒步、骑行） -->

### Visibility
<!-- 可见性 -->

Toggle the **Private** switch if you do not want the trail to be visible to others. When set to private, only you will be able to view and access this trail.
<!-- 如果你不希望路线对他人可见，请切换**私有**开关。设置为私有时，只有你能查看和访问此路线。 -->

:::note
Creating a public trail will automatically publish that trail to all your followers.
<!-- 创建公开路线将自动向你的所有关注者发布该路线。 -->
:::


## Step 3: Add Waypoints
<!-- 第 3 步：添加航点 -->

Waypoints are points of interest along the trail.
<!-- 航点是路线沿途的兴趣点。 -->

- Click **+ Add Waypoint** to add one manually. It will appear centered on the map and can be dragged to another location.
<!-- 点击 **+ 添加航点** 手动添加一个。它将出现在地图中心，可以拖动到其他位置。 -->
- Each waypoint can have a name, description, icon, and photos.
<!-- 每个航点可以有名称、描述、图标和照片。 -->
- Use Font Awesome icons for map markers. You can browse them at [fontawesome.com](https://fontawesome.com/search?q=share&o=r&m=free).
<!-- 使用 Font Awesome 图标作为地图标记。你可以在 [fontawesome.com](https://fontawesome.com/search?q=share&o=r&m=free) 浏览它们。 -->

Alternatively, click **From Photos** to upload photos with GPS metadata. Waypoints will be created automatically based on the photo locations.
<!-- 或者，点击**从照片**上传带有 GPS 元数据的照片。航点将根据照片位置自动创建。 -->



## Step 4: Add Photos & Videos
<!-- 第 4 步：添加照片和视频 -->

You can attach photos and videos to the trail itself. These will be shown in the trail's detail view. If you upload more than one, you can select one to be the trail's thumbnail in the overview.
<!-- 你可以将照片和视频附加到路线本身。它们将显示在路线的详细视图中。如果上传多个，你可以选择其中一个作为概览中的路线缩略图。 -->



## Step 5: Add to Summit Book
<!-- 第 5 步：添加到登顶日志 -->

If you've completed this trail yourself, you can log a summit book entry.
<!-- 如果你自己完成了这条路线，你可以记录一条登顶日志。 -->

- Click **+ Add Entry**
<!-- 点击 **+ 添加条目** -->
- Upload a separate GPS file or just log the date of your completion
<!-- 上传单独的 GPS 文件或仅记录你完成的日期 -->
- You can add multiple summit entries over time without creating duplicate trails
<!-- 你可以随时间添加多个登顶条目，而无需创建重复路线 -->

To learn more about summit logs visit the [dedicated section](/use/summit-logs) of the documentation.
<!-- 要了解有关登顶日志的更多信息，请访问文档的[专门部分](/use/summit-logs)。 -->



## Step 6: Save the trail
<!-- 第 6 步：保存路线 -->

When you're done, click   <button class="h-10 text-white rounded-lg px-4 py-2 mx-2 bg-primary font-semibold transition-all hover:bg-primary-hover focus:ring-4 ring-zinc-400 leading-none">Save Trail</button> to persist your trail to the database. This will also re-index it for search and display it in your trail list.
<!-- 完成后，点击 <button>保存路线</button> 将路线持久化到数据库。这还将重新索引它以供搜索并在你的路线列表中显示。 -->

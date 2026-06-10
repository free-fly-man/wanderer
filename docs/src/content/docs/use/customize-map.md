---
title: Customize the map
# 自定义地图
description: How to customize the map with user defined tile sets
# 如何使用用户定义的瓦片集自定义地图
---

<span class="-tracking-[0.075em]">wanderer</span> is compatible with any provider of vector tile maps (e.g. CARTO, mapbox, maptiler, or self-hosted OpenMapTiles). Out of the box it comes with 4 different map styles:
<!-- wanderer 兼容任何矢量瓦片地图提供商（如 CARTO、mapbox、maptiler 或自托管的 OpenMapTiles）。开箱即用，它提供了 4 种不同的地图样式： -->
1. OpenFreeMap
2. OpenTopoMap
3. CARTO Light
4. CARTO Dark

You can switch between these styles by opening the style switcher menu with the button on the right side of every map.
<!-- 你可以通过点击每个地图右侧的按钮打开样式切换菜单来切换这些样式。 -->

## Custom map styles
<!-- 自定义地图样式 -->

![Custom tilesets](../../../assets/guides/custom_tilesets.png)

To further personalize your map, you can add custom map styles by providing a URL to a `style.json` file. This allows you to fully control the map's appearance using your own vector tile styles. Follow these steps to add and use your custom styles:
<!-- 要进一步个性化你的地图，你可以通过提供 `style.json` 文件的 URL 来添加自定义地图样式。这允许你使用自己的矢量瓦片样式完全控制地图外观。按照以下步骤添加和使用自定义样式： -->

1. Navigate to `Settings -> Map`.
<!-- 1. 导航到 `设置 -> 地图`。 -->
2. Under the `Tilesets` section, you can add your custom map styles:
<!-- 2. 在 `瓦片集` 部分，你可以添加自定义地图样式： -->
    - Enter an arbitrary name for your style (this is how it will appear in the style switcher menu).
<!-- - 为你的样式输入一个任意名称（这将显示在样式切换菜单中）。 -->
    - Paste the URL pointing to your `style.json` file. This file should define the vector tile style you want to use.
<!-- - 粘贴指向你的 `style.json` 文件的 URL。该文件应定义你要使用的矢量瓦片样式。 -->
3. Click the + button to save your style.
<!-- 3. 点击 + 按钮保存你的样式。 -->

Once added, your custom style will be available in the style switcher menu, allowing you to quickly apply it to the map.
<!-- 添加后，你的自定义样式将在样式切换菜单中可用，允许你快速将其应用到地图。 -->


## Terrain & Hillshading
<!-- 地形和山体阴影 -->

![Custom tilesets](../../../assets/guides/wanderer_terrain.png)

To enhance <span class="-tracking-[0.075em]">wanderer</span>'s map visualization, you can add two types of data sources to display 3D Terrain and Hillshading. This is achieved by providing URLs pointing to the required `tiles.json` files. Both the terrain and hillshading data must be in Mapbox TileJSON format and accessible through the provided URLs.
<!-- 要增强 wanderer 的地图可视化，你可以添加两种类型的数据源来显示 3D 地形和山体阴影。这是通过提供指向所需 `tiles.json` 文件的 URL 来实现的。地形和山体阴影数据都必须是 Mapbox TileJSON 格式，并可通过提供的 URL 访问。 -->

To add the respective URLs navigate to `Settings -> Map` and add them in the `Terrain` section. After adding the terrain & hillshading source, you can explore the 3D map view by interacting with the compass control on the map.
<!-- 要添加相应的 URL，请导航到 `设置 -> 地图` 并在 `地形` 部分添加它们。添加地形和山体阴影源后，你可以通过与地图上的指南针控件交互来探索 3D 地图视图。 -->

1. Enable 3D terrain with the control on the bottom-right.
<!-- 1. 使用右下角的控件启用 3D 地形。 -->
2. Locate the compass control in the top-right corner of the map.
<!-- 2. 找到地图右上角的指南针控件。 -->
3. Click and drag the compass control to tilt the map into 3D mode.
<!-- 3. 点击并拖动指南针控件将地图倾斜为 3D 模式。 -->
4. Adjust the tilt and rotation as desired to view the terrain in 3D.
<!-- 4. 根据需要调整倾斜和旋转以查看 3D 地形。 -->

## Route drawing behavior
<!-- 路线绘制行为 -->

You can configure how new route drawing starts in `Settings -> Map`.
<!-- 你可以在 `设置 -> 地图` 中配置新路线绘制的开始方式。 -->

- Enable `Begin drawing a new trail from your current location` to automatically center route drawing on your current GPS location.
<!-- 启用 `从当前位置开始绘制新路线` 以自动将路线绘制居中到你当前的 GPS 位置。 -->
- Disable it to start drawing at the current map view instead.
<!-- 禁用以改为从当前地图视图开始绘制。 -->

This option only affects creating a **new** trail in the route editor.
<!-- 此选项仅影响在路线编辑器中创建**新**路线。 -->

## Trail previews on the map
<!-- 地图上的路线预览 -->

You can configure how trail previews are displayed on the main map in `Settings -> Map`.
<!-- 你可以在 `设置 -> 地图` 中配置路线预览在主地图上的显示方式。 -->

- `Show trail previews from zoom level` controls from which zoom level individual trail lines are shown instead of clustered points.
<!-- `从缩放级别显示路线预览` 控制从哪个缩放级别开始显示单独的路线而不是聚类点。 -->
- `Show marker at start of trail` adds a small marker to the beginning of visible trail previews.
<!-- `在路线起点显示标记` 在可见路线预览的开头添加一个小标记。 -->

The number of trail preview lines shown at the same time can also be limited by the `PUBLIC_MAP_MAX_POLYLINES` environment variable.
<!-- 同时显示的路线预览线数量也可以通过 `PUBLIC_MAP_MAX_POLYLINES` 环境变量来限制。 -->

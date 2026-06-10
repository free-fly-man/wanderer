---
title: Merge trails
# 合并路线
description: Link repeated or duplicate trail recordings into a single target trail.
# 将重复或重复的路线记录链接到单个目标路线。
---

<span class="-tracking-[0.075em]">wanderer</span> can link multiple trails into a single target trail. This is useful when the same route was recorded multiple times, imported from multiple services, or uploaded separately even though it belongs to the same underlying trail.
<!-- wanderer 可以将多条路线链接到单个目标路线。当同一条路线被多次记录、从多个服务导入或单独上传但实际上属于同一条基础路线时，这很有用。 -->

When a trail is merged, the source trail is converted into a summit log entry on the selected target trail. Depending on the chosen options, additional data such as photos, comments, tags and likes can also be merged.
<!-- 当路线被合并时，源路线将转换为所选目标路线上的登顶日志条目。根据所选选项，还可以合并其他数据，如照片、评论、标签和点赞。 -->

## When to Use Trail Merging
<!-- 何时使用路线合并 -->

Trail merging is helpful when:
<!-- 路线合并在以下情况很有用： -->

- you recorded the same route multiple times and want one canonical trail page
<!-- 你多次记录了同一条路线，并希望有一个标准的路线页面 -->
- a route was uploaded as a new trail, even though it was actually supposed to be a further iteration of an existing trail
<!-- 路线被作为新路线上传，尽管实际上它应该是现有路线的进一步迭代 -->

If the route already exists and you simply want to log another outing, using a [summit log](/use/summit-logs) directly is usually the better choice.
<!-- 如果路线已存在，你只是想记录另一次外出，直接使用[登顶日志](/use/summit-logs)通常是更好的选择。 -->

## Manual Merge
<!-- 手动合并 -->

You can merge trails manually from the trail actions menu:
<!-- 你可以从路线操作菜单手动合并路线： -->

- select multiple trails and choose **Link**
<!-- 选择多条路线并选择**链接** -->
- or open a single trail and choose **Merge with similar trail**
<!-- 或打开单条路线并选择**与相似路线合并** -->

Before the merge is executed, <span class="-tracking-[0.075em]">wanderer</span> asks the backend for a suggested target trail. The backend uses the same target selection strategy in all merge modes and prefers trails that preserve the most useful information.
<!-- 在执行合并之前，wanderer 会向后端请求建议的目标路线。后端在所有合并模式中使用相同的目标选择策略，并优先选择保留最多有用信息的路线。 -->

The target suggestion currently considers:
<!-- 目标建议当前考虑： -->

- existing summit logs
<!-- 现有的登顶日志 -->
- external references from integrations
<!-- 来自集成的外部引用 -->
- content richness such as comments, photos, waypoints and descriptions
<!-- 内容丰富度，如评论、照片、航点和描述 -->
- how centrally the trail geometry fits within the candidate set
<!-- 路线几何形状在候选集中的居中程度 -->
- trail age as a deterministic fallback
<!-- 路线年龄作为确定性回退 -->

Warnings are shown before the merge if the selected trails differ noticeably in geometry or location.
<!-- 如果所选路线在几何形状或位置上有明显差异，合并前将显示警告。 -->

## Automatic Matching for Similar Trails
<!-- 相似路线的自动匹配 -->

The **Merge with similar trail** action searches for strong geometric matches of the currently open trail. Only trails with a sufficiently similar forward direction are considered. Out-and-back reversals are not treated as the same trail.
<!-- **与相似路线合并**操作搜索当前打开路线的强几何匹配。只有方向足够相似的路线才会被考虑。往返反转不被视为同一条路线。 -->

## Maintenance Page
<!-- 维护页面 -->

The maintenance page groups potentially repeated or duplicate trails so that you can review them in batches:
<!-- 维护页面将可能重复或重复的路线分组，以便你可以批量审查它们： -->

- open **Settings → Repeated trails / duplicates**
<!-- 打开**设置 → 重复路线 / 重复项** -->
- inspect each group on the map
<!-- 在地图上检查每个组 -->
- choose the target trail directly in the list
<!-- 直接在列表中选择目标路线 -->
- merge the group once you are satisfied
<!-- 满意后合并该组 -->

This page is especially useful after large imports or when you want to consolidate older data.
<!-- 此页面在大量导入后或当你想整合旧数据时特别有用。 -->

## Integrations
<!-- 集成 -->

Integrations can optionally auto-merge imported trails, but only when the backend finds exactly one clear target candidate. This keeps imports conservative and avoids accidentally merging different routes.
<!-- 集成可以选择自动合并导入的路线，但仅当后端找到唯一一个明确的目标候选时。这使导入保持保守，避免意外合并不同的路线。 -->

External references from integrations are preserved during merges, so future imports can still recognize already-linked trails correctly.
<!-- 集成中的外部引用在合并期间会被保留，因此未来的导入仍然可以正确识别已链接的路线。 -->

## What Happens During a Merge
<!-- 合并期间会发生什么 -->

At a high level, the backend:
<!-- 从高层次来看，后端： -->

1. determines or receives a target trail
<!-- 1. 确定或接收目标路线 -->
2. creates a new summit log from the source trail on the target trail
<!-- 2. 在目标路线上从源路线创建新的登顶日志 -->
3. optionally merges existing summit logs, comments, likes, tags and photos
<!-- 3. 可选地合并现有的登顶日志、评论、点赞、标签和照片 -->
4. reassigns external references to the target trail
<!-- 4. 将外部引用重新分配给目标路线 -->
5. optionally deletes the source trail
<!-- 5. 可选地删除源路线 -->

The merge itself runs transactionally so partially completed merges are avoided.
<!-- 合并本身以事务方式运行，因此避免了部分完成的合并。 -->

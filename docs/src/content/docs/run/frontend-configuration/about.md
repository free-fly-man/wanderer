---
title: Edit the "About" section
# 编辑“关于”部分
description: How to how to edit the "About" section
# 如何编辑“关于”部分
---

Users that are not logged in will see an _About_ section on the front page of of <span class="-tracking-[0.075em]">wanderer</span>. You can completely customize this section to give users important information about your specific instance. 
<!-- 未登录的用户将在 wanderer 首页看到一个_关于_部分。你可以完全自定义此部分，向用户提供关于你特定实例的重要信息。 -->

![About](../../../../assets/guides/wanderer_about.png)

The content of the _About_ section is written in [Markdown](https://www.markdownguide.org/cheat-sheet/). E.g. the default content that you see above looks as follows:
<!-- _关于_部分的内容是用 [Markdown](https://www.markdownguide.org/cheat-sheet/) 编写的。例如，你在上面看到的默认内容如下所示： -->

```Markdown
Welcome to wanderer, a self-hosted service for managing and sharing your outdoor adventures.

With wanderer you can:
- Upload and store your GPS tracks (GPX files)
- Organize routes with descriptions, waypoints, photos, and tags
- Search and filter through your personal trail library
- Optionally connect with other wanderer instances via ActivityPub to share tracks across the Fediverse
- And much more

wanderer is designed for explorers who value privacy, control, and open technology.
```

Depending on how you installed <span class="-tracking-[0.075em]">wanderer</span> the process of editing the content looks slightly different:
<!-- 根据你安装 wanderer 的方式不同，编辑内容的过程略有不同： -->

## Installed via Docker
<!-- 通过 Docker 安装 -->

1. Open your docker-compose.yml file.
<!-- 1. 打开你的 docker-compose.yml 文件。 -->
2. Find the `volumes` section of the `web` container.
<!-- 2. 找到 `web` 容器的 `volumes` 部分。 -->
3. Look for the following line (it is commented out by default):
<!-- 3. 查找以下行（默认情况下它被注释掉了）： -->
```yaml 
 - ./data/about.md:/app/build/client/md/about.md
 ```
4. Uncomment the line (remove the `#` at the beginning, if present).
<!-- 4. 取消注释该行（如果存在，删除开头的 `#`）。 -->
5. Make sure the left-hand side (`./data/about.md`) points to a valid Markdown file on your host machine.
<!-- 5. 确保左侧（`./data/about.md`）指向主机上有效的 Markdown 文件。 -->
6. Save your changes and restart the container:
<!-- 6. 保存更改并重启容器： -->
```bash
docker compose restart web
```
7. Whatever you put in that Markdown file will now appear in the _About_ section.
<!-- 7. 你在该 Markdown 文件中放置的任何内容现在都将显示在_关于_部分。 -->

 ## Installed from source
 <!-- 从源代码安装 -->
1. Navigate to the `web/build/client/md/` directory.
<!-- 1. 导航到 `web/build/client/md/` 目录。 -->
2. Open the file `about.md` in your text editor of choice.
<!-- 2. 在你选择的文本编辑器中打开 `about.md` 文件。 -->
3. Replace the contents with your own Markdown text.
<!-- 3. 用你自己的 Markdown 文本替换内容。 -->
4. Save the file.
<!-- 4. 保存文件。 -->
5. No rebuild is required — the file is loaded dynamically at runtime.
<!-- 5. 无需重新构建——文件在运行时动态加载。 -->
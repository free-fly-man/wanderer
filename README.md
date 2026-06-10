<div align="center">

  <img src="web/static/svgs/logo_text_two_line_dark.svg" height="256" width="256">

  <h4>The trail catalogue that makes your GPS data searchable</h4>
  <!-- 让你的 GPS 数据可搜索的路线目录 -->

[![Docker Image Version (tag latest semver)](https://img.shields.io/docker/v/flomp/wanderer-web/latest)](https://github.com/open-wanderer/wanderer/)
[![GitHub Repo stars](https://img.shields.io/github/stars/open-wanderer/wanderer?style=social)](https://github.com/open-wanderer/wanderer/)
[![Buy Me A Coffee](https://img.shields.io/badge/Support-wanderer-yellow?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/wanderertrails)
[![Discord](https://img.shields.io/discord/1249895457396621332?style=social&logo=discord&label=Developer%20Discord)](https://discord.gg/USSEBY98CP)

[![Try the demo](https://img.shields.io/badge/Try_the_demo-EF2D5E?style=for-the-badge&logoColor=white&logo=rocket&color=2a56f1&labelColor=242734)](https://demo.wanderer.to)

</div>

wanderer is a self-hosted trail database. You can upload your recorded tracks or create new ones and add various metadata to build an easily searchable catalogue. 

<!-- wanderer 是一个自托管的路线数据库。你可以上传已记录的轨迹或创建新轨迹，并添加各种元数据来构建一个易于搜索的路线目录。 -->

## Core Features
<!-- 核心功能 -->

![Screenshot of wanderer](docs/src/assets/hero.png)

- Manage your trails
<!-- 管理你的路线 -->
- Plan new routes
<!-- 规划新路线 -->
- Extensive map integration and visualization
<!-- 丰富的地图集成与可视化 -->
- Share trails with other people and explore theirs
<!-- 与他人分享路线并探索他们的路线 -->
- Advanced filter and search functionality
<!-- 高级筛选和搜索功能 -->
- Create custom lists to organize your trails further
<!-- 创建自定义列表来进一步整理你的路线 -->
- OAuth2 login support (Google, GitHub, WeChat, and more)
<!-- OAuth2 登录支持（Google、GitHub、微信等） -->


## Getting started
<!-- 快速开始 -->
The recommended and quickest way to install wanderer is using docker compose:
<!-- 安装 wanderer 的推荐且最快捷方式是使用 docker compose： -->

``` bash
# download the docker compose file
# 下载 docker compose 文件
wget https://raw.githubusercontent.com/open-wanderer/wanderer/main/docker-compose.yml

# build and launch via docker compose
# 通过 docker compose 构建并启动
docker compose up -d
```

The first startup can take up to 90 seconds after which you can access the frontend at localhost:3000.
<!-- 首次启动可能需要最多 90 秒，之后你可以在 localhost:3000 访问前端。 -->

> ℹ️ if you are not hosting wanderer at http://localhost:3000 make sure to change ORIGIN variable. Otherwise you will run into CORS errors.
> <!-- ℹ️ 如果你不是在 http://localhost:3000 上托管 wanderer，请确保更改 ORIGIN 变量。否则你将遇到 CORS 错误。 -->

> ⚠️ if you are using wanderer in a production environment make sure to change the MEILI_MASTER_KEY variable.
> <!-- ⚠️ 如果你在生产环境中使用 wanderer，请确保更改 MEILI_MASTER_KEY 变量。 -->

You can also run wanderer on bare-metal. Check out the [documentation](https://wanderer.to/run/installation/from-source) for a detailed how-to guide.
<!-- 你也可以在裸机上运行 wanderer。查看[文档](https://wanderer.to/run/installation/from-source)获取详细的操作指南。 -->

## Support wanderer
<!-- 支持 wanderer -->

If you like wanderer and would like to give something back you can donate over [here](https://www.buymeacoffee.com/wanderertrails). If you prefer to support the development with a regular contribution you can donate via [Liberapay](https://liberapay.com/wanderer/).
<!-- 如果你喜欢 wanderer 并想回馈一些东西，可以在[这里](https://www.buymeacoffee.com/wanderertrails)捐赠。如果你希望通过定期贡献来支持开发，可以通过 [Liberapay](https://liberapay.com/wanderer/) 捐赠。 -->

## Documentation
<!-- 文档 -->

Please check the [website](https://wanderer.to) for the complete documentation.
<!-- 请访问[网站](https://wanderer.to)查看完整文档。 -->

## Contributing
<!-- 贡献 -->

Help is welcome at any time. If you are not sure where you can start check the [roadmap](https://github.com/users/Flomp/projects/2/views/1) for features in the backlog.
<!-- 随时欢迎帮助。如果你不确定从哪里开始，可以查看[路线图](https://github.com/users/Flomp/projects/2/views/1)中待开发的功能。 -->
If you would like to contribute a translation, you can do so [here](https://crowdin.com/project/wanderer).
<!-- 如果你想贡献翻译，可以在[这里](https://crowdin.com/project/wanderer)进行。 -->

## License
<!-- 许可证 -->
This project is licensed under the AGPLv3 License. See the [LICENSE](LICENSE) file for the full license text.
<!-- 本项目基于 AGPLv3 许可证授权。完整许可证文本请参阅 [LICENSE](LICENSE) 文件。 -->

# Contributing
<!-- 贡献指南 -->

Thank you for your interest in contributing to `wanderer`. We appreciate all contributions, whether they are bug fixes, documentation updates, translations, or new features.
<!-- 感谢你对为 `wanderer` 做出贡献的兴趣。我们感谢所有贡献，无论是错误修复、文档更新、翻译还是新功能。 -->

## Before you start
<!-- 开始之前 -->

Before working on a significant change, please:
<!-- 在进行重大更改之前，请： -->

- Open an issue,
<!-- 提交一个 issue， -->
- start a discussion
<!-- 发起一个讨论 -->
- or contact us via our [Discord server](https://discord.gg/USSEBY98CP) on the `#dev` channel.
<!-- 或通过我们的 [Discord 服务器](https://discord.gg/USSEBY98CP) 的 `#dev` 频道联系我们。 -->

This helps us avoid duplicate work and ensures that your changes align with the project's direction.
<!-- 这有助于我们避免重复工作，并确保你的更改与项目方向一致。 -->

For small bug or typo fixes, documentation updates, translations, or clearly isolated improvements, opening a pull request directly is usually fine.
<!-- 对于小的错误或拼写错误修复、文档更新、翻译或明显孤立的改进，直接提交 pull request 通常就可以了。 -->

Please follow our [local development guide](https://wanderer.to/develop/local-development/).
<!-- 请遵循我们的[本地开发指南](https://wanderer.to/develop/local-development/)。 -->

## Pull Request Target Branch
<!-- Pull Request 目标分支 -->

Please open pull requests only against the `main` branch.
<!-- 请仅针对 `main` 分支提交 pull request。 -->

Pull requests targeting release branches, development branches, or unrelated branches may be closed without review.
<!-- 针对发布分支、开发分支或无关分支的 pull request 可能会在未审查的情况下被关闭。 -->

## Keep pull requests atomic
<!-- 保持 pull request 原子性 -->

Please keep pull requests as small and focused as possible.
<!-- 请尽可能保持 pull request 小而专注。 -->

A good pull request should address one specific topic, such as:
<!-- 一个好的 pull request 应该解决一个具体的主题，例如： -->

- One bug fix
<!-- 一个错误修复 -->
- One isolated feature
<!-- 一个独立的功能 -->
- One documentation improvement
<!-- 一个文档改进 -->
- One dependency update
<!-- 一个依赖更新 -->
- One refactoring
<!-- 一个重构 -->

Please avoid combining unrelated changes in the same pull request. For example, do not combine a bug fix with formatting changes, dependency updates, or other refactorings.
<!-- 请避免在同一 pull request 中混合不相关的更改。例如，不要将错误修复与格式更改、依赖更新或其他重构混合在一起。 -->

Smaller pull requests are easier to review, test, and merge.
<!-- 较小的 pull request 更易于审查、测试和合并。 -->

## Describe the change clearly
<!-- 清晰描述更改 -->

Every pull request should include a clear description of the change.
<!-- 每个 pull request 都应包含对更改的清晰描述。 -->

- What was changed
<!-- 更改了什么 -->
- Why the change was needed
<!-- 为什么需要这个更改 -->
- How the change was tested
<!-- 更改是如何测试的 -->
- Any known limitations or side effects.
<!-- 任何已知的限制或副作用。 -->

For UI changes, please include screenshots when helpful.
<!-- 对于 UI 更改，请在有帮助时包含截图。 -->

## Bug fixes and reproduction steps
<!-- 错误修复和重现步骤 -->

When fixing a bug, please describe how it can be reproduced from an end-user perspective.
<!-- 修复错误时，请从最终用户的角度描述如何重现该问题。 -->

Useful reproduction steps explain the actions a user takes in the application and the problem they observe.
<!-- 有用的重现步骤应说明用户在应用中执行的操作以及他们观察到的问题。 -->

Avoid relying solely on artificial or highly technical steps, such as direct API calls to internal endpoints, unless the issue is specifically related to the API or cannot be reasonably reproduced through the user interface.
<!-- 避免仅依赖人工或高度技术性的步骤（如直接调用内部端点的 API），除非问题与 API 特别相关或无法通过用户界面合理重现。 -->

## AI-assisted contributions
<!-- AI 辅助贡献 -->

Using AI tools for assistance is allowed. While AI tools can be helpful, contributors are expected to treat AI-assisted changes like any other code they submit. They should understand, carefully review, and test the changes before opening a pull request.
<!-- 允许使用 AI 工具进行辅助。虽然 AI 工具可能很有帮助，但贡献者应像对待他们提交的任何其他代码一样对待 AI 辅助的更改。在提交 pull request 之前，他们应该理解、仔细审查并测试这些更改。 -->

If you used AI to implement a feature, improve existing functionality, or fix an issue, your pull request should clearly explain the problem or improvement, the intended user-facing behavior, and how the change was tested.
<!-- 如果你使用 AI 来实现功能、改进现有功能或修复问题，你的 pull request 应清楚地说明问题或改进、预期的用户行为以及更改是如何测试的。 -->

To keep review work manageable, we may close pull requests that appear to be mainly AI-generated or submitted in large numbers without clear evidence that the contributor has reviewed, tested, and understood the changes.
<!-- 为了保持审查工作的可管理性，我们可能会关闭那些看起来主要是 AI 生成的或大量提交的 pull request，如果没有明确证据表明贡献者已审查、测试并理解了这些更改。 -->

## Testing
<!-- 测试 -->

Please test your changes before opening a pull request.
<!-- 请在提交 pull request 之前测试你的更改。 -->

If automated tests exist for the affected area, please run them. If no automated tests exist, describe the manual testing you performed.
<!-- 如果受影响区域存在自动化测试，请运行它们。如果不存在自动化测试，请描述你执行的手动测试。 -->

A useful test description can include the following:
<!-- 有用的测试描述可以包括以下内容： -->

- Operating system/browser/environment
<!-- 操作系统/浏览器/环境 -->
- Relevant configuration
<!-- 相关配置 -->
- Exact steps tested
<!-- 测试的确切步骤 -->
- Expected and actual results
<!-- 预期结果和实际结果 -->

## Breaking changes and migrations
<!-- 破坏性更改和迁移 -->

If your PR introduces breaking changes or requires migration, clearly state this in the pull request description.
<!-- 如果你的 PR 引入了破坏性更改或需要迁移，请在 pull request 描述中清楚地说明。 -->

## Security Issues
<!-- 安全问题 -->

Please do not report security vulnerabilities through public issues or pull requests.
<!-- 请不要通过公开的 issue 或 pull request 报告安全漏洞。 -->

If you believe you have found one, please contact the maintainers privately first. You can reach us via our [Discord server](https://discord.gg/USSEBY98CP).
<!-- 如果你认为自己发现了安全漏洞，请先私下联系维护者。你可以通过我们的 [Discord 服务器](https://discord.gg/USSEBY98CP) 联系我们。 -->

## Reviews
<!-- 审查 -->

Maintainers may request changes, additional tests, a smaller scope, or a different implementation approach.
<!-- 维护者可能会要求更改、额外测试、缩小范围或采用不同的实现方法。 -->

Please keep discussions constructive and focused on the code and the user-facing behavior.
<!-- 请保持讨论具有建设性，并专注于代码和用户行为。 -->

Thank you for helping improve the project.
<!-- 感谢你帮助改进这个项目。 -->
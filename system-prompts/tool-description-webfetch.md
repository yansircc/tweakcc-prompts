<!--
name: 'Tool Description: WebFetch'
description: Tool description for web fetch functionality
ccVersion: 2.0.62
-->

获取 URL 内容并用 AI 处理（HTML 转 markdown）。

规则：
- MCP 工具可用时优先用 MCP
- URL 必须完整有效，HTTP 自动升级 HTTPS
- prompt 描述要提取的信息
- 大内容会被摘要，有 15 分钟缓存
- 重定向到其他 host 时需用新 URL 重新请求

**高效使用**（减少 Token 消耗）：

prompt 必须精准，示例：
❌ "获取页面内容"（返回全部，浪费 token）
✅ "只提取 API 接口列表和参数说明"
✅ "只提取安装命令和配置示例"
✅ "只提取错误原因和解决方案"

**避免重复请求**：
- 15 分钟内同一 URL 有缓存
- 不同 prompt 会重新处理，但不重新请求
- 多个问题合并到一个 prompt

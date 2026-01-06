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

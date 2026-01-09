<!--
name: 'Tool Description: WebSearch'
description: Tool description for web search functionality
ccVersion: 2.0.56
variables:
  - GET_CURRENT_DATE_FN
-->
搜索网页获取最新信息。用于访问知识截止日期之后的信息。

**必须**：回答后附 "Sources:" 部分，列出相关 URL：
\`\`\`
[回答内容]

Sources:
- [标题1](https://example.com/1)
- [标题2](https://example.com/2)
\`\`\`

用法：
- 支持域名过滤（include/block）
- 仅限美国可用

**重要**：搜索时用正确年份。今天是 ${GET_CURRENT_DATE_FN()}。
- 正确：用户问"最新 React 文档" → 搜索 "React documentation 2025"
- 错误：搜索 "React documentation 2024"

<!--
name: 'Tool Description: WebSearch'
description: Tool description for web search functionality
ccVersion: 2.0.56
variables:
  - GET_CURRENT_DATE_FN
-->

搜索网页获取最新信息（超出知识截止日期）。

必须：回答后附 Sources 列表，格式 \`[Title](URL)\`

规则：
- 搜索时使用正确年份（今天：${GET_CURRENT_DATE_FN()}）
- 支持 allowed_domains/blocked_domains 过滤
- 仅美国可用

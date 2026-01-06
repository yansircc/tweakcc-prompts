<!--
name: 'Tool Description: Grep'
description: Tool description for content search using ripgrep
ccVersion: 2.0.14
variables:
  - GREP_TOOL_NAME
  - BASH_TOOL_NAME
  - TASK_TOOL_NAME
-->
基于 ripgrep 的搜索工具。禁止用 ${BASH_TOOL_NAME} 调用 grep/rg。

规则：
- 支持正则：如 "log.*Error", "function\\s+\\w+"
- 过滤：glob 参数（"*.js"）或 type 参数（"js", "py"）
- 输出模式：content（匹配行）、files_with_matches（默认，仅路径）、count
- 花括号需转义：\`interface\\{\\}\`
- 跨行匹配用 multiline: true
- 多轮搜索用 ${TASK_TOOL_NAME}

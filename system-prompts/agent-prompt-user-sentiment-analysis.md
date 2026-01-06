<!--
name: 'Agent Prompt: User sentiment analysis'
description: System prompt for analyzing user frustration and PR creation requests
ccVersion: 2.0.14
variables:
  - CONVERSATION_HISTORY
-->
分析用户与助手的对话（助手回复已隐藏）。

${CONVERSATION_HISTORY}

逐步分析：
1. 用户是否对助手沮丧？寻找：重复纠正、负面语言等
2. 用户是否**明确**要求发送/创建/推送 PR 到 GitHub？即实际提交 PR，非一起准备代码。寻找："create a pr"、"send a pull request"、"push a pr"等。不计算一起准备 PR 或讨论 PR 内容。

输出：
<frustrated>true/false</frustrated>
<pr_request>true/false</pr_request>

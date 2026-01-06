<!--
name: 'Tool Description: ExitPlanMode'
description: >-
  Description for the ExitPlanMode tool, which presents a plan dialog for the
  user to approve
ccVersion: 2.0.30
variables:
  - ASK_USER_QUESTION_TOOL
-->
规划完成、准备写代码时使用。提示用户退出规划模式。

重要：仅用于需要写代码的任务规划。纯研究/搜索/理解代码库的任务不要使用。

## 处理歧义

使用前确保方案清晰无歧义。如有多种方案或需求不明：
1. 先用 ${ASK_USER_QUESTION_TOOL} 澄清
2. 询问具体选择（架构模式、使用哪个库等）
3. 确认可能影响实现的假设
4. 解决歧义后再退出

## 示例

1. "搜索并理解 vim 模式的实现" → 不用（纯研究任务）
2. "帮我实现 vim 的 yank 模式" → 规划完成后使用
3. "添加用户认证功能" → 不确定认证方式时先用 ${ASK_USER_QUESTION_TOOL} 澄清，再退出

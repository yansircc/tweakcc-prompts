<!--
name: 'Tool Description: ExitPlanMode v2'
description: >-
  V2 description for the ExitPlanMode tool, which presents a plan dialog for the
  user to approve
ccVersion: 2.0.77
variables:
  - ASK_USER_QUESTION_TOOL_NAME
-->
计划写入文件后，准备请求用户批准时使用。

## 工作方式
- 计划应已写入系统消息指定的计划文件
- 此工具不接收计划内容参数——从文件读取
- 仅作为"规划完成"信号，用户将看到文件内容

## 使用时机
仅用于需要写代码的任务规划。纯研究/搜索/理解代码库的任务不要使用。

## 使用前
确保方案清晰。如有多种方案或需求不明，先用 ${ASK_USER_QUESTION_TOOL_NAME} 澄清，再调用此工具。

**注意**：不要用 ${ASK_USER_QUESTION_TOOL_NAME} 问"计划可以吗？"/"要继续吗？"——这正是 ExitPlanMode 的作用。

## 示例
1. "搜索并理解 vim 模式的实现" → 不用（纯研究）
2. "帮我实现 vim 的 yank 模式" → 规划完成后使用
3. "添加用户认证功能" → 不确定认证方式时先用 ${ASK_USER_QUESTION_TOOL_NAME} 澄清，再退出

<!--
name: 'Tool Description: ExitPlanMode'
description: >-
  Description for the ExitPlanMode tool, which presents a plan dialog for the
  user to approve
ccVersion: 2.1.14
-->
规划完成并准备请求用户批准时使用。

## 工作原理
- 你应该已经把计划写入了规划模式系统消息中指定的计划文件
- 此工具不接受计划内容参数 - 它会读取你写的计划文件
- 此工具只是表示你已完成规划，等待用户审批
- 用户审批时会看到你的计划文件内容

## 使用时机
重要：仅用于需要写代码的任务规划。纯研究/搜索/读文件/理解代码库的任务不要使用。

## 使用前
确保方案清晰无歧义：
- 如有未解决的需求或方案问题，先用 AskUserQuestion 澄清
- 计划最终确定后，用此工具请求批准

**注意**：不要用 AskUserQuestion 问"这个计划可以吗？"或"可以继续吗？" - 这正是 ExitPlanMode 的作用。

## 示例

1. "搜索并理解 vim 模式的实现" → 不用（纯研究任务）
2. "帮我实现 vim 的 yank 模式" → 规划完成后使用
3. "添加用户认证功能" → 不确定认证方式时先用 AskUserQuestion 澄清，再退出

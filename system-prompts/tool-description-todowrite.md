<!--
name: 'Tool Description: TodoWrite'
description: Tool description for creating and managing task lists
ccVersion: 2.0.14
variables:
  - EDIT_TOOL_NAME
-->
创建和管理任务列表，跟踪进度。帮助用户理解任务和整体进展。

何时使用：
- 3+ 步骤的复杂任务
- 用户提供多个任务
- 用户明确要求
- 收到新指令后立即捕获为 todo
- 开始任务前先标记 in_progress

何时不用：
- 单一简单任务（<3 步）
- 纯信息查询
- 琐碎任务（直接做更快）

状态管理：
- pending → in_progress → completed
- 同时只有一个 in_progress
- 完成后立即标记 completed（不批量）
- 遇到阻塞保持 in_progress，新建任务描述阻塞原因
- 移除不再相关的任务

完成要求（重要）：
- 仅在**完全完成**时标记 completed
- 遇到错误/阻塞/无法完成 → 保持 in_progress
- 被阻塞时创建新任务描述待解决问题
- 以下情况**禁止**标记完成：测试失败、实现不完整、存在未解决错误

任务格式（必须两种形式）：
- content: 祈使句（如 "Run tests"）
- activeForm: 进行时（如 "Running tests"）

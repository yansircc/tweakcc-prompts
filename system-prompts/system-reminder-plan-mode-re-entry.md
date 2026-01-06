<!--
name: 'System Reminder: Plan mode re-entry'
description: >-
  System reminder sent when the user enters Plan mode after having previously
  exited it either via shift+tab or by approving Claude's plan.
ccVersion: 2.0.52
variables:
  - SYSTEM_REMINDER
  - EXIT_PLAN_MODE_TOOL_OBJECT
-->
## 重新进入规划模式

从之前退出的规划模式返回。计划文件位于 ${SYSTEM_REMINDER.planFilePath}。

**新规划前必须**：
1. 读取现有计划文件了解之前规划
2. 对比用户当前请求
3. 决定如何处理：
   - **不同任务**：即使相似，也重新开始覆盖现有计划
   - **继续同一任务**：修改现有计划，清理过时部分
4. 调用 ${EXIT_PLAN_MODE_TOOL_OBJECT.name} 前**必须**编辑计划文件

视为全新规划会话。先评估再假设现有计划是否相关。

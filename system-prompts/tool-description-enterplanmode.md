<!--
name: 'Tool Description: EnterPlanMode'
description: >-
  Tool description for entering plan mode to explore and design implementation
  approaches
ccVersion: 2.0.62
variables:
  - ASK_USER_QUESTION_TOOL_NAME
-->
非简单任务开始前主动使用，获取用户对实现方案的认可。

何时使用（满足任一）：
- 新功能实现（涉及位置/交互设计）
- 多种实现方式可选
- 影响现有行为的修改
- 架构决策（技术选型）
- 跨 2-3+ 文件的修改
- 需求不明确，需先探索
- 如需用 ${ASK_USER_QUESTION_TOOL_NAME} 澄清方案，改用 EnterPlanMode

何时不用：
- 单行/几行修复（typo、明显 bug）
- 用户已给出详细指令
- 纯研究任务（用 Task + explore agent）

计划模式流程：
1. 用 Glob/Grep/Read 探索代码库
2. 理解现有模式和架构
3. 设计实现方案
4. 呈现计划给用户审批
5. 用 ExitPlanMode 退出并开始实现

需要用户同意才能进入。不确定时倾向于规划。

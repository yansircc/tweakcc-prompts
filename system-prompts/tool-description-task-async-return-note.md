<!--
name: 'Tool Description: Task (async return note)'
description: Message returned to the model when a subagent launched successfully
ccVersion: 2.0.65
variables:
  - LAUNCHED_AGENT_INFO
  - AgentOutputTool
-->
异步代理启动成功。
agentId: ${LAUNCHED_AGENT_INFO.agentId}（内部 ID，不要告诉用户。用此 ID 通过 ${AgentOutputTool} 获取结果）

代理在后台工作。有其他任务继续做，调用 ${AgentOutputTool} 时机：
- 检查进度：block=false 立即获取状态
- 无事可做且代理仍在运行：block=true 等待结果（仅在完全无事可做时用，否则浪费时间）

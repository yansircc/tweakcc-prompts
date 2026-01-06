<!--
name: 'Tool Description: Task'
description: Tool description for launching specialized sub-agents to handle complex tasks
ccVersion: 2.0.72
variables:
  - TASK_TOOL
  - AGENT_TYPE_REGISTRY_STRING
  - READ_TOOL
  - GLOB_TOOL
  - WRITE_TOOL
  - AGENT_OUTPUT_TOOL
-->
启动子代理自主处理复杂多步任务。必须指定 subagent_type。

可用代理类型：
${AGENT_TYPE_REGISTRY_STRING}

不适用场景（用专用工具更快）：
- 读特定文件 → ${READ_TOOL.name}/${GLOB_TOOL.name}
- 搜索类定义 → ${GLOB_TOOL.name}
- 2-3 个文件内搜索 → ${READ_TOOL.name}

**必须委托给 subagent 的场景**（保护主上下文）：

| 场景 | 原因 |
|------|------|
| 探索代码库结构 | 产生大量文件列表，污染上下文 |
| 搜索多个文件（>3） | 搜索结果消耗大量 token |
| 调研问题/查文档 | 中间过程对主任务无用 |
| 验证/测试细节 | 结果可总结为一句话 |

主 agent 职责：**决策 + 执行**，不做探索。

规则：
- 提供 3-5 词描述说明代理任务
- 独立任务可并行启动多个代理
- 代理结果对用户不可见，需总结返回
- run_in_background 后台运行，后续用 ${TASK_TOOL} 获取结果
- resume 参数可恢复之前的代理（保留上下文）
- 明确告知代理是写代码还是仅研究
- "access to current context" 代理可引用对话历史

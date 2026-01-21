<!--
name: 'Tool Description: Task'
description: Tool description for launching specialized sub-agents to handle complex tasks
ccVersion: 2.1.4
variables:
  - TASK_TOOL
  - AGENT_TYPE_REGISTRY_STRING
  - READ_TOOL
  - GLOB_TOOL
  - GET_SUBSCRIPTION_TYPE_FN
  - IS_TRUTHY_FN
  - PROCESS_OBJECT
  - BASH_TOOL
  - TASK_TOOL_OBJECT
  - WRITE_TOOL
-->
启动子代理自主处理复杂多步任务。

${TASK_TOOL} 启动专用代理（子进程），每种类型有特定能力和可用工具。

可用代理类型：
${AGENT_TYPE_REGISTRY_STRING}

必须指定 subagent_type 参数选择代理类型。

**不要**使用 ${TASK_TOOL} 的情况：
- 读特定文件路径 → 用 ${READ_TOOL} 或 ${GLOB_TOOL}
- 搜索类定义如 "class Foo" → 用 ${GLOB_TOOL}
- 在 2-3 个文件内搜索代码 → 用 ${READ_TOOL}
- 与上述代理描述无关的任务

用法：
- 总是包含简短描述（3-5 词）${GET_SUBSCRIPTION_TYPE_FN()!=="pro"?`
- 尽可能并行启动多代理：单消息多工具调用`:""}
- 代理返回结果对用户不可见，需发文本消息摘要给用户${!IS_TRUTHY_FN(PROCESS_OBJECT.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)?`
- run_in_background 后台运行，返回 output_file 路径，用 ${READ_TOOL} 或 ${BASH_TOOL} \`tail\` 查看`:""}
- resume 参数传 agent ID 可恢复之前的代理（保留完整上下文）
- 代理完成后返回消息和 agent ID，可用于后续恢复
- 提供清晰详细的 prompt，让代理自主完成并返回所需信息
- "access to current context" 的代理可见完整对话历史，可用简洁 prompt 引用上下文
- 代理输出通常可信
- 明确告知代理是写代码还是仅研究
- 代理描述提到"主动使用"时，无需用户要求即可启动
- 用户要求"并行"运行代理时，**必须**单消息多个 ${TASK_TOOL_OBJECT.name} 调用

示例：

<example_agent_descriptions>
"test-runner": 写完代码后运行测试
"greeting-responder": 回应用户问候
</example_agent_description>

<example>
user: "写一个判断素数的函数"
assistant: 用 ${WRITE_TOOL} 写代码
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
写完代码后用 test-runner 代理运行测试
</commentary>
assistant: 用 ${TASK_TOOL_OBJECT.name} 启动 test-runner 代理
</example>

<example>
user: "Hello"
<commentary>
用户打招呼，用 greeting-responder 代理回应
</commentary>
assistant: 用 ${TASK_TOOL_OBJECT.name} 启动 greeting-responder 代理
</example>

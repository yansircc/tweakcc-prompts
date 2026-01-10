<!--
name: 'Tool Description: MCPSearch (with available tools)'
description: Tool description for the MCPSearch tool with available tools listed
ccVersion: 2.0.70
variables:
  - TOOLS
  - TOOL
-->
搜索或选择 MCP 工具以使其可用。

**强制前置条件——硬性要求**

调用 MCP 工具前**必须**先用此工具加载。

这是阻断性要求——下列 MCP 工具在用此工具加载前**不可用**。

**为何不可协商：**
- MCP 工具延迟加载，需通过此工具发现后才加载
- 未加载直接调用会失败

**查询模式：**

1. **直接选择** - 确切知道需要哪个工具时用 \`select:<tool_name>\`：
   - "select:mcp__slack__read_channel"
   - "select:mcp__filesystem__list_directory"
   - 存在则返回该工具

2. **关键词搜索** - 不确定用哪个工具时用关键词：
   - "list directory" - 查找目录列表工具
   - "read file" - 查找文件读取工具
   - "slack message" - 查找 slack 消息工具
   - 返回最多 5 个按相关性排序的工具

**正确用法：**

<example>
User: List files in the src directory
Assistant: 看到可用工具中有 mcp__filesystem__list_directory，选择它。
[调用 MCPSearch，query: "select:mcp__filesystem__list_directory"]
[调用该 MCP 工具]
</example>

<example>
User: I need to work with slack somehow
Assistant: 搜索 slack 工具。
[调用 MCPSearch，query: "slack"]
Assistant: 找到几个选项，含 mcp__slack__read_channel。
[调用该 MCP 工具]
</example>

**错误用法——禁止这样做：**

<bad-example>
User: Read my slack messages
Assistant: [未先加载直接调用 mcp__slack__read_channel]
错误 - 必须先用此工具加载
</bad-example>

可用 MCP 工具（使用前必须加载）：
${TOOLS.map((TOOL)=>TOOL.name).join(`
`)}

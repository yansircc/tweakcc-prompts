<!--
name: 'Tool Description: MCPSearch (with available tools)'
description: Tool description for the MCPSearch tool with available tools listed
ccVersion: 2.0.70
variables:
  - TOOLS
  - TOOL
-->
搜索或选择 MCP 工具使其可用。

**硬性要求**：调用 MCP 工具前**必须**先用此工具加载。MCP 工具延迟加载，未发现则不可用，直接调用会失败。

**查询模式**：

1. **直接选择**：\`select:<tool_name>\`（已知工具名）
2. **关键词搜索**：返回最多 5 个匹配工具

**正确用法**：先 MCPSearch 加载，再调用工具
**错误用法**：直接调用未加载的工具 → 失败

可用 MCP 工具（使用前须加载）：
${TOOLS.map((TOOL)=>TOOL.name).join(`
`)}

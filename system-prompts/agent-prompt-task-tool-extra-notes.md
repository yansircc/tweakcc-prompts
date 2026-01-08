<!--
name: 'Agent Prompt: Task tool (extra notes)'
description: >-
  Additional notes for Task tool usage (absolute paths, no emojis, no colons
  before tool calls)
ccVersion: 2.0.77
-->

子代理注意事项：
- bash 调用间 cwd 会重置，**只用绝对路径**
- 响应中的文件路径必须是绝对路径
- 不用 emoji
- 工具调用前不用冒号（用句号）

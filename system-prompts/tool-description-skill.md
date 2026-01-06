<!--
name: 'Tool Description: Skill'
description: Tool description for executing skills in the main conversation
ccVersion: 2.0.73
variables:
  - FORMAT_SKILLS_AS_XML_FN
  - LIMITED_COMMANDS
  - AVAILABLE_SKILLs
-->
在主对话中执行技能

<skills_instructions>
用户请求任务时，检查下方可用技能是否能更有效完成。技能提供专门能力和领域知识。

用户说"斜杠命令"或"/<xxx>"（如"/commit"、"/review-pr"）即指技能，用此工具调用。

<example>
User: "run /commit"
Assistant: [调用 Skill 工具 skill: "commit"]
</example>

调用方式：
- \`skill: "pdf"\` - 调用技能
- \`skill: "commit", args: "-m 'Fix bug'"\` - 带参数
- \`skill: "ms-office-suite:pdf"\` - 完整名称

重要：
- 技能相关时必须**立即调用**，作为第一个动作
- **禁止**只在文本中提及技能而不调用
- 这是阻断性要求：先调用 Skill 再生成其他响应
- 仅用下方列出的技能
- 不调用已运行的技能
- 不用于内置命令（/help、/clear 等）
</skills_instructions>

<available_skills>
${FORMAT_SKILLS_AS_XML_FN(LIMITED_COMMANDS,AVAILABLE_SKILLs.length)}
</available_skills>

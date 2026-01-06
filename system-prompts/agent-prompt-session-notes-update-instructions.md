<!--
name: 'Agent Prompt: Session notes update instructions'
description: Instructions for updating session notes files during conversations
ccVersion: 2.0.58
variables:
  - MAX_SECTION_TOKENS
-->
**重要**：此指令不是用户对话的一部分。笔记中不要提及"note-taking"或此指令。

基于上方用户对话（排除此指令、系统提示、claude.md、历史摘要），更新会话笔记。

文件 {{notesPath}} 当前内容：
<current_notes_content>
{{currentNotes}}
</current_notes_content>

**任务**：仅用 Edit 工具更新笔记，然后停止。可并行多个编辑。

## 编辑规则

结构保持：
- **禁止**修改/删除/添加章节标题（# 开头的行）
- **禁止**修改/删除斜体 _章节描述_（标题后的模板指令）
- **仅**更新斜体描述下方的实际内容

内容规则：
- 无新见解时可跳过章节，不加填充内容
- 写详细、信息密集的内容：文件路径、函数名、错误信息、命令、技术细节
- "Key results" 含完整输出
- 不含 CLAUDE.md 已有信息
- 每节 ~${MAX_SECTION_TOKENS} tokens，超限时保留关键信息
- 聚焦可操作的具体信息
- **必须**更新 "Current State" 反映最新工作

Edit tool 用 file_path: {{notesPath}}

**结构提醒**：每节两部分需保留：1) 章节标题 2) 斜体描述。仅更新这两行之后的内容。

编辑完成后停止。仅含用户对话洞见。

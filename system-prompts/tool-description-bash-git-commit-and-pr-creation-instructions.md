<!--
name: 'Tool Description: Bash (Git commit and PR creation instructions)'
description: Instructions for creating git commits and GitHub pull requests
ccVersion: 2.1.3
variables:
  - BASH_TOOL_NAME
  - COMMIT_CO_AUTHORED_BY_CLAUDE_CODE
  - TODO_TOOL_OBJECT
  - TASK_TOOL_NAME
  - PR_GENERATED_WITH_CLAUDE_CODE
  - GIT_COMMAND_PARALLEL_NOTE
-->
# Git 提交

仅在用户请求时创建提交。不确定就先问。

## Git 安全协议

- **禁止**：更新 git config
- **禁止**：破坏性命令（push --force、hard reset 等），除非用户明确要求
- **禁止**：跳过 hooks（--no-verify 等），除非用户明确要求
- **禁止**：force push 到 main/master，要求时警告用户
- **禁止**：未经用户明确要求不提交——过度主动会让用户不满
- **amend 限制**：仅当满足所有条件：
  1. 用户明确要求 amend，或 commit 成功但 pre-commit hook 自动修改了文件需包含
  2. HEAD commit 是本次对话中你创建的（验证：git log -1 --format='%an %ae'）
  3. 未推送到远程（验证：git status 显示 "Your branch is ahead"）
- **关键**：commit 失败或被 hook 拒绝时，**禁止 amend**——修复问题后创建新 commit
- **关键**：已推送到远程后，**禁止 amend**，除非用户明确要求（需 force push）

## 提交步骤

1. ${BASH_TOOL_NAME} 并行运行：
   - git status（查看未跟踪文件，禁止用 -uall）
   - git diff（查看将提交的更改）
   - git log（查看最近提交消息风格）
2. 分析更改，起草 commit message：
   - 总结更改性质（新功能/增强/修复/重构/测试/文档）
   - 不提交含密钥的文件（.env、credentials.json 等），用户坚持则警告
   - 简洁（1-2 句），关注"为什么"而非"什么"
3. ${BASH_TOOL_NAME} 运行：
   - 添加相关文件到暂存区
   - 创建 commit（消息${TODO_TOOL_OBJECT?`以此结尾：\n   ${TODO_TOOL_OBJECT}`:""}）
   - commit 完成后运行 git status 验证
4. pre-commit hook 失败时，修复问题并创建新 commit

**重要**：
- 禁止额外读取/探索代码的命令
- 禁止用 ${TASK_TOOL_NAME.name} 或 ${PR_GENERATED_WITH_CLAUDE_CODE}
- 禁止推送，除非用户明确要求
- 禁止 -i 交互式命令（如 git rebase -i）
- 无更改时不创建空 commit
- 用 HEREDOC 传递 commit message：
\`\`\`
git commit -m "$(cat <<'EOF'
   Commit message.${TODO_TOOL_OBJECT?`

   ${TODO_TOOL_OBJECT}`:""}
   EOF
   )"
\`\`\`

# 创建 PR

用 gh 命令处理所有 GitHub 任务。

## 步骤

1. ${BASH_TOOL_NAME} 并行运行：
   - git status（禁止 -uall）
   - git diff
   - 检查分支是否跟踪远程
   - git log 和 \`git diff [base-branch]...HEAD\`（查看分叉后的所有提交）
2. 分析**所有**将包含在 PR 中的提交（非仅最新），起草 PR 摘要
3. ${BASH_TOOL_NAME} 并行运行：
   - 需要时创建新分支
   - 需要时用 -u 推送到远程
   - 用 gh pr create 创建 PR（用 HEREDOC）：
\`\`\`
gh pr create --title "标题" --body "$(cat <<'EOF'
## Summary
<1-3 要点>

## Test plan
[测试清单...]${GIT_COMMAND_PARALLEL_NOTE?`

${GIT_COMMAND_PARALLEL_NOTE}`:""}
EOF
)"
\`\`\`

**重要**：
- 禁止用 ${TASK_TOOL_NAME.name} 或 ${PR_GENERATED_WITH_CLAUDE_CODE}
- 完成后返回 PR URL

# 其他操作

- 查看 PR 评论：gh api repos/foo/bar/pulls/123/comments

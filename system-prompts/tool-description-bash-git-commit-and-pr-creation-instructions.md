<!--
name: 'Tool Description: Bash (Git commit and PR creation instructions)'
description: Instructions for creating git commits and GitHub pull requests
ccVersion: 2.0.77
variables:
  - BASH_TOOL_NAME
  - COMMIT_CO_AUTHORED_BY_CLAUDE_CODE
  - TODO_TOOL_OBJECT
  - TASK_TOOL_NAME
  - PR_GENERATED_WITH_CLAUDE_CODE
  - GIT_COMMAND_PARALLEL_NOTE
-->
# Git Commit

用户明确要求时才提交。

安全规则：
- 禁止：更新 git config、force push、跳过 hooks（--no-verify）、交互模式（-i）
- force push to main/master 需警告用户
- amend 条件（全满足）：用户要求 + 本次对话创建的 HEAD（验证：git log -1）+ 未 push（验证：git status）
- hook 失败时**修复问题后**创建新 commit，不 amend

流程：
1. 并行：git status / git diff / git log（查看提交风格）
2. 分析变更，写 commit message（1-2 句，focus on why）
3. git add → git commit（HEREDOC 格式）→ git status 验证${COMMIT_CO_AUTHORED_BY_CLAUDE_CODE?`
4. message 结尾加：${COMMIT_CO_AUTHORED_BY_CLAUDE_CODE}`:""}

注意：不提交含密钥文件（.env 等），非用户要求不 push，禁用 ${TODO_TOOL_OBJECT.name}/${TASK_TOOL_NAME}

# PR 创建

用 gh 命令处理 GitHub 任务。

流程：
1. 并行：git status / diff / log / diff base...HEAD
2. 分析所有 commit（非仅最新），写 PR 摘要
3. 并行：创建分支（如需）/ push -u / gh pr create

格式：gh pr create --title "title" --body "$(cat <<'EOF' ... EOF)"，body 含 Summary + Test plan${PR_GENERATED_WITH_CLAUDE_CODE?` + ${PR_GENERATED_WITH_CLAUDE_CODE}`:""}

完成后返回 PR URL。

# 其他
查看 PR 评论：gh api repos/foo/bar/pulls/123/comments

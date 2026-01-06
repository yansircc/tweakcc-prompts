<!--
name: 'System Prompt: Git status'
description: >-
  System prompt for displaying the current git status at the start of the
  conversation
ccVersion: 2.0.72
variables:
  - CURRENT_BRANCH
  - MAIN_BRANCH
  - GIT_STATUS
  - RECENT_COMMITS
-->
gitStatus: 对话开始时的 git 状态快照，对话期间不更新。
Current branch: ${CURRENT_BRANCH}

Main branch (you will usually use this for PRs): ${MAIN_BRANCH}

Status:
${GIT_STATUS||"(clean)"}

Recent commits:
${RECENT_COMMITS}

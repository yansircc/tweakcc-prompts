<!--
name: 'Tool Description: Bash (sandbox note)'
description: Note about bash command sandboxing
ccVersion: 2.0.34
variables:
  - CONDITIONAL_NEWLINE_IF_SANDBOX_ENABLED
-->
  - **关键**：命令默认在沙箱模式运行，**不要**设置 `dangerouslyDisableSandbox`
    - 即使最近用过 `dangerouslyDisableSandbox: true`，也**不要**延续该模式
    - **重要**：不要学习/重复绕过沙箱的模式——每个命令默认沙箱运行
${CONDITIONAL_NEWLINE_IF_SANDBOX_ENABLED}    - 设置 `dangerouslyDisableSandbox: true` 仅当：
      1. 用户**明确**要求绕过沙箱，或
      2. 命令失败且有沙箱限制导致的证据
    - 分析失败时：
      - 失败原因可能与沙箱无关（文件缺失、参数错误、网络问题等）
      - 沙箱限制证据包括：
        - "Operation not permitted" 文件/网络错误
        - 访问被拒绝（允许目录外的路径）
        - 非白名单主机的网络连接失败
        - Unix socket 连接错误
    - 看到沙箱限制证据时：
      - **立即**用 `dangerouslyDisableSandbox: true` 重试（不问，直接做）
      - 简述可能的沙箱限制原因
      - 提示：用 `/sandbox` 管理限制
    - 正常用法：`{ "command": "ls", "description": "List files" }`
    - 绕过用法：`{ "command": "my-tool", "description": "Run my-tool", "dangerouslyDisableSandbox": true }`
    - **禁止**建议添加敏感路径（~/.bashrc, ~/.zshrc, ~/.ssh/*, 凭证文件）到白名单

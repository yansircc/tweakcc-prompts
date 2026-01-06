# Claude Code 高性能优化补丁

> 通过修改 Claude Code 的工具描述，让 AI Agent 自动选择更高效的工具和策略，实现极致性能提升。

## What - 这是什么

这是一套 Claude Code 系统提示词优化补丁，通过修改工具描述来引导 Claude：

- **使用高性能 CLI 工具** - 用 `fd` 替代 `find`，用 `ast-grep` 替代 `grep`
- **限制输出长度** - 减少 40% Token 消耗
- **强制结构化输出** - 便于解析，提升效率 50%
- **智能工具选择** - LSP > ast-grep > Grep，减少 50% 工具调用
- **Subagent 委托策略** - 保护主上下文，避免污染

## Why - 为什么需要

Claude Code 默认使用通用策略，但存在优化空间：

| 问题 | 影响 | 本补丁解决方案 |
|------|------|----------------|
| 使用 `find` 搜索文件 | 慢 | 强制用 `fd`（快 5-10x） |
| 文本搜索找代码结构 | 不精准 | 用 `ast-grep` 语义搜索 |
| 输出无限制 | Token 浪费 | 强制 `head -N` 限制 |
| 人类可读格式 | 解析困难 | 强制结构化输出 |
| 大文件全量读取 | Token 爆炸 | 智能分段读取 |
| 搜索代替 LSP | 多次调用 | LSP 优先策略 |

**预期收益**：
- Token 消耗 **-40%**
- 工具调用次数 **-50%**
- 执行速度 **5-10x**（文件搜索场景）

## How - 如何使用

### 1. 安装依赖工具

```bash
# macOS
brew install fd ripgrep ast-grep jq tokei hyperfine parallel

# 验证安装
fd --version && sg --version && jq --version && tokei --version
```

### 2. 安装 tweakcc

[tweakcc](https://github.com/Piebald-AI/tweakcc) 是一个 Claude Code 补丁工具，可以自定义系统提示词。

```bash
# 首次运行，生成配置目录
npx tweakcc
```

这会在 `~/.tweakcc/system-prompts/` 创建默认的工具描述文件。

### 3. 应用本补丁

将本仓库的文件复制到 tweakcc 配置目录：

```bash
# 备份原有配置
cp -r ~/.tweakcc/system-prompts ~/.tweakcc/system-prompts.bak

# 复制优化后的工具描述
cp system-prompts/*.md ~/.tweakcc/system-prompts/
```

### 4. 打补丁到 Claude Code

```bash
npx tweakcc --apply
```

### 5. 启动 Claude Code

```bash
claude
```

现在 Claude 会自动使用优化后的工具策略！

### 更新 Claude Code 后

每次更新 Claude Code，自定义会被覆盖。只需重新运行：

```bash
npx tweakcc --apply
```

## 优化清单

### 已优化的工具

| 工具 | 优化内容 |
|------|----------|
| **Glob** | 禁用，强制用 `fd` |
| **Bash** | 高性能工具表、输出限制、结构化输出、项目缓存 |
| **Grep** | `ast-grep` 优先、输出限制、代码查找决策树 |
| **LSP** | 优先策略（比搜索精准，1 次调用解决） |
| **Read** | 智能读取策略（大文件分段读） |
| **Edit** | 预检查（减少失败重试） |
| **Write** | 预检查、优先用 Edit |
| **Task** | Subagent 委托策略（保护上下文） |
| **WebFetch** | 精准 prompt、缓存提示 |

### 高性能工具速查

| 场景 | 命令 | 说明 |
|------|------|------|
| 文件搜索 | `fd -e ts --type f . /path` | 比 find 快 5-10x |
| 代码搜索 | `sg -p 'pattern' --lang ts` | AST 语义搜索 |
| JSON 处理 | `jq '.key'` | 结构化查询 |
| 代码统计 | `tokei` | 快速了解项目 |
| 并行执行 | `xargs -P 8` | 多核加速 |

### 代码查找决策树

```
查找代码 →
  ├─ 知道文件和行号 → Read（直接读取）
  ├─ 找定义/引用/实现 → LSP（最精准，1次调用）
  ├─ 找代码结构（函数/类/import）→ ast-grep
  ├─ 找关键词/字符串 → Grep
  └─ 探索未知代码库 → Task subagent（保护上下文）
```

## 参考资料

- [tweakcc](https://github.com/Piebald-AI/tweakcc) - Claude Code 补丁工具
- [claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) - 官方系统提示词提取
- [fd](https://github.com/sharkdp/fd) - 高性能文件搜索
- [ast-grep](https://github.com/ast-grep/ast-grep) - AST 语义搜索
- [ripgrep](https://github.com/BurntSushi/ripgrep) - 高性能文本搜索
- [jq](https://github.com/jqlang/jq) - JSON 处理器
- [tokei](https://github.com/XAMPPRocky/tokei) - 代码统计

## License

MIT

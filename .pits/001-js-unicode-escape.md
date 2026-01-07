# PIT-001: JavaScript Unicode Escape Sequence

## 问题

在 system prompt 中使用 Perl 修饰符（`\u`, `\l`, `\L`, `\U`, `\E`）时，被 JavaScript 解析为 Unicode 转义序列，导致语法错误。

## 症状

```
SyntaxError: Invalid Unicode escape sequence
    at compileSourceTextModule (node:internal/modules/esm/utils:346:16)
```

## 根因

tweakcc 将 system prompt 嵌入到 cli.js 中，JavaScript 会将 `\u` 解释为 Unicode 转义序列（如 `\u0041` = "A"）。

## 解决方案

双重转义：`\u` → `\\u`

## 泛化规则

**在 system prompt 中写反斜杠相关内容时，必须双重转义：**

| 原始字符 | 必须写成 |
|----------|----------|
| `\u` | `\\u` |
| `\l` | `\\l` |
| `\n` | `\\n` |
| `\t` | `\\t` |
| `\\` | `\\\\` |

## 预防

- 添加 pre-commit hook 运行 `npx tweakcc --apply` 验证语法
- 修改 system prompt 后必须测试 `cc` 命令能否启动

## 相关 Commit

- fix: 6b3794d622aaec15b8843f2a9e79b5a085490ad2

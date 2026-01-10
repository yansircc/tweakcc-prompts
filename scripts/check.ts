#!/usr/bin/env bun
/**
 * Tweakcc 提示词状态检查工具
 *
 * 功能：
 * - 检查所有提示词文件的翻译状态
 * - 检测语法风险（嵌套模板、join 模板等）
 * - 提供 JSON 输出供 agent 使用
 *
 * 用法：
 *   bun run check          # 人类友好输出
 *   bun run check --json   # JSON 输出（供 agent 使用）
 *   bun run check --help   # 帮助
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";

const PROMPTS_DIR = join(import.meta.dir, "../system-prompts");

// ============ 类型定义 ============

interface FileInfo {
  name: string;
  version: string;
  lang: "zh" | "en" | "mixed";
  category: "translated" | "translatable" | "careful" | "keep";
  risks: Risk[];
}

interface Risk {
  type: "nested-template" | "template-join" | "unescaped-codeblock";
  line: number;
  column: number;
  message: string;
}

interface CheckResult {
  total: number;
  translated: FileInfo[];
  translatable: FileInfo[];
  careful: FileInfo[];
  keep: FileInfo[];
  summary: {
    translated: number;
    translatable: number;
    careful: number;
    keep: number;
  };
}

// ============ 检测函数 ============

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

function extractVersion(content: string): string {
  const match = content.match(/ccVersion:\s*([0-9.]+)/);
  return match?.[1] ?? "unknown";
}

function detectLang(content: string): "zh" | "en" | "mixed" {
  const body = content.replace(/<!--[\s\S]*?-->/, "").trim();
  const lines = body.split("\n").filter(l => l.trim() && !l.startsWith("$"));

  let zhCount = 0;
  let enCount = 0;

  for (const line of lines.slice(0, 20)) {
    if (hasChinese(line)) zhCount++;
    else if (/^[A-Z][a-z]/.test(line.trim())) enCount++;
  }

  if (zhCount > enCount * 2) return "zh";
  if (enCount > zhCount * 2) return "en";
  return "mixed";
}

function detectRisks(content: string): Risk[] {
  const risks: Risk[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // 检测嵌套模板字符串
    const nestedMatch = line.match(/\$\{[^}]*\?\s*`/);
    if (nestedMatch) {
      risks.push({
        type: "nested-template",
        line: lineNum,
        column: nestedMatch.index! + 1,
        message: "嵌套模板字符串 - 翻译时保持 ${...?`...`:`...`} 结构",
      });
    }

    // 检测 .join() 模板
    const joinMatch = line.match(/\.join\s*\(\s*`/);
    if (joinMatch) {
      risks.push({
        type: "template-join",
        line: lineNum,
        column: joinMatch.index! + 1,
        message: ".join() 模板 - 保持原样或改用双引号 .join(\"\\n\")",
      });
    }
  }

  return risks;
}

function categorize(name: string, lang: "zh" | "en" | "mixed", risks: Risk[]): FileInfo["category"] {
  // GitHub 相关文件 - 保持原样
  if (name.includes("github") || name.includes("session-notes-template")) {
    return "keep";
  }

  // 低价值文件 - 保持原样（内容简单/影响小/使用频率低）
  if (name.includes("scratchpad") ||
      name.includes("git-status") ||
      name.includes("review-pr") ||
      name.includes("re-entry")) {
    return "keep";
  }

  // 已翻译
  if (lang === "zh") {
    return "translated";
  }

  // 混合语言 - 保持原样
  if (lang === "mixed") {
    return "keep";
  }

  // 英文 + 有风险 - 需小心翻译
  if (risks.length > 0) {
    return "careful";
  }

  // 英文 + 无风险 - 可直接翻译
  return "translatable";
}

// ============ 主逻辑 ============

async function checkAll(): Promise<CheckResult> {
  const files = await readdir(PROMPTS_DIR);
  const mdFiles = files.filter(f => f.endsWith(".md") && !f.includes(".diff."));

  const translated: FileInfo[] = [];
  const translatable: FileInfo[] = [];
  const careful: FileInfo[] = [];
  const keep: FileInfo[] = [];

  for (const name of mdFiles) {
    const content = await readFile(join(PROMPTS_DIR, name), "utf-8");
    const version = extractVersion(content);
    const lang = detectLang(content);
    const risks = detectRisks(content);
    const category = categorize(name, lang, risks);

    const info: FileInfo = { name, version, lang, category, risks };

    switch (category) {
      case "translated": translated.push(info); break;
      case "translatable": translatable.push(info); break;
      case "careful": careful.push(info); break;
      case "keep": keep.push(info); break;
    }
  }

  return {
    total: mdFiles.length,
    translated,
    translatable,
    careful,
    keep,
    summary: {
      translated: translated.length,
      translatable: translatable.length,
      careful: careful.length,
      keep: keep.length,
    },
  };
}

function printHuman(result: CheckResult) {
  const { total, translated, translatable, careful, keep, summary } = result;

  console.log("\n📊 Tweakcc 提示词状态\n");
  console.log(`总计: ${total} | ✅ 已翻译: ${summary.translated} | 📝 待翻译: ${summary.translatable} | ⚠️ 需小心: ${summary.careful} | 🔀 保持: ${summary.keep}\n`);

  if (careful.length > 0) {
    console.log("\x1b[33m⚠️  需小心翻译 (" + careful.length + ")\x1b[0m");
    console.log("   含嵌套模板字符串，翻译时保持语法结构完整");
    for (const f of careful) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
      for (const r of f.risks.slice(0, 2)) {
        console.log(`      └─ L${r.line}: ${r.message}`);
      }
      if (f.risks.length > 2) {
        console.log(`      └─ ... 还有 ${f.risks.length - 2} 处`);
      }
    }
    console.log();
  }

  if (translatable.length > 0) {
    console.log("\x1b[32m📝 可直接翻译 (" + translatable.length + ")\x1b[0m");
    console.log("   无语法风险，可安全翻译");
    for (const f of translatable) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
    }
    console.log();
  }

  if (keep.length > 0) {
    console.log("\x1b[36m🔀 保持原样 (" + keep.length + ")\x1b[0m");
    console.log("   GitHub 模板/混合语言/低价值文件，不建议翻译");
    for (const f of keep) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
    }
    console.log();
  }

  if (translated.length > 0) {
    console.log("\x1b[90m✅ 已翻译 (" + translated.length + ")\x1b[0m");
    // 只显示有风险的已翻译文件
    const withRisks = translated.filter(f => f.risks.length > 0);
    if (withRisks.length > 0) {
      console.log("   以下文件含嵌套模板（已成功翻译，供参考）：");
      for (const f of withRisks.slice(0, 5)) {
        console.log(`   ${f.version.padEnd(8)} ${f.name} (${f.risks.length} 处)`);
      }
      if (withRisks.length > 5) {
        console.log(`   ... 还有 ${withRisks.length - 5} 个`);
      }
    } else {
      console.log("   全部无语法风险");
    }
    console.log();
  }

  // 版本统计
  const versions = new Map<string, number>();
  for (const f of [...translated, ...translatable, ...careful, ...keep]) {
    versions.set(f.version, (versions.get(f.version) ?? 0) + 1);
  }

  console.log("📦 版本分布（前 5）");
  const sorted = [...versions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  for (const [v, count] of sorted) {
    console.log(`   ${v.padEnd(8)} ${count} 个`);
  }
  console.log();
}

function printJson(result: CheckResult) {
  console.log(JSON.stringify(result, null, 2));
}

function printHelp() {
  console.log(`
Tweakcc 提示词状态检查工具

用法:
  bun run check          人类友好输出
  bun run check --json   JSON 输出（供 agent 使用）
  bun run check --help   显示帮助

分类说明:
  ✅ translated   已翻译为中文
  📝 translatable 可直接翻译（无语法风险）
  ⚠️  careful      需小心翻译（含嵌套模板）
  🔀 keep         保持原样（GitHub 模板/混合语言）

翻译建议:
  1. 优先翻译 translatable 类别
  2. careful 类别需保持 \${...?\`...\`:\`...\`} 结构
  3. keep 类别不建议翻译
`);
}

// ============ 入口 ============

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const result = await checkAll();

  if (args.includes("--json")) {
    printJson(result);
  } else {
    printHuman(result);
  }
}

main().catch(console.error);

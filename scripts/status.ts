#!/usr/bin/env bun
/**
 * 检查所有提示词文件的状态
 * - 语言（中文/英文）
 * - ccVersion 版本
 * - 是否有语法问题
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";

const PROMPTS_DIR = join(import.meta.dir, "../system-prompts");

interface FileStatus {
  name: string;
  version: string;
  lang: "zh" | "en" | "mixed";
  hasIssues: boolean;
  issues: string[];
}

// 检测是否包含中文
function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

// 提取 ccVersion
function extractVersion(content: string): string {
  const match = content.match(/ccVersion:\s*([0-9.]+)/);
  return match?.[1] ?? "unknown";
}

// 检测语言
function detectLang(content: string): "zh" | "en" | "mixed" {
  // 移除 frontmatter
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

// 检测语法问题
function detectIssues(content: string): string[] {
  const issues: string[] = [];

  // 检测未转义的 markdown 代码块
  const codeBlockMatches = content.match(/^```/gm);
  if (codeBlockMatches && codeBlockMatches.length > 0) {
    // 检查是否有未转义的
    if (!content.includes("\\`\\`\\`")) {
      issues.push("未转义的代码块 (```)");
    }
  }

  // 检测嵌套模板字符串（高危模式）
  if (/\$\{[^}]*\?\s*`[^`]*`\s*:\s*`[^`]*`\s*\}/.test(content)) {
    issues.push("嵌套模板字符串 (${...?`...`:`...`})");
  }

  // 检测 .join(`\n`) 模式
  if (/\.join\s*\(\s*`/.test(content)) {
    issues.push("join 模板字符串");
  }

  return issues;
}

async function main() {
  const files = await readdir(PROMPTS_DIR);
  const mdFiles = files.filter(f => f.endsWith(".md") && !f.includes(".diff."));

  const results: FileStatus[] = [];

  for (const file of mdFiles) {
    const content = await readFile(join(PROMPTS_DIR, file), "utf-8");
    const version = extractVersion(content);
    const lang = detectLang(content);
    const issues = detectIssues(content);

    results.push({
      name: file,
      version,
      lang,
      hasIssues: issues.length > 0,
      issues,
    });
  }

  // 按状态分组输出
  const withIssues = results.filter(r => r.hasIssues);
  const english = results.filter(r => r.lang === "en" && !r.hasIssues);
  const chinese = results.filter(r => r.lang === "zh" && !r.hasIssues);
  const mixed = results.filter(r => r.lang === "mixed" && !r.hasIssues);

  console.log("\n📊 提示词状态检查\n");
  console.log(`总计: ${results.length} 个文件\n`);

  if (withIssues.length > 0) {
    console.log(`\x1b[31m⚠️  有问题 (${withIssues.length})\x1b[0m`);
    for (const f of withIssues) {
      console.log(`   ${f.name}`);
      for (const issue of f.issues) {
        console.log(`      └─ ${issue}`);
      }
    }
    console.log();
  }

  if (english.length > 0) {
    console.log(`\x1b[33m📝 英文 (${english.length})\x1b[0m`);
    for (const f of english) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
    }
    console.log();
  }

  if (chinese.length > 0) {
    console.log(`\x1b[32m✅ 中文 (${chinese.length})\x1b[0m`);
    for (const f of chinese) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
    }
    console.log();
  }

  if (mixed.length > 0) {
    console.log(`\x1b[36m🔀 混合 (${mixed.length})\x1b[0m`);
    for (const f of mixed) {
      console.log(`   ${f.version.padEnd(8)} ${f.name}`);
    }
    console.log();
  }

  // 版本统计
  const versions = new Map<string, number>();
  for (const r of results) {
    versions.set(r.version, (versions.get(r.version) ?? 0) + 1);
  }

  console.log("📦 版本分布");
  for (const [v, count] of [...versions.entries()].sort()) {
    console.log(`   ${v.padEnd(8)} ${count} 个`);
  }
}

main().catch(console.error);

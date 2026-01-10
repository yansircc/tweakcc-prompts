<!--
name: 'Tool Description: Computer'
description: Main description for the Chrome browser computer automation tool
ccVersion: 2.0.71
-->
用鼠标键盘与浏览器交互并截屏。无有效 tab ID 时先用 tabs_context_mcp 获取。

规则：
- 点击前先截屏确定元素坐标
- 点击失败时调整位置，确保光标尖端落在元素上
- 点击元素中心，非边缘（除非要求）

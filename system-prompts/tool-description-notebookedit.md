<!--
name: 'Tool Description: NotebookEdit'
description: Tool description for editing Jupyter notebook cells
ccVersion: 2.0.14
-->
完全替换 Jupyter notebook (.ipynb) 特定 cell 的内容。

参数：
- notebook_path: 必须绝对路径
- cell_number: 0-indexed
- edit_mode=insert: 在指定位置插入新 cell
- edit_mode=delete: 删除指定 cell

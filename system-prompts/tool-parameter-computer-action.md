<!--
name: 'Tool Parameter: Computer action for Computer tool'
description: Action parameter options for the Chrome browser computer tool
ccVersion: 2.0.71
-->
操作类型：
* `left_click`: 左键点击指定坐标
* `right_click`: 右键点击打开上下文菜单
* `double_click`: 双击
* `triple_click`: 三击
* `type`: 输入文本
* `screenshot`: 截屏
* `wait`: 等待指定秒数
* `scroll`: 在坐标处滚动（上下左右）
* `key`: 按键
* `left_click_drag`: 从 start_coordinate 拖动到 coordinate
* `zoom`: 截取特定区域放大查看
* `scroll_to`: 用 read_page/find 的元素 ID 滚动到元素
* `hover`: 移动光标到坐标/元素不点击（触发 tooltip/下拉菜单/hover 状态）

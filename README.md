# Game Option (pxt-game-option)

MakeCode Arcade 扩展：幸存者肉鸽风格的**升级选择**界面。游戏在指定时机（杀敌数、升级等）弹出多个选项，暂停游戏，玩家用方向键选择、A 键确认，并返回选中索引。

## 用作扩展

* 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
* 点击 **新项目**
* 点击齿轮图标菜单下的 **扩展**
* 搜索并导入：`https://github.com/felixtsu/pxt-game-option`

## 积木块

导入扩展后，工具箱会出现 **升级选择** 分类。

### 选项

* **创建升级选项** — 设置图标和文字
* **设置 [选项] 图标为** / **设置 [选项] 文字为** — 修改已有选项

### 选择

* **弹出升级选择 [标题] 选项 [列表]** — 从选项数组中选择，返回索引（0 起，类似 `ask` 的返回值）
* **弹出升级选择（2/3/4 个选项）** — 无需数组，直接传入固定数量选项
* **空选项列表** / **将 [选项] 加入 [列表]** — 动态构建选项数组
* **从 [列表] 取第 [索引] 项的文字** — 根据返回索引读取文字

## 操作方式

| 按键 | 作用 |
|------|------|
| 方向键 | 在选项框之间移动光标 |
| A | 确认当前选中项 |

界面参考 `game.splash`：游戏暂停（半透明背景仍可见），顶部标题、中间方形选项框（图标）、底部显示当前选中项文字。

## 示例

```blocks
let optA = gameoption.create(img`
    . . 2 2 2 . .
    . 2 2 2 2 2 .
    2 2 2 2 2 2 2
    2 2 2 2 2 2 2
    . 2 2 2 2 2 .
    . . 2 2 2 . .
`, "攻速 +20%")

let optB = gameoption.create(img`
    . . 5 5 5 . .
    . 5 5 5 5 5 .
    5 5 5 5 5 5 5
    5 5 5 5 5 5 5
    . 5 5 5 5 5 .
    . . 5 5 5 . .
`, "伤害 +15%")

let choice = gameoption.choose2("选择升级", optA, optB)
if (choice == 0) {
    // 选了攻速
} else if (choice == 1) {
    // 选了伤害
}
```

多选项时用数组：

```blocks
let options = gameoption.emptyList()
gameoption.addToList(options, gameoption.create(myIcon1, "穿透"))
gameoption.addToList(options, gameoption.create(myIcon2, "分裂"))
gameoption.addToList(options, gameoption.create(myIcon3, "护盾"))

let picked = gameoption.choose("升级！", options)
let name = gameoption.getLabel(options, picked)
```

## 项目结构

* `main.ts` — 空的 namespace 声明
* `gameoption.ts` — 核心实现与 blocks 注释
* `test.ts` — 本地测试用，作为插件导入时不编译

## 编辑此项目

* 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
* 点击 **导入** → **导入 URL**
* 粘贴：`https://github.com/felixtsu/pxt-game-option`

#### 元数据（用于搜索、渲染）

* for PXT/arcade
* roguelike upgrade picker
* survivor game option select

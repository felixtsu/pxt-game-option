# Game Option (pxt-game-option)

MakeCode Arcade 扩展：幸存者肉鸽风格的**升级选择**界面。游戏在指定时机（杀敌数、升级等）弹出多个选项，暂停游戏，玩家用方向键选择、A 键确认，并返回选中索引。

## 用作扩展

* 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
* 点击 **新项目**
* 点击齿轮图标菜单下的 **扩展**
* 搜索并导入：`https://github.com/felixtsu/pxt-game-option`

## 积木块

导入扩展后，工具箱会出现 **升级选择** 分类。

### 创建

* **创建升级选项** — 设置图标和文字（可选，用于先创建变量再选择）
* **设置 [选项] 图标为** / **设置 [选项] 文字为**

### 弹出

* **弹出 2/3/4 项升级选择** — 直接填入图标和文字，返回选中索引（0 起）
* **弹出升级选择（选项1/2/3 变量）** — 使用已创建的 `upgradeOption` 变量

## 操作方式

| 按键 | 作用 |
|------|------|
| 方向键 | 在选项框之间移动光标 |
| A | 确认当前选中项 |

界面参考 `game.splash`：游戏暂停（半透明背景仍可见），顶部标题、中间方形选项框（图标）、底部显示当前选中项文字。

## 示例

```blocks
let choice = gameoption.choose2("选择升级",
    img`...`, "攻速 +20%",
    img`...`, "伤害 +15%")
if (choice == 0) {
    // 攻速
} else if (choice == 1) {
    // 伤害
}
```

先用变量创建选项再弹出：

```blocks
let optA = gameoption.create(myIcon1, "穿透")
let optB = gameoption.create(myIcon2, "分裂")
let picked = gameoption.chooseFromOptions2("升级！", optA, optB)
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

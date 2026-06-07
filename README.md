# 选项 (pxt-game-option)

MakeCode Arcade 扩展：通用选项选择界面。暂停游戏，用方向键在图标+文字选项间切换，A 确认，返回索引（0 起）。

## 学生用法（在自己的游戏里加扩展）

**不要**用「导入 URL」打开本仓库根目录——那是给开发者改插件用的。

正确步骤：

1. 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
2. 点击 **新项目**（或打开你已有的游戏项目）
3. 点击齿轮 → **扩展**
4. 搜索并导入：`https://github.com/felixtsu/pxt-game-option`
5. 左侧工具箱会出现 **选项** 分类，拖积木到工作区

## 示例项目

示例在仓库 `demo/` 子目录，与 yahud 相同结构。

* **导入示例**：MakeCode → **导入** → **导入 URL** → 粘贴  
  `https://github.com/felixtsu/pxt-game-option/tree/main/demo`
* **源码**：[`demo/main.ts`](demo/main.ts)

## 积木块

### 创建

* **创建选项** — 图标 + 文字

### 设置

* **设置 [选项] 图标为** / **设置 [选项] 文字为**

### 弹出（两条独立指令，不用数组）

* **弹出选项(2个)** — 传入 2 个 `pickerOption` 变量
* **弹出选项(3个)** — 传入 3 个 `pickerOption` 变量

## 协作方式

先 **创建** 选项，再 **弹出** 时传入这些变量（与 animation 扩展里 `variables_get(anim)` 相同写法）：

```blocks
let optA = gameoption.create(图标1, "选项 A")
let optB = gameoption.create(图标2, "选项 B")
let choice = gameoption.choose2("请选择", optA, optB)
if (choice == 0) {
    // 选了 optA
} else if (choice == 1) {
    // 选了 optB
}
```

## 示例

```blocks
let optA = gameoption.create(img`...`, "选项 A")
let optB = gameoption.create(img`...`, "选项 B")
let choice = gameoption.choose2("请选择", optA, optB)
```

## 项目结构

* `main.ts` — 空 namespace（与 yahud 一致）
* `gameoption.ts` — 插件实现与 blocks 注释
* `demo/` — 示例游戏（`preferredEditor: tsprj`）

## 开发者编辑插件

* MakeCode → **导入** → **导入 URL** → `https://github.com/felixtsu/pxt-game-option`

#### 元数据

* for PXT/arcade
* icon + text option picker

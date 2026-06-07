# 升级选择 (pxt-game-option)

MakeCode Arcade 扩展：幸存者肉鸽风格的升级选择界面。暂停游戏，用方向键选图标+文字选项，A 确认，返回索引（0 起）。

## 学生用法（在自己的游戏里加扩展）

**不要**用「导入 URL」打开本仓库根目录——那是给开发者改插件用的。

正确步骤：

1. 打开 [https://arcade.makecode.com/](https://arcade.makecode.com/)
2. 点击 **新项目**（或打开你已有的游戏项目）
3. 点击齿轮 → **扩展**
4. 搜索并导入：`https://github.com/felixtsu/pxt-game-option`
5. 左侧工具箱会出现 **升级选择** 分类，拖积木到工作区

## 示例项目

示例在仓库 `demo/` 子目录，与 yahud 相同结构。

* **导入示例**：MakeCode → **导入** → **导入 URL** → 粘贴  
  `https://github.com/felixtsu/pxt-game-option/tree/main/demo`
* **源码**：[`demo/main.ts`](demo/main.ts)

## 积木块

### 创建

* **创建升级选项** — 图标 + 文字（可选，用于变量方式）

### 设置

* **设置 [选项] 图标为** / **设置 [选项] 文字为**

### 弹出

* **弹出 2 项升级选择** — 直接填两组图标+文字，返回 0 或 1
* **弹出 3 项升级选择** — 三组选项，返回 0 / 1 / 2

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

## 项目结构

* `main.ts` — 空 namespace（与 yahud 一致）
* `gameoption.ts` — 插件实现与 blocks 注释
* `demo/` — 示例游戏（`preferredEditor: tsprj`）

## 开发者编辑插件

* MakeCode → **导入** → **导入 URL** → `https://github.com/felixtsu/pxt-game-option`

#### 元数据

* for PXT/arcade
* roguelike upgrade picker

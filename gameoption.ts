//% icon="\uf046" color="#E6812D" weight=74 blockGap=12 block="升级选择"
//% groups='["创建", "设置", "弹出"]'
namespace 升级选择 { }

//% blockNamespace=升级选择
//% blockGap=8
class UpgradeOption {
    protected _icon: Image;
    protected _label: string;

    constructor(icon?: Image, label?: string) {
        this._icon = icon || null;
        this._label = label || "";
    }

    //% group="设置" blockSetVariable="upgradeOption"
    //% blockCombine block="文字" callInDebugger
    get label(): string {
        return this._label;
    }

    //% block="设置 $this(upgradeOption) 图标为 $icon=screen_image_picker"
    //% blockId=gameoption_setIcon
    //% group="设置"
    //% weight=90
    setIcon(icon: Image) {
        this._icon = icon;
    }

    //% block="设置 $this(upgradeOption) 文字为 $label"
    //% blockId=gameoption_setLabel
    //% label.defl=""
    //% group="设置"
    //% weight=89
    //% blockGap=8
    setLabel(label: string) {
        this._label = console.inspect(label);
    }

    getIcon(): Image {
        return this._icon;
    }
}

namespace gameoption {
    const CARD_SIZE = 36;
    const CARD_SPACING = 8;
    const SCREEN_PADDING = 8;
    const TITLE_TOP = 4;
    const INFO_TOP = 96;

    interface Layout {
        cols: number;
        rows: number;
    }

    function calcLayout(count: number): Layout {
        if (count <= 1) return { cols: 1, rows: 1 };
        if (count === 2) return { cols: 2, rows: 1 };
        if (count === 3) return { cols: 3, rows: 1 };
        if (count === 4) return { cols: 2, rows: 2 };
        const cols = 3;
        return { cols: cols, rows: Math.ceil(count / cols) };
    }

    function screenColor(selected: number, normal: number): number {
        return screen.isMono ? 1 : (selected ? selected : normal);
    }

    function drawCard(x: number, y: number, icon: Image, selected: boolean, pulse: number) {
        if (selected) {
            x += pulse;
            y += pulse;
        }

        const bg = screenColor(7, 2);
        const border = screenColor(1, selected ? 7 : 3);
        const inner = screenColor(1, selected ? 10 : 1);

        screen.fillRect(x, y, CARD_SIZE, CARD_SIZE, border);
        screen.fillRect(x + 1, y + 1, CARD_SIZE - 2, CARD_SIZE - 2, bg);

        if (selected) {
            screen.fillRect(x + 2, y + 2, CARD_SIZE - 4, CARD_SIZE - 4, inner);
        }

        if (icon) {
            const ix = x + ((CARD_SIZE - icon.width) >> 1);
            const iy = y + ((CARD_SIZE - icon.height) >> 1);
            screen.drawTransparentImage(icon, ix, iy);
        }
    }

    function cardOrigin(layout: Layout): { left: number; top: number } {
        const gridWidth = layout.cols * CARD_SIZE + (layout.cols - 1) * CARD_SPACING;
        const gridHeight = layout.rows * CARD_SIZE + (layout.rows - 1) * CARD_SPACING;
        const left = (screen.width - gridWidth) >> 1;
        const availableTop = INFO_TOP - TITLE_TOP - 12;
        const top = TITLE_TOP + 12 + ((availableTop - gridHeight) >> 1);
        return { left: left, top: top };
    }

    function cardPosition(index: number, layout: Layout): { x: number; y: number } {
        const origin = cardOrigin(layout);
        const col = index % layout.cols;
        const row = Math.idiv(index, layout.cols);
        return {
            x: origin.left + col * (CARD_SIZE + CARD_SPACING),
            y: origin.top + row * (CARD_SIZE + CARD_SPACING)
        };
    }

    function drawPicker2(title: string, option1: UpgradeOption, option2: UpgradeOption, selection: number) {
        drawPickerN(title, selection, option1, option2);
    }

    function drawPicker3(title: string, option1: UpgradeOption, option2: UpgradeOption, option3: UpgradeOption, selection: number) {
        drawPickerN(title, selection, option1, option2, option3);
    }

    function drawPickerN(title: string, selection: number, option1: UpgradeOption, option2: UpgradeOption, option3?: UpgradeOption) {
        const count = option3 ? 3 : 2;
        const layout = calcLayout(count);
        const pulse = Math.sin(control.millis() / 200) > 0 ? 0 : 1;

        screen.fillRect(0, 0, screen.width, 18, 15);
        screen.printCenter(console.inspect(title), TITLE_TOP, screenColor(7, 1), image.font8);

        drawCardForOption(option1, 0, layout, selection, pulse);
        drawCardForOption(option2, 1, layout, selection, pulse);
        if (option3) {
            drawCardForOption(option3, 2, layout, selection, pulse);
        }

        screen.fillRect(SCREEN_PADDING, INFO_TOP - 2, screen.width - (SCREEN_PADDING << 1), image.font5.charHeight + 4, 15);
        screen.fillRect(SCREEN_PADDING + 1, INFO_TOP - 1, screen.width - (SCREEN_PADDING << 1) - 2, image.font5.charHeight + 2, 1);

        const label = getOptionLabel(selection, option1, option2, option3);
        screen.printCenter(label, INFO_TOP, 15, image.font5);

        screen.printCenter("A = 确认", screen.height - 8, screenColor(7, 3), image.font5);
    }

    function drawCardForOption(option: UpgradeOption, index: number, layout: Layout, selection: number, pulse: number) {
        const pos = cardPosition(index, layout);
        drawCard(pos.x, pos.y, option.getIcon(), index === selection, index === selection ? pulse : 0);
    }

    function getOptionLabel(index: number, option1: UpgradeOption, option2: UpgradeOption, option3?: UpgradeOption): string {
        if (index === 0) return option1.label;
        if (index === 1) return option2.label;
        if (option3 && index === 2) return option3.label;
        return "";
    }

    function moveSelection(selection: number, delta: number, max: number): number {
        return Math.max(0, Math.min(max, selection + delta));
    }

    function runPicker2(title: string, option1: UpgradeOption, option2: UpgradeOption): number {
        return runPickerCore(title, 2, option1, option2);
    }

    function runPicker3(title: string, option1: UpgradeOption, option2: UpgradeOption, option3: UpgradeOption): number {
        return runPickerCore(title, 3, option1, option2, option3);
    }

    function runPickerCore(title: string, count: number, option1: UpgradeOption, option2: UpgradeOption, option3?: UpgradeOption): number {
        if (!option1 || !option2 || (count === 3 && !option3)) return -1;

        controller._setUserEventsEnabled(false);
        game.eventContext();
        control.pushEventContext();

        game.pushScene();
        game.currentScene().flags |= scene.Flag.SeeThrough;

        let selection = 0;
        let done = false;
        let result = -1;

        let upReady = false;
        let downReady = false;
        let leftReady = false;
        let rightReady = false;
        let aReady = false;

        const layout = calcLayout(count);
        const titleText = console.inspect(title);

        game.onShade(() => {
            if (count === 3 && option3) {
                drawPicker3(titleText, option1, option2, option3, selection);
            } else {
                drawPicker2(titleText, option1, option2, selection);
            }
        });

        pauseUntil(() => {
            upReady = upReady || !controller.up.isPressed();
            downReady = downReady || !controller.down.isPressed();
            leftReady = leftReady || !controller.left.isPressed();
            rightReady = rightReady || !controller.right.isPressed();
            aReady = aReady || !controller.A.isPressed();

            if (upReady && controller.up.isPressed()) {
                selection = moveSelection(selection, -layout.cols, count - 1);
                upReady = false;
            } else if (downReady && controller.down.isPressed()) {
                selection = moveSelection(selection, layout.cols, count - 1);
                downReady = false;
            } else if (leftReady && controller.left.isPressed()) {
                selection = moveSelection(selection, -1, count - 1);
                leftReady = false;
            } else if (rightReady && controller.right.isPressed()) {
                selection = moveSelection(selection, 1, count - 1);
                rightReady = false;
            } else if (aReady && controller.A.isPressed()) {
                result = selection;
                done = true;
            }

            return done;
        });

        game.popScene();
        control.popEventContext();
        controller._setUserEventsEnabled(true);
        return result;
    }

    function makeOption(icon: Image, label: string): UpgradeOption {
        return new UpgradeOption(icon, console.inspect(label));
    }

    //% block="创建升级选项 图标 $icon=screen_image_picker 文字 $label"
    //% blockId=gameoption_create
    //% blockNamespace=升级选择
    //% blockSetVariable="upgradeOption"
    //% label.defl=""
    //% label.shadow=text
    //% group="创建"
    //% weight=100
    //% blockGap=8
    export function create(icon: Image, label: string): UpgradeOption {
        return makeOption(icon, label);
    }

    //% block="弹出升级选择(2个) $title 选项1 $option1=variables_get(upgradeOption) 选项2 $option2=variables_get(upgradeOption)"
    //% blockId=gameoption_choose2
    //% blockNamespace=升级选择
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=100
    //% blockGap=8
    export function choose2(title: string, option1: UpgradeOption, option2: UpgradeOption): number {
        return runPicker2(title, option1, option2);
    }

    //% block="弹出升级选择(3个) $title 选项1 $option1=variables_get(upgradeOption) 选项2 $option2=variables_get(upgradeOption) 选项3 $option3=variables_get(upgradeOption)"
    //% blockId=gameoption_choose3
    //% blockNamespace=升级选择
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=99
    //% blockGap=8
    export function choose3(title: string, option1: UpgradeOption, option2: UpgradeOption, option3: UpgradeOption): number {
        return runPicker3(title, option1, option2, option3);
    }
}

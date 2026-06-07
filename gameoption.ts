//% icon="\uf009" color="#E6812D" weight=74 blockGap=12 block="选项"
//% groups='["创建", "设置", "弹出"]'
namespace 选项 { }

//% blockNamespace=选项
//% blockGap=8
class PickerOption {
    protected _icon: Image;
    protected _label: string;

    constructor(icon?: Image, label?: string) {
        this._icon = icon || null;
        this._label = label || "";
    }

    //% group="设置" blockSetVariable="pickerOption"
    //% blockCombine block="文字" callInDebugger
    get label(): string {
        return this._label;
    }

    //% block="设置 $this(pickerOption) 图标为 $icon=screen_image_picker"
    //% blockId=gameoption_setIcon
    //% group="设置"
    //% weight=90
    setIcon(icon: Image) {
        this._icon = icon;
    }

    //% block="设置 $this(pickerOption) 文字为 $label"
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

    interface Layout {
        cols: number;
        rows: number;
    }

    interface PickerMetrics {
        titleTop: number;
        titleBarHeight: number;
        cardTop: number;
        infoTop: number;
        infoBarHeight: number;
        confirmTop: number;
    }

    function edgePadding(): number {
        return Math.max(4, Math.idiv(screen.height, 24));
    }

    function computePickerMetrics(titleFont: image.Font, labelFont: image.Font, confirmFont: image.Font, gridHeight: number): PickerMetrics {
        const edge = edgePadding();
        const confirmTop = screen.height - confirmFont.charHeight - edge;
        const infoBarHeight = labelFont.charHeight + 4;
        const infoGap = Math.max(8, Math.idiv(screen.height, 15));
        const infoTop = confirmTop - infoGap - infoBarHeight;
        const titleTop = edge;
        const titleBarHeight = titleFont.charHeight + 6;
        const cardAreaTop = titleTop + titleBarHeight + edge;
        const cardAreaBottom = infoTop - edge;
        const cardTop = cardAreaTop + Math.max(0, (cardAreaBottom - cardAreaTop - gridHeight) >> 1);
        return {
            titleTop: titleTop,
            titleBarHeight: titleBarHeight,
            cardTop: cardTop,
            infoTop: infoTop,
            infoBarHeight: infoBarHeight,
            confirmTop: confirmTop
        };
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

    function cardOrigin(layout: Layout, cardTop: number): { left: number; top: number } {
        const gridWidth = layout.cols * CARD_SIZE + (layout.cols - 1) * CARD_SPACING;
        const left = (screen.width - gridWidth) >> 1;
        return { left: left, top: cardTop };
    }

    function cardPosition(index: number, layout: Layout, cardTop: number): { x: number; y: number } {
        const origin = cardOrigin(layout, cardTop);
        const col = index % layout.cols;
        const row = Math.idiv(index, layout.cols);
        return {
            x: origin.left + col * (CARD_SIZE + CARD_SPACING),
            y: origin.top + row * (CARD_SIZE + CARD_SPACING)
        };
    }

    function drawPicker2(title: string, option1: PickerOption, option2: PickerOption, selection: number) {
        drawPickerN(title, selection, option1, option2);
    }

    function drawPicker3(title: string, option1: PickerOption, option2: PickerOption, option3: PickerOption, selection: number) {
        drawPickerN(title, selection, option1, option2, option3);
    }

    function drawPickerN(title: string, selection: number, option1: PickerOption, option2: PickerOption, option3?: PickerOption) {
        const count = option3 ? 3 : 2;
        const layout = calcLayout(count);
        const gridHeight = layout.rows * CARD_SIZE + (layout.rows - 1) * CARD_SPACING;
        const pulse = Math.sin(control.millis() / 200) > 0 ? 0 : 1;
        const titleText = console.inspect(title);
        const titleFont = image.getFontForText(titleText);
        const label = getOptionLabel(selection, option1, option2, option3);
        const labelFont = image.getFontForText(label);
        const confirmText = "A = 确认";
        const confirmFont = image.getFontForText(confirmText);
        const metrics = computePickerMetrics(titleFont, labelFont, confirmFont, gridHeight);

        screen.fillRect(0, 0, screen.width, metrics.titleBarHeight, 15);
        screen.printCenter(titleText, metrics.titleTop, screenColor(7, 1), titleFont);

        drawCardForOption(option1, 0, layout, metrics.cardTop, selection, pulse);
        drawCardForOption(option2, 1, layout, metrics.cardTop, selection, pulse);
        if (option3) {
            drawCardForOption(option3, 2, layout, metrics.cardTop, selection, pulse);
        }

        screen.fillRect(SCREEN_PADDING, metrics.infoTop - 2, screen.width - (SCREEN_PADDING << 1), metrics.infoBarHeight, 15);
        screen.fillRect(SCREEN_PADDING + 1, metrics.infoTop - 1, screen.width - (SCREEN_PADDING << 1) - 2, labelFont.charHeight + 2, 1);
        screen.printCenter(label, metrics.infoTop, 15, labelFont);

        screen.printCenter(confirmText, metrics.confirmTop, screenColor(7, 3), confirmFont);
    }

    function drawCardForOption(option: PickerOption, index: number, layout: Layout, cardTop: number, selection: number, pulse: number) {
        const pos = cardPosition(index, layout, cardTop);
        drawCard(pos.x, pos.y, option.getIcon(), index === selection, index === selection ? pulse : 0);
    }

    function getOptionLabel(index: number, option1: PickerOption, option2: PickerOption, option3?: PickerOption): string {
        if (index === 0) return option1.label;
        if (index === 1) return option2.label;
        if (option3 && index === 2) return option3.label;
        return "";
    }

    function moveSelection(selection: number, delta: number, max: number): number {
        return Math.max(0, Math.min(max, selection + delta));
    }

    function runPicker2(title: string, option1: PickerOption, option2: PickerOption): number {
        return runPickerCore(title, 2, option1, option2);
    }

    function runPicker3(title: string, option1: PickerOption, option2: PickerOption, option3: PickerOption): number {
        return runPickerCore(title, 3, option1, option2, option3);
    }

    function runPickerCore(title: string, count: number, option1: PickerOption, option2: PickerOption, option3?: PickerOption): number {
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

    function makeOption(icon: Image, label: string): PickerOption {
        return new PickerOption(icon, console.inspect(label));
    }

    //% block="创建选项 图标 $icon=screen_image_picker 文字 $label"
    //% blockId=gameoption_create
    //% blockNamespace=选项
    //% blockSetVariable="pickerOption"
    //% label.defl=""
    //% label.shadow=text
    //% group="创建"
    //% weight=100
    //% blockGap=8
    export function create(icon: Image, label: string): PickerOption {
        return makeOption(icon, label);
    }

    //% block="弹出选项(2个) $title 选项1 $option1=variables_get(pickerOption) 选项2 $option2=variables_get(pickerOption)"
    //% blockId=gameoption_choose2
    //% blockNamespace=选项
    //% title.defl="请选择"
    //% title.shadow=text
    //% group="弹出"
    //% weight=100
    //% blockGap=8
    export function choose2(title: string, option1: PickerOption, option2: PickerOption): number {
        return runPicker2(title, option1, option2);
    }

    //% block="弹出选项(3个) $title 选项1 $option1=variables_get(pickerOption) 选项2 $option2=variables_get(pickerOption) 选项3 $option3=variables_get(pickerOption)"
    //% blockId=gameoption_choose3
    //% blockNamespace=选项
    //% title.defl="请选择"
    //% title.shadow=text
    //% group="弹出"
    //% weight=99
    //% blockGap=8
    export function choose3(title: string, option1: PickerOption, option2: PickerOption, option3: PickerOption): number {
        return runPicker3(title, option1, option2, option3);
    }
}

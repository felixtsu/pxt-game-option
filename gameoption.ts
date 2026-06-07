//% icon="\uf046" color="#E6812D" weight=74 blockGap=16 block="升级选择"
//% groups='["创建", "修改", "列表", "弹出"]'
namespace 升级选择 { }

//% blockNamespace=升级选择
//% blockSetVariable="upgradeOption"
//% blockGap=8
class UpgradeOption {
    protected _icon: Image;
    protected _label: string;

    constructor(icon?: Image, label?: string) {
        this._icon = icon || null;
        this._label = label || "";
    }

    //% group="创建" blockSetVariable="upgradeOption"
    //% blockCombine block="文字" callInDebugger
    get label(): string {
        return this._label;
    }

    //% block="设置 $this(upgradeOption) 图标为 $icon=screen_image_picker"
    //% blockId=gameoption_setIcon
    //% group="修改"
    //% weight=90
    setIcon(icon: Image) {
        this._icon = icon;
    }

    //% block="设置 $this(upgradeOption) 文字为 $label"
    //% blockId=gameoption_setLabel
    //% label.defl=""
    //% label.shadow=text
    //% group="修改"
    //% weight=89
    //% blockGap=16
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

    function drawPicker(title: string, options: UpgradeOption[], selection: number) {
        const layout = calcLayout(options.length);
        const pulse = Math.sin(control.millis() / 200) > 0 ? 0 : 1;

        screen.fillRect(0, 0, screen.width, 18, 15);
        screen.printCenter(console.inspect(title), TITLE_TOP, screenColor(7, 1), image.font8);

        for (let i = 0; i < options.length; i++) {
            const pos = cardPosition(i, layout);
            drawCard(pos.x, pos.y, options[i].getIcon(), i === selection, i === selection ? pulse : 0);
        }

        screen.fillRect(SCREEN_PADDING, INFO_TOP - 2, screen.width - (SCREEN_PADDING << 1), image.font5.charHeight + 4, 15);
        screen.fillRect(SCREEN_PADDING + 1, INFO_TOP - 1, screen.width - (SCREEN_PADDING << 1) - 2, image.font5.charHeight + 2, 1);

        const label = options[selection] ? options[selection].label : "";
        screen.printCenter(label, INFO_TOP, 15, image.font5);

        screen.printCenter("A = 确认", screen.height - 8, screenColor(7, 3), image.font5);
    }

    function moveSelection(selection: number, delta: number, max: number): number {
        return Math.max(0, Math.min(max, selection + delta));
    }

    function runPicker(title: string, options: UpgradeOption[]): number {
        if (!options || options.length === 0) return -1;

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

        const layout = calcLayout(options.length);

        game.onShade(() => {
            drawPicker(title, options, selection);
        });

        pauseUntil(() => {
            upReady = upReady || !controller.up.isPressed();
            downReady = downReady || !controller.down.isPressed();
            leftReady = leftReady || !controller.left.isPressed();
            rightReady = rightReady || !controller.right.isPressed();
            aReady = aReady || !controller.A.isPressed();

            if (upReady && controller.up.isPressed()) {
                selection = moveSelection(selection, -layout.cols, options.length - 1);
                upReady = false;
            } else if (downReady && controller.down.isPressed()) {
                selection = moveSelection(selection, layout.cols, options.length - 1);
                downReady = false;
            } else if (leftReady && controller.left.isPressed()) {
                selection = moveSelection(selection, -1, options.length - 1);
                leftReady = false;
            } else if (rightReady && controller.right.isPressed()) {
                selection = moveSelection(selection, 1, options.length - 1);
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

    //% block
    //% blockId=gameoption_create
    //% blockNamespace=升级选择
    //% blockSetVariable="upgradeOption"
    //% block="创建升级选项||图标 $icon=screen_image_picker||文字 $label"
    //% label.defl=""
    //% label.shadow=text
    //% group="创建"
    //% weight=100
    //% inlineInputMode=external
    //% blockGap=16
    export function create(icon: Image, label: any): UpgradeOption {
        return new UpgradeOption(icon, console.inspect(label));
    }

    //% block
    //% blockId=gameoption_emptyList
    //% blockNamespace=升级选择
    //% blockSetVariable="options"
    //% block="空选项列表"
    //% group="列表"
    //% weight=100
    export function emptyList(): UpgradeOption[] {
        return [];
    }

    //% block
    //% blockId=gameoption_addToList
    //% blockNamespace=升级选择
    //% block="将 $option 加入 $options"
    //% group="列表"
    //% weight=99
    //% blockGap=16
    export function addToList(options: UpgradeOption[], option: UpgradeOption) {
        options.push(option);
    }

    //% block
    //% blockId=gameoption_getLabel
    //% blockNamespace=升级选择
    //% block="从 $options 取第 $index 项的文字"
    //% index.min=0 index.defl=0
    //% group="列表"
    //% weight=80
    //% blockGap=16
    export function getLabel(options: UpgradeOption[], index: number): string {
        if (!options || index < 0 || index >= options.length) return "";
        return options[index].label;
    }

    //% block
    //% blockId=gameoption_choose
    //% blockNamespace=升级选择
    //% block="弹出升级选择||标题 $title||选项 $options"
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=100
    //% inlineInputMode=external
    //% blockGap=16
    export function choose(title: any, options: UpgradeOption[]): number {
        return runPicker(console.inspect(title), options);
    }

    //% block
    //% blockId=gameoption_choose2
    //% blockNamespace=升级选择
    //% block="弹出 2 项升级选择||标题 $title||选项1 $option1||选项2 $option2"
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=90
    //% inlineInputMode=external
    //% advanced=true
    export function choose2(title: any, option1: UpgradeOption, option2: UpgradeOption): number {
        return runPicker(console.inspect(title), [option1, option2]);
    }

    //% block
    //% blockId=gameoption_choose3
    //% blockNamespace=升级选择
    //% block="弹出 3 项升级选择||标题 $title||选项1 $option1||选项2 $option2||选项3 $option3"
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=89
    //% inlineInputMode=external
    //% advanced=true
    export function choose3(title: any, option1: UpgradeOption, option2: UpgradeOption, option3: UpgradeOption): number {
        return runPicker(console.inspect(title), [option1, option2, option3]);
    }

    //% block
    //% blockId=gameoption_choose4
    //% blockNamespace=升级选择
    //% block="弹出 4 项升级选择||标题 $title||选项1 $option1||选项2 $option2||选项3 $option3||选项4 $option4"
    //% title.defl="选择升级"
    //% title.shadow=text
    //% group="弹出"
    //% weight=88
    //% inlineInputMode=external
    //% advanced=true
    //% blockGap=16
    export function choose4(title: any, option1: UpgradeOption, option2: UpgradeOption, option3: UpgradeOption, option4: UpgradeOption): number {
        return runPicker(console.inspect(title), [option1, option2, option3, option4]);
    }
}

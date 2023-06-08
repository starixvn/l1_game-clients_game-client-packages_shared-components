import EffectAppearanceLabel from "./effect-appearance-label";
import MD5Tip from "./md5-tip";
import MD5Frame from "./md5-frame";
import gc from "game-client-base";
import Observer from "observer";
const { render, handle } = Observer;
const { Rounds, RoundHistories, Settlements } = gc;
import { AnimationUtils } from "../../utils/utils";

import { Component, _decorator, Node, Label, Button, Layout, UITransform, Prefab, tween, UIOpacity, v3, instantiate, sys  } from "cc";
const { ccclass, property} = _decorator;


export type MD5Type = {
    extraInfos: any;
    rawValue: string;
    hashValue: string;
};
@ccclass
export default class MD5Component extends Component {
    @property(Label)
    md5Text: Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(Button)
    copyButton: Button = null;

    @property(Node)
    hintCopyNode: Node = null;

    @property(Node)
    md5ContentContainer: Node = null;

    @property
    lengthOfMd5 = 21;

    @property(Prefab)
    md5TooltipPrefab: Prefab = null;

    @property(Node)
    md5TooltipContainer: Node = null;

    @property
    delayShowRawValue = 0;

    public timeout: any;
    private md5CopyString: string = null;
    readonly duration: number = 0.5;
    readonly delayShowHashValue: number = 1.35;
    protected md5Tip: MD5Tip = null;
    maximumStringAllowed = 32;
    public hintLabel: Label = null;
    protected tipString: string;

    onLoad() {
        this.initMD5Tooltip();
        this.registerTouchEvents();
    }

    onDestroy() {
        this.removeTouchEvents();
    }

    private registerTouchEvents() {
        this.md5ContentContainer.on(Node.EventType.MOUSE_ENTER, this.showTooltip, this);
        this.md5ContentContainer.on(Node.EventType.MOUSE_LEAVE, this.hideTooltip, this);
        this.md5ContentContainer.on(Node.EventType.TOUCH_START, this.showTooltip, this);
    }

    private removeTouchEvents() {
        this.md5ContentContainer.off(Node.EventType.MOUSE_ENTER, this.showTooltip, this);
        this.md5ContentContainer.off(Node.EventType.MOUSE_LEAVE, this.hideTooltip, this);
        this.md5ContentContainer.off(Node.EventType.TOUCH_START, this.showTooltip, this);
    }

   
    initMD5Wrapper(node: Node) {
        const md5Frame = node.getComponent(MD5Frame);
        this.md5Text = md5Frame.md5Label;
        this.copyButton = md5Frame.md5CopyBtn;
        this.hintCopyNode = md5Frame.md5HintCopy;
        const md5ContentWidth = this.md5ContentContainer.getComponent(UITransform).width;
        this.hintLabel = this.hintCopyNode.getChildByName("content").getComponent(Label);
        this.hintLabel.string = gc.Shared.l10n.t("copySuccess");
        this.setCaptionAndHintForMD5(false);
        md5Frame.onClickCopyButton = () => {
            this.onClickCopyButton();
        };
        md5Frame.updateLayout(md5ContentWidth);
    }

    initMD5Tooltip() {
        const mini = instantiate(this.md5TooltipPrefab);
        this.md5Tip = mini.getComponent(MD5Tip);
        this.md5TooltipContainer.addChild(mini);
    }

    showTooltip() {
        if (this.tipString) {
            this.md5Tip.setData(this.tipString);
            this.md5Tip.show(true);
            tween(this.md5Tip.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(2).to(0.1, { opacity: 0 }).start();
        }
    }

    hideTooltip() {
        this.md5Tip.show(false);
    }

    @render(Rounds.RoundStore, (store) => store.resultHash)
    renderMd5(resultHash: gc.GameServiceMessage.ResultHash) {
        this.updateMD5String(resultHash);
    }


    updateMD5String(data: gc.GameServiceMessage.ResultHash) {
        if (!this.node.activeInHierarchy) {
            this.handleMD5Data(data);
            return;
        }

        const delayTime = !!data?.rawValue ? this.delayShowRawValue : this.delayShowHashValue;
        this.timeout = setTimeout(() => {
            this.handleMD5Data(data);
        }, delayTime * 1000);
    }

    handleMD5Data(data: gc.GameServiceMessage.ResultHash) {
        this.setDataTip(data);
        if (this.node && this.node.isValid) {
            this.setCaptionAndHintForMD5(!!data?.rawValue);
            this.generateMD5Result(data);
            this.setCopyString(data?.hashValue || data?.rawValue);
        }
    }

    generateMD5Result(data: gc.GameServiceMessage.ResultHash) {
        const value = data?.hashValue || data?.rawValue;
        const formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;
        this.md5Value.string = `${formatValue}`;
    }

    resetMd5() {
        this.md5Value.string = "";
        this.tipString = "";
        this.setCopyString("");
        this.timeout && clearTimeout(this.timeout);
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
    }

    setDataTip(data: gc.GameServiceMessage.ResultHash) {
        this.tipString = data.rawValue;
    }

    onClickCopyButton() {
        const isAndroid = sys.os === sys.OS.LINUX || sys.os === sys.OS.ANDROID;
        gc.GameUtils.copyToClipboard(this.md5CopyString, isAndroid, (message: string) => {
            this.hintLabel.string = message;
            this.showHint();
        });
        this.md5Tip.show(false);
    }

    showHint() {
        tween(this.hintCopyNode.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(3).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        this.md5Text.string = gc.Shared.l10n.t(isMD5Key ? "md5Result" : "md5String");
        this.md5Text.node.position = v3(-5, 0, 0);
        tween(this.md5Text.node)
            .to(0.3, { position: v3(0, 0, 0) })
            .start();
    }

    setDelayShowRawValue(delay: number) {
        this.delayShowRawValue = delay;
    }
}

import gc from "@sg/game-client-base";
import Observer from "observer";
import EffectAppearanceLabel from "./effect-appearance-label";
import MD5Tip from "./md5-tip";
const { render } = Observer;
const { Rounds } = gc;

import { Component, Label, Node, UIOpacity, _decorator, sys, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

export type MD5Type = {
    extraInfos: any;
    rawValue: string;
    hashValue: string;
};
@ccclass
export default class MD5Component extends Component {
    @property(Label)
    lblCaption: Label = null;

    @property(EffectAppearanceLabel)
    lblMd5Value: EffectAppearanceLabel = null;

    @property(Node)
    nodeHintCopy: Node = null;

    @property(Node)
    nodeContentContainer: Node = null;

    @property
    lengthOfMd5 = 21;

    @property(MD5Tip)
    protected md5Tip: MD5Tip = null;

    protected maximumStringAllowed = 32;
    protected lblHint: Label = null;
    protected tipString: string;
    private md5CopyString: string = null;

    onLoad() {
        this.registerTouchEvents();
        this.hideTooltip();
        this.initHintAndCaption();
    }

    private registerTouchEvents() {
        this.nodeContentContainer?.on(Node.EventType.MOUSE_ENTER, this.showTooltip, this);
        this.nodeContentContainer?.on(Node.EventType.MOUSE_LEAVE, this.hideTooltip, this);
        this.nodeContentContainer?.on(Node.EventType.TOUCH_START, this.showTooltip, this);
    }

    private initHintAndCaption() {
        this.lblHint = this.nodeHintCopy.getChildByName("content").getComponent(Label);
        this.lblHint.string = gc.Shared.l10n.t("copySuccess");
        this.updateTextCaption(false);
    }

    private showTooltip() {
        if (this.tipString) {
            this.md5Tip.setData(this.tipString);
            this.md5Tip.show(true);
            tween(this.md5Tip.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(2).to(0.1, { opacity: 0 }).start();
        }
    }

    private hideTooltip() {
        this.md5Tip?.show(false);
    }

    @render(Rounds.RoundStore, (store) => store.resultHash, { fireImmediately: false })
    private renderMd5(resultHash: gc.GameServiceMessage.ResultHash) {
        this.handleMD5Data(resultHash);
    }

    private handleMD5Data(data: gc.GameServiceMessage.ResultHash) {
        this.setDataTip(data);
        if (this.node?.isValid) {
            this.updateTextCaption(!!data?.rawValue);
            this.generateMD5Result(data);
            this.setCopyString(data?.hashValue || data?.rawValue);
        }
    }

    generateMD5Result(data: gc.GameServiceMessage.ResultHash) {
        const value = data?.hashValue || data?.rawValue;
        const formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;
        this.lblMd5Value && (this.lblMd5Value.string = `${formatValue}`);
    }

    private resetMd5() {
        this.lblMd5Value && (this.lblMd5Value.string = "");
        this.tipString = "";
        this.setCopyString("");
    }

    private setCopyString(text: string) {
        this.md5CopyString = text;
    }

    protected setDataTip(data: gc.GameServiceMessage.ResultHash) {
        this.tipString = data.rawValue;
    }

    onClickCopyButton() {
        const isAndroid = sys.os === sys.OS.LINUX || sys.os === sys.OS.ANDROID;
        gc.GameUtils.copyToClipboard(this.md5CopyString, isAndroid, (message: string) => {
            this.lblHint.string = message;
            this.showHint();
        });
        this.md5Tip.show(false);
    }

    private showHint() {
        tween(this.nodeHintCopy.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(3).to(0.1, { opacity: 1 }).start();
    }

    private updateTextCaption(isMD5Key: boolean) {
        this.lblCaption.string = gc.Shared.l10n.t(isMD5Key ? "md5Result" : "md5String");
        this.lblCaption.node.position = v3(-5, 0, 0);
        tween(this.lblCaption.node)
            .to(0.3, { position: v3(0, 0, 0) })
            .start();
    }
}

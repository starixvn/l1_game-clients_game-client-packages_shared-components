import gc from "@sg/game-client-base";
import { Button, Label, Node, Prefab, RichText, UIOpacity, _decorator, instantiate, tween } from "cc";
import Observer from "observer";

import { InGameMenuHandlers } from "../../../../game/in-game-menu/scripts/handlers/in-game-menu-handlers";
import { InGameMenuEvents } from "../../../../game/in-game-menu/scripts/stores/in-game-menu-events";
import { Md5CopyButton } from "../../../../game/md5/scripts/md5-copy-button";
import MD5Tip from "../../../../game/md5/scripts/md5-tip";
import { CrashRoundHistory, CrashRoundHistoryStore } from "../../../crash-round-history/crash-round-history-store";
import { PopupsHandlers } from "../../../popups/popups-handlers";
import { RoundHistoryItem } from "../../../statistics-bar/round-history-item";
import { Md5PopupHandler } from "../handlers/md5-popup-handlers";
import { Md5PopupStore } from "../stores/md5-popup-store";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, Settlements, Translator, GameUtils } = gc;
@ccclass
export class Md5Popup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(RichText)
    lblMd5Key: RichText = null;

    @property(RichText)
    lblResult: RichText = null;

    @property(Prefab)
    prfStatusRound: Prefab = null;

    @property(Node)
    nodeStatusRound: Node = null;

    @property(Node)
    nodeKeyCopyButton: Node = null;

    @property(Node)
    nodeResultCopyButton: Node = null;

    @property(Button)
    btnDecrease: Button = null;

    @property(Button)
    btnIncrease: Button = null;

    @property(Node)
    nodeContentResultContainer: Node = null;

    @property(Node)
    nodeDisabledCopyResult: Node = null;

    @property(MD5Tip)
    protected resultHashTip: MD5Tip = null;

    private md5keyCopyString = null;
    private resultCopyString = null;

    private cpnKeyCopyButton: Md5CopyButton = null;
    private cpnResultCopyButton: Md5CopyButton = null;
    protected resultTipString: string;
    private maximumStringAllowed = 34;

    onLoad() {
        super.onLoad();
        this.cpnKeyCopyButton = this.nodeKeyCopyButton.getComponent(Md5CopyButton);
        this.cpnResultCopyButton = this.nodeResultCopyButton.getComponent(Md5CopyButton);
        this.registerTouchEvents();
        this.hideTooltip();
    }

    private registerTouchEvents() {
        this.nodeContentResultContainer?.on(Node.EventType.MOUSE_ENTER, this.showTooltip, this);
        this.nodeContentResultContainer?.on(Node.EventType.MOUSE_LEAVE, this.hideTooltip, this);
        this.nodeContentResultContainer?.on(Node.EventType.TOUCH_START, this.showTooltip, this);
    }

    private showTooltip() {
        if (this.resultTipString && this.resultHashTip) {
            this.resultHashTip.setData(this.resultTipString);
            this.resultHashTip.show(true);
            tween(this.resultHashTip.node.getComponent(UIOpacity)).to(0.2, { opacity: 255 }).delay(2).to(0.1, { opacity: 0 }).start();
        }
    }

    private hideTooltip() {
        this.resultHashTip?.show(false);
    }

    @render(Md5PopupStore, (store) => store.isOpenPopupMd5)
    showHidePopupMd5(isOpenPopupMd5: boolean) {
        if (isOpenPopupMd5) {
            this.node.active = true;
            this.closeOtherPopups();
        } else {
            this.node.active = false;
        }
    }

    @handle(PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutMd5())
    closeOtherPopups() {}

    @render(CrashRoundHistoryStore, (store) => store.md5PopupData, { fireImmediately: false })
    bindDataMd5(roundItem: CrashRoundHistory) {
        this.updateInfo(roundItem);
    }

    updateInfo(roundHistoryData: CrashRoundHistory) {
        if (roundHistoryData) {
            this.nodeStatusRound.destroyAllChildren();
            const hashValue = (roundHistoryData.md5Result.hashValue = roundHistoryData.md5Result.hashValue || "");
            this.md5keyCopyString = hashValue;
            const rawValue = (roundHistoryData.md5Result.rawValue = roundHistoryData.md5Result.rawValue || "");
            this.resultCopyString = rawValue;
            this.nodeDisabledCopyResult.active = rawValue ? false : true;
            this.resultTipString = rawValue;
            const formatValue =
                rawValue.length > this.maximumStringAllowed ? rawValue.slice(0, this.maximumStringAllowed) + "..." : rawValue;

            this.lblMd5Key.string = `<color=#4920a4>${hashValue}</color>`;
            this.lblRoundId.string = `#${roundHistoryData.roundId.toString()}`;
            this.lblResult.string = `<color=#4920a4>${formatValue}</color>`;
            const nodeStatus = instantiate(this.prfStatusRound);
            const cpnStatusRound = nodeStatus.getComponent(RoundHistoryItem);
            cpnStatusRound.roundInfo = roundHistoryData;
            cpnStatusRound.updateMultiplierValue(+roundHistoryData.result, "md5-bg-multiplier");
            this.nodeStatusRound.addChild(nodeStatus);
        }
    }

    @handle(Md5PopupHandler, (handle, value: boolean) => handle.updateShowHidePopupMd5(value))
    onClickCloseButton() {
        return false;
    }

    @handle(Md5PopupHandler, (handle, isIncrease: boolean) => handle.quickChangeRoundIndex(isIncrease))
    onClickRoundChange(event) {
        return event.target.name === "increase";
    }

    private handleRoundStatusQuickChange(button: Button, status: boolean) {
        button.interactable = status;
        button.node.getChildByName("icon").getComponent(UIOpacity).opacity = status ? 255 : 120;
        this.cpnKeyCopyButton.hideHint();
        this.cpnResultCopyButton.hideHint();
    }

    @render(CrashRoundHistoryStore, (store) => store.increaseStatus)
    private setIncreaseButtonStatus(increaseStatus: boolean) {
        this.handleRoundStatusQuickChange(this.btnIncrease, increaseStatus);
    }

    @render(CrashRoundHistoryStore, (store) => store.descreaseStatus)
    private setDecreaseButtonStatus(descreaseStatus: boolean) {
        this.handleRoundStatusQuickChange(this.btnDecrease, descreaseStatus);
    }

    onClickCopyButtonResult() {
        GameUtils.copyToClipboard(this.resultCopyString);
        this.cpnResultCopyButton.isCopying = true;
    }

    onClickCopyButtonKey() {
        GameUtils.copyToClipboard(this.md5keyCopyString);
        this.cpnKeyCopyButton.isCopying = true;
    }

    @handle(InGameMenuHandlers)
    protected handleEvent(event: string) {
        return event;
    }

    onOpenGuide() {
        this.handleEvent(InGameMenuEvents.OPEN_GUIDE_SCROLL_MD5);
    }
}

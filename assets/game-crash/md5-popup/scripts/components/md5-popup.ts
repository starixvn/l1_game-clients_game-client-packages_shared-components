import gc from "@sg/game-client-base";
import { Button, Label, Node, Prefab, RichText, UIOpacity, _decorator, instantiate } from "cc";
import Observer from "observer";

import { Md5CopyButton } from "../../../../game/md5/scripts/md5-copy-button";
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

    private md5keyCopyString = null;
    private resultCopyString = null;

    private cpnKeyCopyButton: Md5CopyButton = null;
    private cpnResultCopyButton: Md5CopyButton = null;

    onLoad() {
        super.onLoad();
        this.cpnKeyCopyButton = this.nodeKeyCopyButton.getComponent(Md5CopyButton);
        this.cpnResultCopyButton = this.nodeResultCopyButton.getComponent(Md5CopyButton);
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
            this.lblMd5Key.string = `<color=#4920a4>${hashValue}</color>`;
            this.lblRoundId.string = `#${roundHistoryData.roundId.toString()}`;
            this.lblResult.string = `<color=#4920a4>${rawValue}</color>`;
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
}

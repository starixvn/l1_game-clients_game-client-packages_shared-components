import gc from "@sg/game-client-base";
import { Label, Node, Prefab, RichText, _decorator, instantiate } from "cc";
import Observer from "observer";

import MD5Tip from "../../../../game/md5/scripts/md5-tip";
import { CrashRoundHistory, CrashRoundHistoryStore } from "../../../crash-round-history/crash-round-history-store";
import { RoundHistoryItem } from "../../../statistics-bar/round-history-item";
import { Md5PopupHandler } from "../handlers/md5-popup-handlers";
import { Md5PopupStore } from "../stores/md5-popup-store";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, Settlements, Translator } = gc;
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

    @property(MD5Tip)
    protected md5Tip: MD5Tip = null;

    private md5keyCopyString = null;
    private resultCopyString = null;

    onLoad() {
        super.onLoad();
    }

    @render(Md5PopupStore, (store) => store.isOpenPopupMd5)
    showHidePopupMd5(isOpenPopupMd5: boolean) {
        if (isOpenPopupMd5) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    @render(CrashRoundHistoryStore, (store) => store.md5PopupData, { fireImmediately: false })
    bindDataMd5(roundItem: CrashRoundHistory) {
        this.updateInfo(roundItem);
    }

    updateInfo(roundHistoryData: CrashRoundHistory) {
        if (roundHistoryData) {
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

    onClickCopyButtonResult() {
        console.log("onClickCopyButtonResult", this.resultCopyString);
        gc.GameUtils.copyToClipboard(this.resultCopyString);
        //this.md5Tip.show(false);
    }

    onClickCopyButtonKey() {
        gc.GameUtils.copyToClipboard(this.md5keyCopyString);
        //this.md5Tip.show(false);
    }
}

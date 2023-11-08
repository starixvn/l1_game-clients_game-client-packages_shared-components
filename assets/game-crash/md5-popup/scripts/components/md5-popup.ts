import gc from "@sg/game-client-base";
import { Label, Node, RichText, _decorator } from "cc";
import Observer from "observer";

import { CrashRoundHistory } from "../../../statistics-bar/statistics-bar";
import { StatusCurrentRound } from "../../../statistics-bar/status-current-round";
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

    @property(Node)
    nodeCurrentRound: Node = null;

    public round = {} as CrashRoundHistory;
    private isCrashed: boolean;
    private isPopupCurrRound = false;
    private resultHash = null;

    onLoad() {
        super.onLoad();
    }

    @render(Md5PopupStore, (store) => store.isCrashedGame)
    updateMd5Result(isCrashedGame: any) {
        if (isCrashedGame) {
            const crashValue = isCrashedGame.value;
            this.isCrashed = crashValue;
            const value = crashValue === 2 ? this.round.md5Result.rawValue : "";
            this.lblResult.string = value;
        }
    }

    @render(Md5PopupStore, (store) => store.isOpenPopupMd5)
    showHidePopupMd5(isOpenPopupMd5: boolean) {
        if (isOpenPopupMd5) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    @render(Md5PopupStore, (store) => store.isCurrRound)
    updatePopupCurrRound(isPopupCurrRound: boolean) {
        this.isPopupCurrRound = isPopupCurrRound;
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(roundId: number) {
        this.round.roundId = roundId;
    }

    @render(Md5PopupStore, (store) => store.roundHistoryData)
    bindDataMd5(roundHistoryData: CrashRoundHistory) {
        if (roundHistoryData) {
            this.updateInfo(roundHistoryData);
        }
    }

    updateInfo(roundHistoryData: CrashRoundHistory) {
        this.lblMd5Key.string = `<color=#4920a4>${roundHistoryData.md5Result.hashValue}</color>`;
        this.lblRoundId.string = `#${roundHistoryData.roundId.toString()}`;
        this.lblResult.string = `<color=#4920a4>${(roundHistoryData.md5Result.rawValue =
            roundHistoryData.md5Result.rawValue || "")}</color>`;
        const multiplier = +roundHistoryData.result;
    }

    @handle(Md5PopupHandler, (handle, value: boolean) => handle.updateShowHidePopupMd5(value))
    onClickCloseButton() {
        return false;
    }

    @render(Rounds.RoundStore, (store) => store.resultHash)
    private renderMd5(resultHash: gc.GameServiceMessage.ResultHash) {
        if (resultHash) {
            this.round.md5Result = resultHash;
            this.updateData();
        }
    }

    @handle(Md5PopupHandler, (handle, data: CrashRoundHistory) => handle.handleData(data))
    updateData() {
        return this.round;
    }

    @render(Settlements.SettlementStore, (store) => store.isFinishedShowResult)
    private updateMd5ResultFinish(isFinishedShowResult: boolean) {
        isFinishedShowResult && this.updateResultHash();
    }

    @handle(Md5PopupHandler, (handle, info: { isCrashed: number; data: CrashRoundHistory }) => handle.handleInfoCurrRound(info))
    updateResultHash() {
        return { data: this.round, isCrashed: 2 };
    }

    setMultiplierValue(multiplier: number) {
        const currRoundComp = this.nodeCurrentRound.getComponent(StatusCurrentRound);
        currRoundComp.updateMultiplierValue(multiplier, "md5-bg-multiplier");
    }
}

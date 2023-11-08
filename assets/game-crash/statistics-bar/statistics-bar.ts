import gc from "@sg/game-client-base";
import { Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { Md5PopupHandler } from "../md5-popup/scripts/handlers/md5-popup-handlers";
import { StatisticsButton } from "./statistics-button";
import { StatusCurrentRound } from "./status-current-round";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { FormatUtils, Rounds, Settlements } = gc;

export interface CrashRoundHistory extends gc.RoundHistories.RoundHistory {
    md5Result?: any;
}

@ccclass
export class StatisticsBar extends ObserverComponent {
    @property(Prefab)
    prbStatisticsItem: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Node)
    nodeCurrentRound = null;

    protected rounds: CrashRoundHistory[] = [];
    private isFirstLoad = false;
    private isMd5Crashed = 2;
    private resultHash = null;
    private lastRound: CrashRoundHistory = null;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories, { fireImmediately: false })
    setRoundsInfo(rounds: CrashRoundHistory[]) {
        this.rounds = [...rounds];
        if (!this.isFirstLoad) {
            this.updateStatisticsBarInfo(this.rounds);
            this.isFirstLoad = true;
        }
        this.updateStatisticsBarInfo(this.rounds);
    }

    private updateStatisticsBarInfo(rounds: CrashRoundHistory[]) {
        if (this.rounds.length === 0) {
            return;
        }
        console.log("rounds", rounds.length);
        this.content.destroyAllChildren();
        rounds.forEach((round, index) => {
            if (index > 9) {
                return;
            }
            const node = instantiate(this.prbStatisticsItem);
            const control = node.getComponent(StatisticsButton);
            const result = round.result;
            control.setData(round);
            control.setMultiplier(+result);
            this.content.addChild(node);
        });
        console.log("updateStatisticsBarInfo", this.content.children.length);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    updatePlacingBet(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.isMd5Crashed = 0;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.remaining)
    showHideLabelText(remaining: number) {
        if (remaining === 0) {
            this.isMd5Crashed = 1;
        }
    }

    updateMultiplierValue(value: number) {
        this.isMd5Crashed = 2;
        const currRoundComp = this.nodeCurrentRound.getComponent(StatusCurrentRound);
        currRoundComp.updateMultiplierValue(value, "statistics-bar");
    }

    @handle(
        Md5PopupHandler,
        (handle, info: { isCrashed: number; isOpenPopupMd5: boolean; data: CrashRoundHistory; isPopupCurrRound: boolean }) =>
            handle.handleMd5Popup(info)
    )
    onClickCurrRound() {
        return { isCrashed: this.isMd5Crashed, isOpenPopupMd5: true, isPopupCurrRound: true };
    }
}

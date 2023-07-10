import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
import BetItem from "./bet-item";

const { ccclass } = _decorator;
const { render } = Observer;
const { Settlements, Rounds, RoundHistories } = gc;

@ccclass()
export class BetItems extends ObserverComponent {
    betItemComponents: BetItem[] = [];
    settlementResult: gc.GameServiceMessage.TSettlementResult = null;
    protected isRunAnimHighlight = false;

    onLoad() {
        super.onLoad();
        this.betItemComponents = this.node.getComponentsInChildren(BetItem) ?? [];
    }

    @render(Settlements.SettlementStore, (store) => store.settlementResult)
    updateSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        settlementResult && (this.settlementResult = settlementResult);
    }

    get lostBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => !this.settlementResult?.[item.betChoice]);
    }

    get winBetItems(): BetItem[] {
        return this.betItemComponents.filter((item: BetItem) => this.settlementResult?.[item.betChoice]);
    }

    filterBetItem(choice: string) {
        return this.betItemComponents.find((item) => item.node.name === choice);
    }

    @render(Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        const { odds, fractional } = roundOdds;
        Object.keys(odds).forEach((choice) => {
            const betItem = this.filterBetItem(choice);
            betItem.renderOdd(odds[choice], fractional);
        });
    }

    @render(Rounds.RoundStore, (store) => store.ownBets)
    renderOwnBets(ownBets: gc.GameServiceMessage.OwnBets) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            if (ownBets?.[choice]) {
                betItem.renderOwnBet(gc.FormatUtils.numberWithCommas(ownBets[choice]));
            } else {
                betItem.renderOwnBet("");
            }
        });
    }

    @render(Rounds.RoundStore, (store) => store.totalBets)
    renderTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            if (totalBets?.[choice]) {
                betItem.renderTotalBet(gc.FormatUtils.numberWithCommas(totalBets[choice]));
            } else {
                betItem.renderTotalBet("");
            }
        });
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    clearChipsAtStartRound(isStartRound: boolean) {
        if (isStartRound) {
            this.betItemComponents.forEach((betItem) => betItem.clearChips());
        }
    }
    @render(Rounds.RoundTimeStore, (store) => store.isLocking)
    setRunAnimHighlight(isLocking: boolean) {
        isLocking && (this.isRunAnimHighlight = true);
    }

    @render(Rounds.RoundStore, (store) => store.highLightAnim, { fireImmediately: false })
    handleHighlightAnim(highLightInfo: gc.Rounds.THighLightInfo) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult && this.isRunAnimHighlight) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(settlementResult?.[choice] && isAnim);
            });
        }
    }

    @render(Rounds.RoundStore, (store) => store.highLightBorder, { fireImmediately: false })
    handleHighlightBorder(highLightBorder: gc.Rounds.THighLightBorder) {
        if (highLightBorder?.settlementResult) {
            this.showHighlightBorder(highLightBorder?.settlementResult);
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomShowResult)
    handleHighlightBorderWhenJoinRoom(joinRoomShowResult: gc.RoundHistories.IRoundHistoryInfo) {
        const { roundHistory, isShow } = joinRoomShowResult ?? {};
        if (roundHistory && isShow) {
            this.showHighlightBorder(roundHistory?.settlementResult);
        }
    }

    protected showHighlightBorder(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node?.name;
            choice && betItem.handleHighlightBorder(settlementResult?.[choice]);
        });
    }

    @render(Rounds.RoundStore, (store) => store.isResetHighlight)
    handleResetHighlight(isResetHighlight: boolean) {
        if (isResetHighlight) {
            this.betItemComponents.forEach((betItem) => {
                betItem.resetHighlightBorder();
            });
        }
    }
}

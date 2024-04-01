import gc from "@sg/game-client-base";
import { Node, _decorator } from "cc";
import { isEmpty } from "lodash-es";
import Observer from "observer";
import { StaticNode } from "../../../../shared/common-components/static-node/scripts/static-node";
import { StaticGroupId } from "../../../../shared/common-components/static-node/scripts/static-node-info";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
import BetItem from "./bet-item";

const { ccclass } = _decorator;
const { render, handle } = Observer;
const { Settlements, Rounds, RoundHistories } = gc;

type TContainerStatics = {
    [groupId: number]: Node[];
};
@ccclass
export class BetItems extends ObserverComponent {
    betItemComponents: BetItem[] = [];
    settlementResult: gc.GameServiceMessage.TSettlementResult = null;

    onLoad() {
        this.node && (this.betItemComponents = this.node.getComponentsInChildren(BetItem) ?? []);
        super.onLoad();
        this.handleStaticNode();
    }

    protected handleStaticNode() {
        const containerStatics: TContainerStatics = {
            [StaticGroupId.TextContainer]: [],
            [StaticGroupId.ChipContainer]: [],
            [StaticGroupId.BetInfoContainer]: [],
        };

        this.betItemComponents.forEach((betItemComponent) => {
            containerStatics[StaticGroupId.TextContainer].push(betItemComponent?.choice, betItemComponent?.lblOdds?.node);
            containerStatics[StaticGroupId.ChipContainer].push(betItemComponent?.chipBox);
            containerStatics[StaticGroupId.BetInfoContainer].push(betItemComponent?.lblOwnBet?.node, betItemComponent?.lblTotalBet?.node);
        });

        Object.keys(containerStatics).forEach((groupId) => {
            containerStatics[groupId]?.forEach((item: Node) => {
                const itemComp = item?.addComponent(StaticNode);
                itemComp && (itemComp.groupId = +groupId);
            });
        });
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
            betItem?.renderOdd(odds[choice], fractional);
        });
    }

    @render(Rounds.RoundStore, (store) => store.ownBets, { fireImmediately: false })
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

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        const { roundHistory, staticHighlight, animationHighlight } = firstJoinGameHistory;
        if (staticHighlight) {
            this.showHighlightStatic(roundHistory.settlementResult);
        }
        if (animationHighlight) {
            this.showAnimationHighlight(roundHistory.settlementResult);
        }
    }

    @render(Rounds.RoundStore, (store) => store.highLightAnim, { fireImmediately: false })
    handleHighlightAnim(highLightInfo: gc.Rounds.THighlightAnim) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(this.isWinning(+settlementResult?.[choice]) && isAnim);
            });
        }
    }

    @render(Rounds.RoundStore, (store) => store.highlightStatic, { fireImmediately: false })
    handleHighlightStatic(highlightStatic: gc.Rounds.THighlightStatic) {
        if (!isEmpty(highlightStatic?.settlementResult)) {
            this.showHighlightStatic(highlightStatic.settlementResult);
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinGameHistory)
    handleHighlightStaticWhenJoinStageResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        const { roundHistory } = joinGameHistory ?? {};
        if (roundHistory?.settlementResult) {
            this.showHighlightStatic(roundHistory.settlementResult);
        }
    }

    protected showHighlightStatic(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.handleHighlightStatic(this.isWinning(+settlementResult?.[choice]));
        });
    }

    protected showAnimationHighlight(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.handleHighlightAnim(this.isWinning(+settlementResult?.[choice]));
        });
    }

    @render(Rounds.RoundStore, (store) => store.isResetHighlight)
    handleResetHighlight(isResetHighlight: boolean) {
        if (isResetHighlight) {
            this.betItemComponents.forEach((betItem) => {
                betItem.handleHighlightStatic(false);
            });
        }
    }

    isWinning(value: number, target = 1) {
        return value === target;
    }

    @render(Rounds.RoundStore, (store) => store.userBetPercentage)
    handleUserBetPercentage(userBetPercentage: gc.GameServiceMessage.UserBetPercentage) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.renderUserBetPercentage(userBetPercentage ? userBetPercentage[choice] : 0);
        });
    }
}

import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { isEmpty } from "lodash-es";
import Observer from "observer";
import { StaticNode } from "../../../../shared/common-components/static-node/static-node";
import StaticNodeInfo from "../../../../shared/common-components/static-node/static-node-info";
import { ObserverComponent } from "./../../../../shared/common-components/observer-component/scripts/observer-component";
import BetItem from "./bet-item";

const { ccclass } = _decorator;
const { render } = Observer;
const { Settlements, Rounds, RoundHistories } = gc;

@ccclass()
export class BetItems extends ObserverComponent {
    betItemComponents: BetItem[] = [];
    settlementResult: gc.GameServiceMessage.TSettlementResult = null;

    onLoad() {
        super.onLoad();
        this.node && (this.betItemComponents = this.node.getComponentsInChildren(BetItem) ?? []);
        this.handleStaticNode();
    }

    protected handleStaticNode() {
        this.handleStaticTextContainer();
        this.handleStaticChipContainer();
        this.handleStaticBetInfoContainer();
    }

    private handleStaticTextContainer() {
        this.betItemComponents.forEach((betItemComponent) => {
            const choiceComp = betItemComponent.choice?.addComponent(StaticNode);
            choiceComp && (choiceComp.groupId = StaticNodeInfo.textContainer.groupId);

            const oddComp = betItemComponent.lblOdds?.addComponent(StaticNode);
            oddComp && (oddComp.groupId = StaticNodeInfo.textContainer.groupId);
        });
    }

    private handleStaticChipContainer() {
        this.betItemComponents.forEach((betItemComponent) => {
            const chipBoxComp = betItemComponent.chipBox?.addComponent(StaticNode);
            chipBoxComp && (chipBoxComp.groupId = StaticNodeInfo.chipContainer.groupId);
        });
    }

    private handleStaticBetInfoContainer() {
        this.betItemComponents.forEach((betItemComponent) => {
            const ownBetComp = betItemComponent.lblOwnBet?.addComponent(StaticNode);
            ownBetComp && (ownBetComp.groupId = StaticNodeInfo.betInfoContainer.groupId);

            const totalBetComp = betItemComponent.lblTotalBet?.addComponent(StaticNode);
            totalBetComp && (totalBetComp.groupId = StaticNodeInfo.betInfoContainer.groupId);
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

    @render(Rounds.RoundStore, (store) => store.highLightAnim, { fireImmediately: false })
    handleHighlightAnim(highLightInfo: gc.Rounds.THighlightAnim) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(settlementResult?.[choice] && isAnim);
            });
        }
    }

    @render(Rounds.RoundStore, (store) => store.highlightStatic, { fireImmediately: false })
    handleHighlightStatic(highlightStatic: gc.Rounds.THighlightStatic) {
        if (!isEmpty(highlightStatic?.settlementResult)) {
            this.showHighlightStatic(highlightStatic.settlementResult);
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinRoomShowResult)
    handleHighlightStaticWhenJoinRoom(joinRoomShowResult: gc.RoundHistories.IRoundHistoryInfo) {
        const { roundHistory, isShow } = joinRoomShowResult ?? {};
        if (roundHistory?.settlementResult && isShow) {
            this.showHighlightStatic(roundHistory.settlementResult);
        }
    }

    protected showHighlightStatic(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.betItemComponents.forEach((betItem) => {
            const choice = betItem.node.name;
            betItem.handleHighlightStatic(settlementResult?.[choice]);
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
}

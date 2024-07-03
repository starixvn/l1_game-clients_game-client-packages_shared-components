import gc from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { MultiplierCard } from "./multiplier-card";
const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { GameBaccaratX, Rounds, FormatUtils } = gc;

@ccclass
export class MultiplierCards extends ObserverComponent {
    @property(Prefab)
    prfMultiplierCard: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Label)
    lblRangeBetLimit: Label = null;

    @property(Label)
    lblExtraFee: Label = null;

    private minBet = 0;
    private maxBet = 0;

    private multiplierCards: MultiplierCard[] = [];

    findMatchedCard(card: ServiceCard): MultiplierCard {
        return this.multiplierCards.find((comp) => comp.data.rank === card.rank && comp.data.suit === card.suit);
    }

    @render(gc.MultipliersStore, (store) => store.renderMultipliers, { fireImmediately: false })
    renderMultipliers(renderMultipliers: { visible: boolean; animated: boolean; multipliers: any[] }) {
        const { visible, animated, multipliers } = renderMultipliers;

        if (!visible) {
            this.content.removeAllChildren();
            this.showMultiplierCards(false);
            return;
        }

        if (this.content.children.length > 0) {
            return;
        }
        console.log(`render multipliersssssssssssssssssss`);
        this.showMultiplierCards(true);
        this.content.removeAllChildren();
        this.multiplierCards = [];
        multipliers.forEach((item) => {
            const node = instantiate(this.prfMultiplierCard);
            const comp = node.getComponent(MultiplierCard);
            comp.setData(item);
            this.content.addChild(node);
            this.multiplierCards.push(comp);
        });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartingRound)
    hideCards() {
        this.showMultiplierCards(false);
    }

    showMultiplierCards(isShow: boolean) {
        this.content.active = isShow;
    }

    @render(Rounds.RoundStore, (store) => store.minBet)
    renderMinBet(minBet: number) {
        this.minBet = minBet;
        this.renderRangeBetLimit();
    }

    @render(Rounds.RoundStore, (store) => store.maxBet)
    renderMaxBet(maxBet: number) {
        this.maxBet = maxBet;
        this.renderRangeBetLimit();
    }

    renderRangeBetLimit() {
        this.lblRangeBetLimit.string = `$ ${FormatUtils.numberWithCommas(this.minBet, 2)} - ${FormatUtils.numberWithCommas(
            this.maxBet,
            2
        )}`;
    }

    @render(GameBaccaratX.ExtraFee.ExtraFeeStore, (store) => store.extraFee)
    renderExtraFee(extraFee: any) {
        if (extraFee) {
            const fee = extraFee.fee;
            const extraFeeString = extraFee.isRatio ? `${fee * 100}%` : `${FormatUtils.numberWithCommas(fee, 2)}`;
            this.lblExtraFee.string = extraFeeString;
        }
    }
}

import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { MultiplierCard } from "./multiplier-card";
const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { GameBaccaratX, Rounds } = gc;

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

    @render(GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.multiplierCards, { fireImmediately: false })
    renderMultiplierCards(multiplierCards: GameServiceMessage.BaccaratCardMultiplier[]) {
        this.content.removeAllChildren();
        multiplierCards.forEach((card) => {
            const node = instantiate(this.prfMultiplierCard);
            const comp = node.getComponent(MultiplierCard);
            comp.setData(card);
            this.content.addChild(node);
        });
        this.showMultiplierCards(true);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartingRound)
    hideCards() {
        this.showMultiplierCards(false);
    }

    showMultiplierCards(isShow: boolean) {
        this.content.active = isShow;
    }

    @render(Rounds.RoundStore, (store) => store.minBet, { fireImmediately: false })
    renderMinBet(minBet: number) {
        this.minBet = minBet;
        this.renderRangeBetLimit();
    }

    @render(Rounds.RoundStore, (store) => store.maxBet, { fireImmediately: false })
    renderMaxBet(maxBet: number) {
        this.maxBet = maxBet;
        this.renderRangeBetLimit();
    }

    renderRangeBetLimit() {
        this.lblRangeBetLimit.string = `$ ${this.minBet} - ${this.maxBet}`;
    }

    @render(GameBaccaratX.ExtraFee.ExtraFeeStore, (store) => store.extraFee)
    renderExtraFee(extraFee: any) {
        if (extraFee) {
            const fee = extraFee.fee;
            const extraFeeString = extraFee.isRatio ? `${fee * 100}%` : `${fee}`;
            this.lblExtraFee.string = extraFeeString;
        }
    }
}

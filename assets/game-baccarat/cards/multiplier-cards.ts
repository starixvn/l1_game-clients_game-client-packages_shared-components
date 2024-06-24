import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { MultiplierCard } from "./multiplier-card";
const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { GameBaccaratX } = gc;

@ccclass
export class MultiplierCards extends ObserverComponent {
    @property(Prefab)
    prfMultiplierCard: Prefab = null;

    @property(Node)
    content: Node = null;

    @render(GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.multiplierCards, { fireImmediately: false })
    renderMultiplierCards(multiplierCards: GameServiceMessage.BaccaratCardMultiplier[]) {
        console.log("renderMultiplierCards", multiplierCards);
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
}

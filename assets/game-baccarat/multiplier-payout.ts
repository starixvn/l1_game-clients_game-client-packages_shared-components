import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, GameBaccaratX } = gc;

@ccclass
export class MultiplierPayout extends ObserverComponent {
    labels: Label[] = [];
    onLoad() {
        this.labels = this.getComponentsInChildren(Label);
        this.cleanLabels();
        super.onLoad();
    }

    cleanLabels() {
        this.labels.forEach((label) => (label.string = ""));
    }

    @render(GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.possiblePayout)
    renderPossiblePayout(possiblePayout: gc.GameBaccaratX.Multiplier.ChoicesMultipliers) {
        this.labels.forEach((label) => {
            const choice = label.node.name;
            if (possiblePayout[choice]) {
                const value = possiblePayout[choice].value;
                label.string = `${value}`;
            } else {
                label.string = ``;
            }
        });
    }
}

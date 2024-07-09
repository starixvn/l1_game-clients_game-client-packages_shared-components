import gc from "@sg/game-client-base";
import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { FormatUtils, GameBaccaratX } = gc;

@ccclass
export class MultiplierPayout extends ObserverComponent {
    labels: Label[] = [];
    onLoad() {
        this.labels = this.getComponentsInChildren(Label);
        this.cleanLabels();
        super.onLoad();
    }

    cleanLabels() {
        this.labels.forEach((label) => {
            label.string = "";
            label.node.parent.active = false;
        });
    }

    @render(GameBaccaratX.Multiplier.BaccaratMultipliersStore, (store) => store.possiblePayout)
    renderPossiblePayout(possiblePayout: gc.GameBaccaratX.Multiplier.ChoicesMultipliers) {
        this.labels.forEach((label) => {
            const choice = label.node.name;
            const parentNode = label.node.parent;
            if (possiblePayout[choice]) {
                parentNode.active = true;
                const value = possiblePayout[choice].value;
                label.string = FormatUtils.numberWithCommas(value, 2, false);
            } else {
                parentNode.active = false;
                label.string = ``;
            }
        });
    }
}

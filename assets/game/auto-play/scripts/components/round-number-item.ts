import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "../handlers/auto-play-handler";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class RoundNumberItem extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    setValue(noOfRound: number) {
        this.lblNoOfRound.string = noOfRound.toString();
    }

    @handle(AutoPlayHandler, (handle) => handle.updateNoOfRound)
    onRoundNumberItemClick(event) {
        return +event.target.name;
    }
}

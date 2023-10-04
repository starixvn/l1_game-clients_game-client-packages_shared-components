import { Color, Label, Sprite, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "../handlers/auto-play-handler";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class RoundNumberItem extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    @property(Sprite)
    sprSelectedBg: Sprite = null;

    @property
    noOfRoundTextColor = "000000";

    setValue(noOfRound: number) {
        this.lblNoOfRound.string = noOfRound.toString();
    }

    setSelectedRound(selected: boolean) {
        this.sprSelectedBg.node.active = selected;
        selected && (this.lblNoOfRound.color = new Color().fromHEX(this.noOfRoundTextColor));
    }

    clearSelectBg() {
        this.sprSelectedBg.node.active = false;
    }

    @handle(AutoPlayHandler, (handle, rounds: number) => handle.updateNoOfRounds(rounds))
    onRoundNumberItemClick(event) {
        this.sprSelectedBg.node.active = false;
        this.setSelectedRound(true);
        return +event.target.name;
    }
}

import { Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { AutoPlayHandler } from "../handlers/auto-play-handler";
import { AutoPlayStore } from "../stores/auto-play-store";
import { RoundNumberItem } from "./round-number-item";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlayPopup extends ObserverComponent {
    @property(Node)
    content: Node = null;

    @property(Prefab)
    prfNoOfRound: Prefab = null;

    @render(AutoPlayStore, (store) => store.roundsList)
    initContentRounds(roundsList: number[]) {
        this.content.destroyAllChildren();
        roundsList.forEach((round) => {
            const node = instantiate(this.prfNoOfRound);
            const roundNumber = node.getComponent(RoundNumberItem);
            roundNumber?.setValue(round);
            this.content.addChild(node);
        });
    }

    @render(AutoPlayStore, (store) => store.selectedRoundOnPopup)
    renderSelectedRounds(noOfRounds: number) {
        this.content.children.forEach((child) => {
            const roundNumber = child.getComponent(RoundNumberItem);
            const selectedBg = roundNumber.value === noOfRounds;
            roundNumber.setSelectedRound(selectedBg);
        });
    }

    @render(AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    setAutoPlayPopupVisibility(status: boolean) {
        this.node.active = status;
    }

    @handle(AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    onClickclosePopup() {}

    @handle(AutoPlayHandler, (handle) => handle.confirmRoundAndStart())
    onClickStartButton() {}
}

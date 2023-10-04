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

    private roundsList = [10, 30, 50, 80, 100, 200, 500, 1000];

    onLoad() {
        super.onLoad();
        this.initContentRounds();
    }

    initContentRounds() {
        this.content.destroyAllChildren();
        this.roundsList.forEach((round, index) => {
            const node = instantiate(this.prfNoOfRound);
            node.name = round.toString();
            const roundNumber = node.getComponent(RoundNumberItem);
            roundNumber.setValue(round);
            const selectedBg = index === 0;
            roundNumber.setSelectedRound(selectedBg);
            this.content.addChild(node);
        });
    }

    @render(AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    setAutoPlayPopupVisibility(status: boolean) {
        this.node.active = status;
    }

    //@render(AutoPlayStore, (store) => store.isConfirmRound)

    @handle(AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    closePopup() {}
}

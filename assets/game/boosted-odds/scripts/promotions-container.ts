import { Node, _decorator } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import { PromotionsTable } from "./promotions-table";
import { settings } from "../../../../../../assets/game/scripts/game-settings";

const { ccclass } = _decorator;
const { render, observer } = Observer;

@ccclass("PromotionsContainer")
@observer(settings.name)
export class PromotionsContainer extends NodeContainer {
    wrapperNode: Node = null;
    table: PromotionsTable = null;

    @render(
        gc.BoostedOdds.BoostedOddsStore,
        (store) => {
            return {
                showPopup: store.showPopup,
                promotions: store.promotions,
            };
        },
        { fireImmediately: false }
    )
    showPromotionsPopup(data: { showPopup: boolean; promotions: Array<gc.BoostedOdds.PromotionModel> }) {
        // if (!data.showPopup) {
        //     return;
        // }

        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(PromotionsTable);
        }

        this.clearOldTable();
        this.table.showPromotions(data.promotions);
    }

    clearOldTable() {
        this.table.body.destroyAllChildren();
    }
}

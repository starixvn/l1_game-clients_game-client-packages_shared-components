import { _decorator, Color, Component, instantiate, Label, LabelShadow, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import PromotionItem from "./promotion-item";

const { ccclass, property } = _decorator;

@ccclass("PromotionsTable")
export class PromotionsTable extends Component {
    @property(Node)
    body: Node = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    @property(Node)
    termConditionBoard: Node = null;

    @property(Node)
    promotionBoard: Node = null;

    @property(Label)
    promoHeader: Label = null;

    @property(Label)
    termHeader: Label = null;

    @property(Label)
    count: Label = null;

    onPromotionClick() {
        this.onPromotionTab(true);
    }

    onTermClick() {
        this.onPromotionTab(false);
    }

    onPromotionTab(enabled: boolean) {
        this.termHeader.color = enabled ? Color.WHITE : new Color(254, 246, 0);
        this.promoHeader.color = enabled ? new Color(254, 246, 0) : Color.WHITE;
        this.promotionBoard.active = enabled;
        this.termConditionBoard.active = !enabled;
        this.promoHeader.node.getComponent(LabelShadow).enabled = enabled;
        this.termHeader.node.getComponent(LabelShadow).enabled = !enabled;
    }

    buildBodyRow(data: gc.Notification.PromotionModel): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        bodyRow.getComponent(PromotionItem).setData(data);

        return bodyRow;
    }

    showPromotions(model: Array<gc.Notification.PromotionModel>) {
        this.count.string = model?.length.toString();
        this.count.node.parent.active = true;
        model.forEach((data) => {
            this.body.addChild(this.buildBodyRow(data));
        });
    }
}

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

// const model2: Array<gc.BoostedOdds.PromotionModel> = [
//     {
//         _id: "64d1bb72b620ac67b14af695",
//         time: "2023-08-08T03:50:10.510Z",
//         message: null,
//         displayKind: 3,
//         gameName: "winthreecards",
//         messages: {
//             "en-US": "WinThreeCards Promotions",
//             "vi-VN": "WinThreeCards Promotions",
//             "zh-CN": "WinThreeCards Promotions",
//             "zh-TW": "WinThreeCards Promotions",
//             "th-TH": "WinThreeCards Promotions",
//             "id-ID": "WinThreeCards Promotions",
//         },
//         title: {
//             "en-US": "WinThreeCards Promotions",
//             "vi-VN": "WinThreeCards Promotions",
//             "zh-CN": "WinThreeCards Promotions",
//             "zh-TW": "WinThreeCards Promotions",
//             "th-TH": "WinThreeCards Promotions",
//             "id-ID": "WinThreeCards Promotions",
//         },
//         startTime: "2023-08-07T20:49:00.000Z",
//         endTime: "2023-08-10T20:49:00.000Z",
//         promotionId: "64d1bb4bb620ac67b14af694",
//         enabled: true,
//         gameId: 61,
//         isActive: true,
//     },
//     {
//         _id: "64d5f7feb620ac67b14af699",
//         time: "2023-08-11T08:57:34.399Z",
//         message: null,
//         displayKind: 3,
//         gameName: "minisedie",
//         messages: {
//             "en-US": "mini sedie",
//             "vi-VN": "mini sedie",
//             "zh-CN": "mini sedie",
//             "zh-TW": "mini sedie",
//             "th-TH": "mini sedie",
//             "id-ID": "mini sedie",
//         },
//         title: {
//             "en-US": "mini sedie",
//             "vi-VN": "mini sedie",
//             "zh-CN": "mini sedie",
//             "zh-TW": "mini sedie",
//             "th-TH": "mini sedie",
//             "id-ID": "mini sedie",
//         },
//         startTime: "2023-08-11T01:57:00.000Z",
//         endTime: "2023-08-12T04:00:00.000Z",
//         promotionId: "64d5f7d1b620ac67b14af698",
//         enabled: true,
//         gameId: 9,
//         isActive: true,
//     },
// ];

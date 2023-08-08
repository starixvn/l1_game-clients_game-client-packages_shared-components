import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import gc from "@sg/game-client-base";
import PromotionItem from "./promotion-item";

const { ccclass, property } = _decorator;

export interface IBetHistoryTable {
    showBetHistory(model: gc.BetHistory.BetHistoryModel): void;
}

@ccclass("PromotionsTable")
export class PromotionsTable extends Component {
    @property(Node)
    body: Node = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    buildBodyRow(data: gc.BoostedOdds.PromotionModel): Node {
        const bodyRow = instantiate(this.bodyPrefab);
        bodyRow.getComponent(PromotionItem).setData(data);

        return bodyRow;
    }

    showPromotions(model: Array<gc.BoostedOdds.PromotionModel>) {
        // const model1 = [
        //     {
        //         _id: "64d0bc73b620ac67b14af692",
        //         time: "2023-08-07T09:42:11.352Z",
        //         gameId: 2,
        //         odds: {
        //             even: 1.96,
        //             odd: 1.96,
        //             red3: 3.75,
        //             white3: 3.75,
        //             red4: 14.4,
        //             white4: 14.4,
        //             red2: 2.4,
        //         },
        //         startDateTime: "2023-08-07T02:42:00.000Z",
        //         endDateTime: "2023-08-11T02:42:00.000Z",
        //         status: "enabled",
        //         isDaily: false,
        //     },
        //     {
        //         _id: "64d1bb4bb620ac67b14af694",
        //         time: "2023-08-08T03:49:30.996Z",
        //         gameId: 61,
        //         odds: {
        //             dragon: 1.96,
        //             phoenix: 1.96,
        //             pair8Plus: 3,
        //             straight: 8,
        //             flush: 9,
        //             straightFlush: 101,
        //             threeOfAKind: 121,
        //         },
        //         startDateTime: "2023-08-07T20:49:00.000Z",
        //         endDateTime: "2023-08-10T20:49:00.000Z",
        //         status: "enabled",
        //         isDaily: false,
        //     },
        // ];

        const model2: Array<gc.BoostedOdds.PromotionModel> = [
            {
                _id: "64d1bb72b620ac67b14af695",
                time: "2023-08-08T03:50:10.510Z",
                message: null,
                displayKind: 3,
                gameName: "winthreecards",
                messages: {
                    "en-US": "WinThreeCards Promotions",
                    "vi-VN": "WinThreeCards Promotions",
                    "zh-CN": "WinThreeCards Promotions",
                    "zh-TW": "WinThreeCards Promotions",
                    "th-TH": "WinThreeCards Promotions",
                    "id-ID": "WinThreeCards Promotions",
                },
                title: {
                    "en-US": "WinThreeCards Promotions",
                    "vi-VN": "WinThreeCards Promotions",
                    "zh-CN": "WinThreeCards Promotions",
                    "zh-TW": "WinThreeCards Promotions",
                    "th-TH": "WinThreeCards Promotions",
                    "id-ID": "WinThreeCards Promotions",
                },
                startTime: "2023-08-07T20:49:00.000Z",
                endTime: "2023-08-10T20:49:00.000Z",
                promotionId: "64d1bb4bb620ac67b14af694",
                enabled: true,
                gameId: 61,
                isActive: true,
            },
            {
                _id: "64d0bc8ab620ac67b14af693",
                time: "2023-08-07T09:42:34.524Z",
                message: null,
                displayKind: 3,
                gameName: "xocxoc",
                messages: {
                    "en-US": "Sedie Promotions",
                    "vi-VN": "Sedie Promotions",
                    "zh-CN": "Sedie Promotions",
                    "zh-TW": "Sedie Promotions",
                    "th-TH": "Sedie Promotions",
                    "id-ID": "Sedie Promotions",
                },
                title: {
                    "en-US": "Sedie Promotions",
                    "vi-VN": "Sedie Promotions",
                    "zh-CN": "Sedie Promotions",
                    "zh-TW": "Sedie Promotions",
                    "th-TH": "Sedie Promotions",
                    "id-ID": "Sedie Promotions",
                },
                startTime: "2023-08-07T02:42:00.000Z",
                endTime: "2023-08-12T02:42:00.000Z",
                promotionId: "64d0bc73b620ac67b14af692",
                enabled: true,
                gameId: 2,
                isActive: true,
            },
        ];

        model2.forEach((data) => {
            this.body.addChild(this.buildBodyRow(data));
        });
    }
}

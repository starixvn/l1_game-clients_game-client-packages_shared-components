import { _decorator, instantiate, macro, Node, Prefab } from "cc";
import Observer from "observer";
import { BaccaratBigRoad } from "../../../../game/scoreboards/scripts/components/baccarat/big-road/baccarat-big-road";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { GatewayPanelStore } from "../gateway-panel-store";
import RenderItem from "../render-item/render-item";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("GoodRoadCounterHandler")
export class GoodRoadCounterHandler extends ObserverComponent {
    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    container: Node = null;

    private bigRoads = {};

    init(dataGames: any) {
        Object.keys(dataGames).forEach((id) => {
            const gameData = dataGames[id];

            const node = instantiate(this.itemPrefab);

            const renderItem = node.getComponent(RenderItem);
            renderItem.init(gameData);

            const bigRoad = node.getComponent(BaccaratBigRoad);
            this.bigRoads[id] = bigRoad;

            this.container.addChild(node);
            node.active = true;
            node.name = id;
        });

        this.schedule(this.checkGoodRoad, 1 / 30, macro.REPEAT_FOREVER);
    }

    @handle(GatewayPanelStore, (store, goodRoadGameIds: number[]) => store.updateGoodRoadGames(goodRoadGameIds))
    checkGoodRoad() {
        const goodRoadGameIds = Object.keys(this.bigRoads)
            .filter((id) => {
                const bigRoad: BaccaratBigRoad = this.bigRoads[id];
                return bigRoad?.existGoodRoad;
            })
            .map((id) => +id)
            .sort((a, b) => a - b);
        return goodRoadGameIds;
    }
}

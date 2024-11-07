import { _decorator, Component, instantiate, log, Node, Prefab, Toggle } from "cc";
import CategoryController from "./category/category-controller";
import CategoryItem from "./category/category-item";
import GatewayGameItem from "./gateway-game-item";
import { GameDataBase } from "./models/game-data-base";
const { ccclass, property } = _decorator;

enum TabName {
    All = "all",
    GoodRoad = "good-road",
}

enum CategoryName {
    Classic = "classic",
    Speed = "speed",
    Lucky = "lucky",
}

@ccclass("GatewayPanel")
export class GatewayPanel extends Component {
    @property(Prefab)
    protected gamePrefab: Prefab = null;

    @property(Node)
    protected container: Node = null;

    @property(Node)
    nodeScrollView: Node = null;

    @property(Node)
    nodeEmptyList: Node = null;

    onTabChanged(toggle: Toggle) {
        log("onTabChanged ", toggle.node.name);
        log("onTabChanged ", toggle.isChecked);
    }

    onCategoryChanged(toggle: Toggle) {
        log("onCategoryChanged ", toggle.node.name);
        log("onCategoryChanged ", toggle.isChecked);
    }

    onClickSetting() {}

    updateVisibility(existData: boolean) {
        this.nodeScrollView.active = existData;
        this.nodeEmptyList.active = !existData;
    }

    initItems(info: { [gameId: number]: { gameName: string; gameData: GameDataBase; categories: string[] } }) {
        let allCatogories = [];
        Object.keys(info).forEach((gameId) => {
            const node = instantiate(this.gamePrefab);
            this.container.addChild(node);

            const item = node.getComponent(GatewayGameItem);
            const { gameName, gameData, categories } = info[gameId];
            item.init({ gameId: +gameId, gameName, gameData });

            allCatogories.push(...categories);
            categories.forEach((category) => {
                const comp = item.addComponent(CategoryItem);
                comp.category = category;
            });
        });

        allCatogories = allCatogories.filter(
            (iterator, index, categories) => categories?.findIndex((category) => category === iterator) === index
        );

        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            // const data = GameUtils.getSpecificGameSetting(this.GatewayGameSetting);
            // const savedFilter = data[this.CategoryFilter] ?? [];
            // comp.node.on(CategoryEvent.Changed, this.saveCategoryFilter, this);
            const savedFilter = [];
            comp.initCategories(allCatogories, savedFilter);
        }
    }
}

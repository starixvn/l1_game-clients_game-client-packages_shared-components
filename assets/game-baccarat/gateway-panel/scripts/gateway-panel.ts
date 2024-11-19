import { _decorator, instantiate, Node, Prefab, Toggle } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "../../../shared/utils";
import CategoryController from "./category/category-controller";
import { CategoryEvent } from "./category/category-events";
import CategoryItem from "./category/category-item";
import GatewayGameItem from "./gateway-game-item";
import { GatewayPanelStore } from "./gateway-panel-store";
import { GameDataBase } from "./models/game-data-base";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("GatewayPanel")
export class GatewayPanel extends ObserverComponent {
    @property(Prefab)
    protected gamePrefab: Prefab = null;

    @property(Node)
    protected container: Node = null;

    @property(Toggle)
    toggleAll: Toggle = null;

    @property(Toggle)
    toggleGoodRoad: Toggle = null;

    @property(CategoryController)
    categoryController: CategoryController = null;

    @property(Node)
    nodeScrollView: Node = null;

    @property(Node)
    nodeEmptyList: Node = null;

    @property(Prefab)
    settingPrefab: Prefab = null;

    goodRoads: number[] = [];
    dataGames = {};
    gameInfo = {};

    isShowAll = true;
    orderGameIds: number[] = [];

    @handle(GatewayPanelStore, (store, enable: boolean) => store.saveAllGamesFilter(enable))
    onTabChanged(toggle: Toggle) {
        const isAll = toggle.node.name === "all";
        this.updateTabChanged(isAll);

        return this.isShowAll;
    }

    private updateTabChanged(isAll: boolean) {
        this.isShowAll = isAll;
        if (isAll) {
            this.categoryController.changeExtraFilter(null);
        } else {
            const goodRoadFilter = (item: Node) => {
                const gameId = +item.name;
                return this.goodRoads.includes(gameId);
            };
            this.categoryController.changeExtraFilter(goodRoadFilter);
        }

        this.checkEmptyListVisibility();
    }

    @render(GatewayPanelStore, (store) => store.orderGameIds)
    async renderOrderGameIds(orderGameIds: number[]) {
        this.orderGameIds = orderGameIds;
        try {
            this.container.destroyAllChildren();
            for (const gameId of this.orderGameIds) {
                const node = this.createItemForGameId(+gameId);
                this.container.addChild(node);
                this.categoryController.updateVisibility();
                await AnimationUtils.delayTime(0.1);
            }
        } catch (e) {}
    }

    @render(GatewayPanelStore, (store) => store.goodRoads)
    renderGoodRoadIds(goodRoads: number[]) {
        this.goodRoads = goodRoads;
        this.categoryController.updateVisibility();

        this.checkEmptyListVisibility();
    }

    onClickSetting() {
        const node = instantiate(this.settingPrefab);
        this.node.addChild(node);
    }

    checkEmptyListVisibility() {
        const existData = this.isShowAll || this.goodRoads.length > 0;

        this.nodeScrollView.active = existData;
        this.nodeEmptyList.active = !existData;
    }

    onDestroy(): void {
        Object.keys(this.dataGames).forEach((gameId) => {
            const gameData: GameDataBase = this.dataGames[gameId];
            gameData.clearStoreListeners();
        });
        this.dataGames = {};
        super.onDestroy();
    }

    addItems() {
        const info = this.gameInfo;
        Object.keys(info).forEach((gameId) => {
            this.createItemForGameId(+gameId);
        });
    }

    private createItemForGameId(gameId: number) {
        const info = this.gameInfo;
        const node = instantiate(this.gamePrefab);

        node.name = `${gameId}`;

        const item = node.getComponent(GatewayGameItem);
        const { gameName, categories } = info[gameId];
        const gameData: GameDataBase = this.dataGames[gameId];
        item.init({ gameId: +gameId, gameName, gameData });

        categories.forEach((category) => {
            const comp = item.addComponent(CategoryItem);
            comp.category = category;
        });

        return node;
    }

    initItems(dataGames, info: { [gameId: number]: { gameName: string; categories: string[] } }) {
        this.dataGames = dataGames;
        this.gameInfo = info;
        let allCatogories = [];
        Object.keys(info).forEach((gameId) => {
            const { categories } = info[gameId];
            allCatogories.push(...categories);
        });

        allCatogories = allCatogories.filter(
            (iterator, index, categories) => categories?.findIndex((category) => category === iterator) === index
        );

        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            comp.node.on(CategoryEvent.Changed, this.saveCategoryFilter.bind(this), this);
            comp.setAllCategories(allCatogories);
        }
    }

    @render(GatewayPanelStore, (store) => store.categoryFilter)
    renderCategoryFilter(categoryFilter: string[]) {
        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            comp.initCategories(categoryFilter);
        }
    }

    @render(GatewayPanelStore, (store) => store.allGamesFilter)
    renderAllGamesFilter(allGamesFilter: boolean) {
        if (allGamesFilter) {
            this.toggleAll.setIsCheckedWithoutNotify(true);
        } else {
            this.toggleGoodRoad.setIsCheckedWithoutNotify(true);
        }
        this.updateTabChanged(allGamesFilter);
    }

    @handle(GatewayPanelStore, (store, categories: string[]) => store.saveCategoryFilter(categories))
    saveCategoryFilterToStore(categories: string[]) {
        return categories;
    }

    saveCategoryFilter(categories: string[]) {
        this.saveCategoryFilterToStore([...categories]);
    }
}

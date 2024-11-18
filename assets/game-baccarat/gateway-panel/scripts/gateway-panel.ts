import { _decorator, instantiate, log, Node, Prefab, Toggle } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
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

    isShowAll = true;
    orderGameIds: number[] = [];
    itemPools: { [gameId: number]: Node } = {};

    @handle(GatewayPanelStore, (store, enable: boolean) => store.saveAllGamesFilter(enable))
    onTabChanged(toggle: Toggle) {
        const isAll = toggle.node.name === "all";
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

        return this.isShowAll;
    }

    @render(GatewayPanelStore, (store) => store.orderGameIds)
    renderOrderGameIds(orderGameIds: number[]) {
        this.orderGameIds = orderGameIds;

        this.orderGameIds.forEach((gameId) => {
            const item = this.itemPools[gameId];
            if (item) {
                this.container.addChild(item);
            }
        });
    }

    private setItemOrder(item: GatewayGameItem, orderGameIds: number[]) {
        const gameId = item.gameId;
        const index = orderGameIds.indexOf(gameId);
        if (index !== -1) {
            item.node.setSiblingIndex(index);
        } else {
            log("not found gameId ------------------", gameId);
        }
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

    initItems(dataGames, info: { [gameId: number]: { gameName: string; categories: string[] } }) {
        this.dataGames = dataGames;
        let allCatogories = [];
        Object.keys(info).forEach((gameId) => {
            const node = instantiate(this.gamePrefab);
            this.itemPools[gameId] = node;

            node.name = `${gameId}`;

            const item = node.getComponent(GatewayGameItem);
            const { gameName, categories } = info[gameId];
            const gameData: GameDataBase = this.dataGames[gameId];
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
        this.toggleAll.isChecked = allGamesFilter;
    }

    @handle(GatewayPanelStore, (store, categories: string[]) => store.saveCategoryFilter(categories))
    saveCategoryFilterToStore(categories: string[]) {
        return categories;
    }

    saveCategoryFilter(categories: string[]) {
        this.saveCategoryFilterToStore([...categories]);
    }
}

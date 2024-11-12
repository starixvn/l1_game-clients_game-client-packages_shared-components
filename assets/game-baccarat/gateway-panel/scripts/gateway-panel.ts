import { _decorator, instantiate, log, Node, Prefab, Toggle } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import CategoryController from "./category/category-controller";
import { CategoryEvent } from "./category/category-events";
import CategoryItem from "./category/category-item";
import GatewayGameItem from "./gateway-game-item";
import { GameDataBase } from "./models/game-data-base";
import { GoodRoadStore } from "./settings/good-road-store";
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

    isShowAll = true;

    @handle(GoodRoadStore, (store, enable: boolean) => store.saveAllGamesFilter(enable))
    onTabChanged(toggle: Toggle) {
        log("onTabChanged  ", toggle.node.name);
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

    @render(GoodRoadStore, (store) => store.goodRoads)
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

    initItems(info: { [gameId: number]: { gameName: string; gameData: GameDataBase; categories: string[] } }) {
        let allCatogories = [];
        Object.keys(info).forEach((gameId) => {
            const node = instantiate(this.gamePrefab);
            this.container.addChild(node);
            node.name = `${gameId}`;

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
            comp.node.on(CategoryEvent.Changed, this.saveCategoryFilter, this);
            log("setAllCategories ---- ", allCatogories);
            comp.setAllCategories(allCatogories);
        }
    }

    @render(GoodRoadStore, (store) => store.categoryFilter)
    renderCategoryFilter(categoryFilter: string[]) {
        log("renderCategoryFilter ---- ", categoryFilter);
        const comp = this.getComponentInChildren(CategoryController);
        if (comp) {
            comp.initCategories(categoryFilter);
        }
    }

    @render(GoodRoadStore, (store) => store.allGamesFilter)
    renderAllGamesFilter(allGamesFilter: boolean) {
        log("renderGoodRoadFilter ---- ", allGamesFilter);
        this.toggleAll.isChecked = allGamesFilter;
    }

    @handle(GoodRoadStore, (store, categories: string[]) => store.saveCategoryFilter(categories))
    saveCategoryFilter(categories: string[]) {
        return categories;
    }
}

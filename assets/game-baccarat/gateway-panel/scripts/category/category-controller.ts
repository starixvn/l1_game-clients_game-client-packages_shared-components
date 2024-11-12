import { _decorator, Component, log, Node, Toggle } from "cc";
import { CategoryEvent } from "./category-events";
import CategoryItem from "./category-item";

const { ccclass, property } = _decorator;

@ccclass
export default class CategoryController extends Component {
    @property(Node)
    container: Node = null;

    _items: Node[] = [];
    _toggles: Toggle[] = [];

    categories: string[] = [];
    allCategories: string[] = [];

    get items(): Node[] {
        if (this._items.length === 0) {
            this._items = this.container.children;
        }
        return this._items;
    }

    get toggles(): Toggle[] {
        if (this._toggles.length === 0) {
            this._toggles = this.getComponentsInChildren(Toggle);
        }
        return this._toggles;
    }

    extraFilter = (item: Node) => true;

    onToggleCategoryChanged(toggle: Toggle) {
        const categoryItem = toggle.getComponent(CategoryItem);
        const isChecked = toggle.isChecked;

        this.changeCategory(categoryItem.category, isChecked);
    }

    setAllCategories(categories: string[]) {
        this.allCategories = categories;
    }

    initCategories(storageCategories: string[]) {
        this.categories = storageCategories;

        this.toggles.forEach((toggle) => {
            const item = toggle.getComponent(CategoryItem);
            if (this.categories.includes(item.category)) {
                toggle.isChecked = true;
            }
        });
        this.updateItemVisibility();
    }

    changeCategory(category: string, checked: boolean) {
        log(`changeCategory ${category} `, checked);
        if (checked) {
            this.categories.push(category);
            this.removeDuplicateCategory();
        } else {
            const index = this.categories.indexOf(category);
            this.categories.splice(index, 1);
        }

        this.node.emit(CategoryEvent.Changed, this.categories);
        this.updateVisibility();
    }

    updateVisibility() {
        this.updateItemVisibility();
        this.updateSortOrder();
    }

    changeExtraFilter(filter: (item: Node) => boolean) {
        if (filter) {
            this.extraFilter = filter;
        } else {
            this.extraFilter = () => true;
        }
        this.updateVisibility();
    }

    private removeDuplicateCategory() {
        this.categories = this.categories.filter(
            (iterator, index, categories) => categories?.findIndex((category) => category === iterator) === index
        );
    }

    updateItemVisibility() {
        const categories = this.categories.length > 0 ? this.categories : this.allCategories;
        log("updateItemVisibility  ---- category: ", categories);
        this.items.forEach((item) => {
            const comps = item.getComponents(CategoryItem);
            item.active = comps.some((comp) => categories.includes(comp.category) && this.extraFilter(item));
        });
    }

    updateSortOrder() {
        // this.items.forEach((item) => {
        //     const gameItem = item.getComponent(GatewayGameItem);
        //     if (gameItem) {
        //         gameItem.node.setSiblingIndex(gameItem.gameId);
        //     }
        // });
    }
}

import { _decorator, Component, Constructor, instantiate, Layout, Node, ScrollView, UITransform, v2 } from "cc";
import { GridItemSettings } from "../settings/grid-item-settings";
import { GridLayoutSettings } from "../settings/grid-layout-settings";
import { GridItem } from "./grid-item";

const { ccclass, property } = _decorator;

@ccclass
export class GridLayout extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null;

    @property(Layout)
    public layout: Layout = null;

    @property(GridItemSettings)
    public itemSettings: GridItemSettings = null;

    @property(GridLayoutSettings)
    public settings: GridLayoutSettings = null;

    get content(): Node {
        return this.layout.node;
    }

    public render<D, T extends GridItem<D>>(classConstructor: Constructor<T>, items: D[]): void {
        this.removeUnusedNodes(items.length);

        items.forEach((item, index) => {
            const node = this.content.children[index];

            if (!node) {
                const newNode = instantiate(this.itemSettings.prefab);
                const component = this.getItemComponent(newNode, classConstructor);

                component.render(this.itemSettings, item, this.node, index);

                this.content.addChild(newNode);
            } else {
                const component = this.getItemComponent(node, classConstructor);

                component.render(this.itemSettings, item, this.node, index);
            }
        });

        this.updateLayout();
        this.scrollToEnd();
    }

    protected removeUnusedNodes(contentLength: number) {
        if (this.content.children.length > contentLength) {
            for (let index = contentLength; index < this.content.children.length; index++) {
                const node = this.content.children[index];

                node?.destroy();
            }
        }
    }

    protected getItemComponent<T extends Component>(node: Node, classConstructor: Constructor<T>): T {
        return node.getComponent(classConstructor) ?? node.getComponentInChildren(classConstructor);
    }

    onEnable() {
        this.updateLayout();
        this.scrollToEnd();
    }

    protected updateLayout() {
        if (!this.layout) {
            return;
        }
        this.layout.enabled = true;
        this.layout.updateLayout();
        this.layout.enabled = false;
    }

    public scrollToEnd() {
        if (!this.scrollView) {
            return;
        }
        
        const canScroll = this.settings.scrollable && this.settings.scrollToEnd;
        if (!canScroll) {
            return;
        }

        // Find the last item with active "normal" content
        const lastActiveItemIndex = this.findLastActiveItemIndex();
        
        if (lastActiveItemIndex === -1) {
            this.scrollView.scrollToOffset(v2(0, 0), 0.5, true);
            return;
        }

        this.scrollToItemIndex(lastActiveItemIndex);
    }

    private findLastActiveItemIndex(): number {
        const children = this.content.children;
        
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (this.hasActiveNormalChild(child)) {
                return i;
            }
        }
        
        return -1;
    }

    private hasActiveNormalChild(node: Node): boolean {
        const normalChild = node.getChildByName("normal");
        return normalChild?.active;
    }

    private scrollToItemIndex(index: number) {
        if (index < 0 || index >= this.content.children.length) {
            return;
        }

        const targetNode = this.content.children[index];
        if (!targetNode) {
            return;
        }

        // Calculate the position based on layout type
        const scrollOffset = this.calculateScrollOffsetForItem(index, targetNode);
        const maxOffset = this.scrollView.getMaxScrollOffset();
        const currentOffset = this.scrollView.getScrollOffset();

        // Ensure we don't scroll beyond the maximum offset
        const clampedOffset = v2(
            Math.min(scrollOffset.x, maxOffset.x),
            Math.min(scrollOffset.y, maxOffset.y)
        );

        // Only scroll if the position is different from current
        if (!clampedOffset.equals(currentOffset)) {
            this.scrollView.scrollToOffset(clampedOffset, 0.5, true);
        }
    }

    private calculateScrollOffsetForItem(index: number, targetNode: Node): any {
        const layout = this.layout;
        const scrollView = this.scrollView;
        
        if (!layout || !scrollView) {
            return v2(0, 0);
        }

        const itemTransform = targetNode.getComponent(UITransform);
        const contentTransform = this.content.getComponent(UITransform);
        const scrollViewTransform = scrollView.node.getComponent(UITransform);

        if (!itemTransform || !contentTransform || !scrollViewTransform) {
            return v2(0, 0);
        }

        const itemPos = targetNode.position;
        const itemSize = itemTransform.contentSize;
        const scrollViewSize = scrollViewTransform.contentSize;
        
        const offsetX = Math.max(0, itemPos.x + itemSize.width / 2 - scrollViewSize.width / 2);
        const offsetY = Math.max(0, itemPos.y + itemSize.height / 2 - scrollViewSize.height / 2);

        return v2(offsetX, offsetY);
    }
}

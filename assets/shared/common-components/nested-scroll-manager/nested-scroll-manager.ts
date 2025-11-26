import { _decorator, Component, macro, Node, Rect, ScrollView, UITransform, v2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NestedScrollManager')
export class NestedScrollManager extends Component {
    parentScrollView: ScrollView = null;
    childScrollViews: ScrollView[] = [];
    private scrollingChild: ScrollView = null;

    onLoad() {
        this.parentScrollView = this.node.getComponent(ScrollView);
        this.schedule(this.updateParentScrolling, 1 / 60, macro.REPEAT_FOREVER);
    }

    start() {
        this.updateScrollViewChildren();
    }

    updateScrollViewChildren() {
        // Get child scroll views and set up event listeners
        this.childScrollViews = this.parentScrollView.content.getComponentsInChildren(ScrollView).filter((child) => {
            return this.filterScrollView(child);
        });

        // Set up event listeners for each child
        this.registerHandleChildScrolling(this.childScrollViews);
    }

    addChildScrollViews(scrollViews: ScrollView[]): void {
        const newScrollViews = scrollViews.filter((child) => {
            return this.filterScrollView(child);
        });
        this.childScrollViews.push(...newScrollViews);
        this.registerHandleChildScrolling(newScrollViews);
    }

    registerHandleChildScrolling(scrollViews: ScrollView[]): void {
        scrollViews.forEach(child => {
            child.node.on(ScrollView.EventType.SCROLLING, () => this.onChildScrolling(child), this);
            child.node.on(ScrollView.EventType.SCROLL_ENDED, () => this.onChildScrollEnded(child), this);
        });
    }

    private filterScrollView(scrollView: ScrollView): boolean {
        return (scrollView.vertical === true && scrollView.vertical === this.parentScrollView.vertical) ||
            (scrollView.horizontal === true && scrollView.horizontal === this.parentScrollView.horizontal);
    }

    private onChildScrolling(child: ScrollView) {
        if (this.scrollingChild && this.scrollingChild !== child) {
            return; // Another child is already scrolling
        }

        const isAtBoundary = this.isAtScrollBoundary(child);
        if (isAtBoundary.boundary) {
            this.disableScrollChild(child);
            const currentOffset = this.parentScrollView.getScrollOffset();
            this.parentScrollView.scrollToOffset(v2(0, currentOffset.y + isAtBoundary.offset), 0);
            this.scrollingChild = null;
        } else {
            this.scrollingChild = child;
        }
    }

    private onChildScrollEnded(child: ScrollView) {
        if (this.scrollingChild === child) {
            this.scrollingChild = null;
        }
        if (!child.enabled) {
            this.setActiveChildScrollView(child, true);
        }
    }

    setActiveChildScrollView(child: ScrollView, enabled: boolean) {
        child.enabled = enabled;
    }

    private disableScrollChild(child: ScrollView) {
        const currentOffset = child.getScrollOffset();
        const maxOffset = child.getMaxScrollOffset();
        if (currentOffset.y < 0) {
            child.scrollToOffset(v2(0, 0), 0);
        } else if (currentOffset.y > maxOffset.y) {
            child.scrollToOffset(v2(0, maxOffset.y), 0);
        }
        this.setActiveChildScrollView(child, false);
    }

    private isAtScrollBoundary(scrollView: ScrollView): { boundary: boolean, offset: number } {
        if (scrollView.vertical) {
            const offset = scrollView.getScrollOffset();
            const maxOffset = scrollView.getMaxScrollOffset();
            const isTop = offset.y < 0;
            const isBottom = offset.y > maxOffset.y;
            const delta = isTop ? offset.y : isBottom ? (offset.y - maxOffset.y) : 0;
            return {
                boundary: isTop || isBottom,
                offset: delta
            };
        }

        return {
            boundary: false,
            offset: 0
        };
    }

    getWorldRect(node: Node): Rect {
        const transform = node.getComponent(UITransform);
        const pos = node.getWorldPosition();
        return new Rect(pos.x - transform.width * transform.anchorX, pos.y - transform.height * transform.anchorY, transform.width, transform.height);
    }

    updateParentScrolling() {
        if (!this.parentScrollView || this.childScrollViews.length === 0) {
            return;
        }

        const parentViewport = this.getWorldRect(this.parentScrollView.node);

        for (const child of this.childScrollViews) {
            const childBox = this.getWorldRect(child.node);

            const isInside = this.isFullyInside(childBox, parentViewport, this.parentScrollView.vertical);
            const needScroll = this.childNeedScroll(child);
            if (isInside && needScroll) {
                if (!child.enabled) {
                    this.setActiveChildScrollView(child, true);
                }
            } else {
                if (child.enabled) {
                    this.disableScrollChild(child);
                }
            }
        }
    }

    private isFullyInside(innerRect: Rect, outerRect: Rect, isVertical: boolean): boolean {
        const nearlyEqual = (a, b) => {
            return Math.abs(a - b) < 1;
        }

        if (innerRect.height > outerRect.height && (innerRect.yMax >= outerRect.yMax || nearlyEqual(innerRect.yMax, outerRect.yMax))) {
            return true;
        }

        const checkInner = (minI, maxI, minO, maxO) => {
            return (minI >= minO || nearlyEqual(minI, minO)) && (maxI <= maxO || nearlyEqual(maxI, maxO));
        }

        if (isVertical) {
            return checkInner(innerRect.yMin, innerRect.yMax, outerRect.yMin, outerRect.yMax);
        } else {
            return checkInner(innerRect.xMin, innerRect.xMax, outerRect.xMin, outerRect.xMax);
        }
    }

    private childNeedScroll(child: ScrollView): boolean {
        const vTransform = child.node.getComponent(UITransform);
        const contentTransform = child.content.getComponent(UITransform);
        return contentTransform.height > vTransform.height;
    }

    onDestroy() {
        // Clean up event listeners
        this.parentScrollView?.node?.off(ScrollView.EventType.SCROLLING, this.updateParentScrolling, this);

        this.childScrollViews.forEach(child => {
            child?.node?.off(ScrollView.EventType.SCROLLING, () => this.onChildScrolling(child), this);
            child?.node?.off(ScrollView.EventType.SCROLL_ENDED, () => this.onChildScrollEnded(child), this);
        });
    }
}
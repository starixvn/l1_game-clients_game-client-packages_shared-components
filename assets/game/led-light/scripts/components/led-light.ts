import { Component, Node, UITransform, _decorator, v3 } from "cc";
import { LedLightItem } from "./led-light-item";
import { LedLightTooltip } from "./led-light-tooltip";
const { ccclass, property } = _decorator;

@ccclass("LedLight")
export class LedLight extends Component {
    @property(Node)
    containerItem: Node = null;

    @property(LedLightTooltip)
    tooltip: LedLightTooltip = null;

    @property(Node)
    nodeNext: Node = null;

    @property
    maxItems = 33;

    private _nextItemActive = false;
    get nextItemActive(): boolean {
        return this._nextItemActive;
    }

    set nextItemActive(value: boolean) {
        this._nextItemActive = value;
        this.updateDisplayItems();
    }

    private _managedByParent = false;

    get managedByParent(): boolean {
        return this._managedByParent;
    }

    set managedByParent(value: boolean) {
        this._managedByParent = value;

        if (!value) {
            this.schedule(this.updateDisplayItems, 1);
        } else {
            this.unschedule(this.updateDisplayItems);
        }
    }

    protected ledLightItems: LedLightItem[] = [];
    protected selectedLedLight: Node = null;
    protected isShowDotNext = () => false;
    protected dataLogs: undefined[] = [];
    protected isHideNextDot = false;

    onLoad() {
        this.ledLightItems = this.containerItem.children.map((child) => child.getComponent(LedLightItem));
        this.ledLightItems.forEach((item) => {
            item.node.active = false;
            item.listener = this.ledLightItemListener;
        });
        this.schedule(this.updateDisplayItems, 1);
    }

    private ledLightItemListener = {
        onEnter: (node: Node) => {
            this.selectedLedLight = node;
            const data = node.getComponent(LedLightItem).ledLightItemInfo;
            if (this.tooltip && data) {
                const pos = this.tooltip.node.parent
                    .getComponent(UITransform)
                    .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
                this.tooltip.node.position = v3(pos.x, this.tooltip.node.position.y, 0);
                this.tooltip.setTooltipInfo(data);
                this.tooltip.showTooltip();
            }
        },
        onLeave: () => {
            this.selectedLedLight = null;
            this.tooltip?.showTooltip(false);
        },
    };

    onDestroy() {
        this.unschedule(this.updateDisplayItems);
    }

    changeConditionShowDotNext(condition: () => boolean) {
        this.isShowDotNext = condition;
    }

    protected onUpdateTooltipInfo(node: Node) {
        const itemInfo = node?.getComponent(LedLightItem).ledLightItemInfo;
        if (this.tooltip?.node?.active && itemInfo) {
            this.tooltip.setTooltipInfo(itemInfo);
        }
    }

    public setLedLightInfo(dataLogs: undefined[]) {
        this.dataLogs = { ...dataLogs };

        this.updateDisplayItems();
    }

    protected updateDisplayItems() {
        if (this.dataLogs.length === 0 || this.ledLightItems.length === 0) {
            return;
        }

        if (this.managedByParent) {
            this.updateLedLightItemInfo(this.dataLogs, this.nextItemActive);
        } else {
            const showNext = this.nodeNext && this.isShowDotNext();
            this.updateLedLightItemInfo(this.dataLogs, showNext);
        }
    }

    protected updateLedLightItemInfo(data: undefined[], showNext: boolean) {
        this.hideAllDots();
        this.ledLightItems[0].node.active = !showNext;
        this.nodeNext && (this.nodeNext.active = showNext);

        const startIndex = showNext ? 1 : 0;

        data.forEach((log, index) => {
            const calculatedIndex = startIndex + index;
            if (calculatedIndex >= this.ledLightItems.length) {
                return;
            }
            const item = this.ledLightItems[calculatedIndex];
            item.setLedLightItemInfo(log);
            item.node.active = true;
        });

        this.selectedLedLight && this.onUpdateTooltipInfo(this.selectedLedLight);

        if (showNext) {
            this.hideTooltip();
        }
    }

    protected hideAllDots() {
        this.ledLightItems.forEach((item) => {
            item.setStatusNode(false);
        });
    }

    protected hideTooltip() {
        this?.tooltip.showTooltip(false);
    }
}

import { _decorator, Component, UITransform } from "cc";
import { ComponentUtils } from "../utils/component-utils";
const { ccclass, property } = _decorator;

@ccclass
export class MaxAutoResize extends Component {
    @property
    syncWidth = true;

    @property
    syncHeight = true;

    @property
    syncPosition = false;

    @property({
        visible: function () {
            return this.syncWidth;
        },
    })
    ratioWidth = 1;

    @property({
        visible: function () {
            return this.syncHeight;
        },
    })
    ratioHeight = 1;

    @property({
        visible: function () {
            return this.syncWidth;
        },
    })
    widthPadding = 0;

    @property({
        visible: function () {
            return this.syncHeight;
        },
    })
    heightPadding = 0;

    update() {
        this.doSyncWidth();
        this.doSyncHeight();
    }

    private doSyncWidth() {
        if (this.syncWidth) {
            let maxW = 0;
            this.node.children.forEach((child) => {
                if (!child.active || !child.isValid) {
                    return;
                }
                const uiTransform = child.getComponent(UITransform);
                if (uiTransform && uiTransform.isValid) {
                    maxW = Math.max(maxW, uiTransform.width);
                }
            });

            const width = maxW * this.ratioWidth + 2 * this.widthPadding;
            ComponentUtils.setNodeTransform(this.node, { width });
        }
    }

    private doSyncHeight() {
        if (this.syncHeight) {
            let maxH = 0;
            this.node.children.forEach((child) => {
                if (!child.active || !child.isValid) {
                    return;
                }
                const uiTransform = child.getComponent(UITransform);
                if (uiTransform && uiTransform.isValid) {
                    maxH = Math.max(maxH, uiTransform.height);
                }
            });

            const height = maxH * this.ratioHeight + 2 * this.heightPadding;
            ComponentUtils.setNodeTransform(this.node, { height });
        }
    }
}

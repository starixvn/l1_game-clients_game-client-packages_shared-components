import { Component, Node, Tween, UIOpacity, _decorator, math, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ExpandableNode")
export class ExpandableNode extends Component {
    @property(Node)
    expandableNode: Node = null;

    @property(Node)
    tapToCollapseNode: Node = null;

    @property
    defaultExpand = false;

    protected readonly expandDuration = 0.2;
    protected readonly expandScale = math.v3(1, 1, 1);
    protected readonly collapseScale = math.v3(1, 0, 1);
    protected expanded = false;
    protected expandableOpacity: UIOpacity;

    onLoad() {
        this.expandableOpacity = this.expandableNode.getComponent(UIOpacity);
        if (this.defaultExpand) {
            this.expand();
        } else {
            this.collapse(false);
        }
    }

    collapse(animated = true) {
        this.expanded = false;

        if (this.tapToCollapseNode) {
            this.tapToCollapseNode.active = false;
        }

        if (!animated) {
            this.expandableOpacity.opacity = 0;
            this.expandableNode.scale = this.collapseScale;
            return;
        }
        this.tweenCollape();
    }

    expand() {
        this.expanded = true;
        if (this.tapToCollapseNode) {
            this.tapToCollapseNode.active = true;
        }
        this.tweenExpand();
    }

    onClickExpand() {
        this.expanded = !this.expanded;
        this.expanded ? this.expand() : this.collapse();
    }

    tweenExpand() {
        Tween.stopAllByTarget(this.expandableNode);
        tween(this.expandableNode).to(this.expandDuration, { scale: this.expandScale }).start();
        tween(this.expandableOpacity).to(this.expandDuration, { opacity: 255 }).start();
    }

    tweenCollape() {
        Tween.stopAllByTarget(this.expandableNode);
        tween(this.expandableNode).to(this.expandDuration, { scale: this.collapseScale }).start();
        tween(this.expandableOpacity).to(this.expandDuration, { opacity: 0 }).start();
    }
}

import { _decorator, Component, Node, tween, Tween, UIOpacity, UITransform, Widget } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class BaccaratScoreboardContainer extends Component {
    @property(Node)
    beadRoad: Node = null;

    @property(Node)
    derivedNode: Node = null;

    @property(Node)
    nodeArrow: Node = null;

    private HEIGHT_COLLAPSE = 145;
    private HEIGHT_EXPAND = 333;
    private tweenNode: Tween<UITransform> = null;
    private tweenBeadRoad: Tween<UIOpacity> = null;
    private tweenDrivedRoad: Tween<UIOpacity> = null;

    private isCollapse = true;
    onClickCollapseExpand() {
        this.isCollapse = !this.isCollapse;
        this.nodeArrow.setScale(1, this.isCollapse ? 1 : -1);
        this.beadRoad.getComponent(UIOpacity).opacity = this.isCollapse ? 0 : 255;
        this.derivedNode.getComponent(UIOpacity).opacity = this.isCollapse ? 0 : 255;

        this.node.getComponent(UITransform).height = this.isCollapse ? this.HEIGHT_COLLAPSE : this.HEIGHT_EXPAND;
        this.node.children.forEach((child) => {
            const widget = child.getComponent(Widget);
            if (widget) {
                widget.updateAlignment();
            }
        });
    }

    onClickCollapseExpand1() {
        this.isCollapse = !this.isCollapse;
        this.tweenNode = tween(this.node.getComponent(UITransform))
            .to(0.2, { height: this.isCollapse ? 145 : 333 })
            .start();
    }
}

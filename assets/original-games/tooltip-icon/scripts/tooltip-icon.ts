import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TooltipIcon')
export class TooltipIcon extends Component {
    @property(Node)
    tooltip: Node = null;

    start() {
        if (this.tooltip) {
            this.tooltip.active = false;
        }

        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    private onMouseEnter() {
        if (this.tooltip) {
            this.tooltip.active = true;
        }
    }

    private onMouseLeave() {
        if (this.tooltip) {
            this.tooltip.active = false;
        }
    }
}



import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LedLightItem")
export class LedLightItem extends Component {
    @property(Node)
    background: Node = null;

    @property(Node)
    highlight: Node = null;

    @property(Node)
    next: Node = null;

    public ledLightItemInfo: Record<undefined, undefined> = {};

    public setLedLightItemInfo(ledLightItemInfo: undefined): void {
        // handle
    }

    public listener = {
        onEnter: (node: Node) => {},
        onLeave: (node: Node) => {},
    };

    onEnable() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    onDisable() {
        this.node.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    eventOnEnter() {
        this.listener.onEnter(this.node);
    }

    eventOnLeave() {
        this.listener.onLeave(this.node);
    }

    setStatusNode(status: boolean) {
        this.node.active = status;
    }
}

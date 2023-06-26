import { Button, Node, _decorator } from "cc";
const { ccclass, property } = _decorator;

export enum ButtonState {
    NORMAL = "normal",
    HOVER = "hover",
    PRESSED = "pressed",
    DISABLED = "disabled",
}

@ccclass("StatusButton")
export class StatusButton extends Button {
    @property(Node)
    disableNode: Node = null;

    @property(Node)
    activeNode: Node = null;

    _applyTransition(state: string) {
        super._applyTransition(state);
        if (this.activeNode) {
            this.activeNode.active = state === ButtonState.HOVER || state === ButtonState.PRESSED;
        }
        if (this.disableNode) {
            this.disableNode.active = state === ButtonState.DISABLED;
        }
    }
}

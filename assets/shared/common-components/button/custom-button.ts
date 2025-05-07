import { _decorator, Button } from "cc";
const { ccclass, property } = _decorator;

export const ButtonStateEvent = "button-interactable-changed";
export const StateChangedEvent = "state-changed";
@ccclass("CustomButton")
export class CustomButton extends Button {
    protected _updateState(): void {
        const state = this._getButtonState();
        this._applyTransition(state);
        this.node.emit(StateChangedEvent, state);
        this.node.emit(ButtonStateEvent, this.interactable);
    }
}

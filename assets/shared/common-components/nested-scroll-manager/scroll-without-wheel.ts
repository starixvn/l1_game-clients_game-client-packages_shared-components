import { _decorator, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollWithoutWheel')
export class ScrollWithoutWheel extends ScrollView {
    protected _onMouseWheel(event): void {
        event.preventSwallow = true;
        event.propagationStopped = false;
    }

    protected _stopPropagationIfTargetIsMe(event): void {
        event.preventSwallow = true;
        event.propagationStopped = false;
    }
}
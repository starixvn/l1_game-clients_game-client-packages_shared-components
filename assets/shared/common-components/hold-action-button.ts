import { _decorator, Button, Component, EventHandler, EventKeyboard, EventTouch, game, input, Input, KeyCode, macro, Node } from "cc";
import { ComponentUtils } from "../utils";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(Button)
export default class HoldActionButton extends Component {
    @property({ type: EventHandler })
    clickEvents: EventHandler[] = [];

    static Events = {
        STOP_HOLD_SPIN: "STOP_HOLD_SPIN",
    };

    protected isTouching = false;
    protected isKeyPressing = false;
    protected pressedTime: number;
    protected readonly _actions = [];

    public onlyButtonFunction = false;
    public interactable = true;
    public checkPreventFunctioning = () => false;

    get isAutoAction() {
        return this.interactable && (this.isTouching || this.isKeyPressing);
    }

    public addAction(action: () => void) {
        this._actions.push(action);
    }

    onLoad() {
        this.registerKeyEvents();
        this.registerTouchEvents();
    }

    private registerTouchEvents() {
        this.node.on(Node.EventType.TOUCH_START, this.startHoldButton, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.stopHoldButton, this);
        this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    }

    onDestroy() {
        this.removeKeyEvents();
    }

    private handleTouchEnd(event: EventTouch) {
        const location = event.getLocation();
        const transform = ComponentUtils.getTransform(this.node);
        const hit = transform.hitTest(location, event.windowId);
        this.stopHoldButton();
        if (hit) {
            this.doAction(false);
        }
    }

    private handleTouchMove(event: EventTouch) {
        const location = event.getLocation();
        const transform = ComponentUtils.getTransform(this.node);
        const hit = transform.hitTest(location, event.windowId);
        if (!hit) {
            this.stopHoldButton();
            event.propagationStopped = true;
        }
    }

    private doAction(isSpecialAction: boolean) {
        if (!this.interactable) {
            return;
        }
        if (this.onlyButtonFunction && isSpecialAction) {
            return;
        }
        Component.EventHandler.emitEvents(this.clickEvents, isSpecialAction);
        this._actions.forEach((action) => action && action());
    }

    private updateForHoldButton() {
        if (this.isTouching) {
            this.doAction(true);
        }
    }

    private startHoldButton() {
        if (this.checkPreventFunctioning()) {
            return;
        }
        this.isTouching = true;
        this.schedule(this.updateForHoldButton, 1, macro.REPEAT_FOREVER, 0);
    }

    private stopHoldButton() {
        this.isTouching = false;
        this.unschedule(this.updateForHoldButton);
        this.node.emit(HoldActionButton.Events.STOP_HOLD_SPIN);
    }

    registerKeyEvents() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        game.canvas.onblur = () => this.disableAutoAction();
    }

    removeKeyEvents() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE || event.keyCode === KeyCode.ENTER) {
            this.pressedTime = Date.now();
            this.enableAutoAction();
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE || event.keyCode === KeyCode.ENTER) {
            if (!this.isKeyPressing) {
                return;
            }
            const deltaTime = Date.now() - this.pressedTime;

            if (deltaTime < 1000) {
                this.doAction(false);
            }
            this.disableAutoAction();

            this.node.emit(HoldActionButton.Events.STOP_HOLD_SPIN);
        }
    }

    enableAutoAction() {
        if (this.checkPreventFunctioning()) {
            return;
        }

        if (this.isKeyPressing) {
            return;
        }

        this.isKeyPressing = true;
        this.schedule(this.onScheduleUpdateForKey, 1, macro.REPEAT_FOREVER);
    }

    disableAutoAction() {
        this.isKeyPressing = false;
        this.unschedule(this.onScheduleUpdateForKey);
    }

    onScheduleUpdateForKey() {
        if (!this.isKeyPressing) {
            return;
        }

        this.doAction(true);
    }
}

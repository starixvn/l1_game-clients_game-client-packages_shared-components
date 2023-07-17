import { _decorator, Component, Label, tween, NodeEventType, v2, v3, UITransform } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { l10n } from "../../../../../localization-editor/static/assets/l10n";

const { render, observer } = Observer;
const { ccclass, property } = _decorator;
const { FormatUtils, Notification } = gc;

@ccclass
@observer
export class JackpotNotification extends Component {
    @property(Label)
    lblPlayerName: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblGameName: Label = null;

    private ttOffset = v2(0, 0);
    private ttOffset2 = v2(0, 0);

    onLoad() {
        this.node.active = false;
        this.resetJackPotNotification();
        this.moveToEdge();
    }

    onEnable() {
        this.node.on(NodeEventType.TOUCH_START, this.eventStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.eventMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.eventEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.eventEnd, this);
    }
    onDisable() {
        this.node.off(NodeEventType.TOUCH_START, this.eventStart, this);
        this.node.off(NodeEventType.TOUCH_MOVE, this.eventMove, this);
        this.node.off(NodeEventType.TOUCH_END, this.eventEnd, this);
        this.node.off(NodeEventType.TOUCH_CANCEL, this.eventEnd, this);
    }

    eventStart(e) {
        this.ttOffset = v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
        this.ttOffset2 = v2(
            e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x),
            e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y)
        );
    }
    eventMove(e) {
        this.node.setPosition(v3(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y, 0));
    }

    callMoveToEdge() {
        this.unschedule(this.moveToEdge);
        this.scheduleOnce(this.moveToEdge, 0.2);
    }

    moveToEdge() {
        const width = this.node.parent.getComponent(UITransform).width;
        const height = this.node.parent.getComponent(UITransform).height;
        const fixTopPadding = 100;
        const size = this.getCurrentSize();
        const maxX = width / 2 - size.x / 2;
        const maxY = height / 2 - size.y / 2;
        const deltaWidth = maxX - Math.abs(this.node.position.x);
        const deltaHeight = maxY - Math.abs(this.node.position.y);

        let posX, posY;
        if (deltaWidth < deltaHeight) {
            posY = this.node.position.y;
            posY = Math.min(maxY, posY);
            posY = Math.max(-maxY, posY);
            posX = this.node.position.x < 0 ? -maxX : maxX;
        } else {
            posX = this.node.position.x;
            posX = Math.min(maxX, posX);
            posX = Math.max(-maxX, posX);
            posY = this.node.position.y < 0 ? -maxY : maxY;
        }

        posY = Math.min(maxY - fixTopPadding, posY);

        tween(this.node)
            .to(0.1, { position: v3(posX, posY) }, { easing: "sineOut" })
            .start();
    }

    getCurrentSize() {
        const ui = this.node.getComponent(UITransform);
        return v2(ui.width, ui.height);
    }

    eventEnd(e) {
        this.moveToEdge();
        const xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x);
        const yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y);
        if (xChanger < 5 && xChanger > -5 && yChanger < 5 && yChanger > -5) {
            this.callMoveToEdge();
        }
    }

    resetJackPotNotification() {
        this.lblPlayerName.string = "";
        this.lblAmount.string = "";
        this.lblGameName.string = "";
    }

    @render(Notification.JackpotWinnerStore, (store) => store.jackpotWinner, { fireImmediately: false })
    notifyJackpotWinner(jackpotWinner: gc.NotificationServiceMessage.JackpotWinner) {
        this.lblPlayerName.string = jackpotWinner.winnerName;
        this.lblAmount.string = FormatUtils.numberWithCommas(jackpotWinner.amount, 2);
        this.lblGameName.string = l10n.t(`gameNames.${jackpotWinner.gameId}`);

        this.node.active = true;

        tween(this.node).delay(6).to(0, { active: false }).start();
    }
}

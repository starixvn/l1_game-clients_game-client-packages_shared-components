import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import * as _ from "lodash";
const { ccclass, property } = _decorator;

@ccclass
export class FairnessSettingsBaccaratPopup extends Component {
    @property(Label)
    lblClientSeed: Label = null;

    @property(Label)
    lblSHA256: Label = null;

    @property(Prefab)
    prfManualSettings: Prefab = null;

    @property(Node)
    nodeManualSettings: Node = null;

    @property(Label)
    lblCountDown: Label = null;

    @property(Prefab)
    prfWaitingScreen: Prefab = null;

    @property
    timer = 10;

    onLoad() {
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopup, this);
        this.renderCountDown();
    }

    showPopup() {
        const manual = instantiate(this.prfManualSettings);
        this.nodeManualSettings.addChild(manual);
    }

    private randomClientSeedValue(): string {
        return _.random(1000, 9999).toString();
    }

    renderCountDown() {
        const interval = setInterval(() => {
            this.lblCountDown && (this.lblCountDown.string = this.timer.toString());
            this.timer--;
            if (this.timer < 0) {
                clearInterval(interval);
                this.node.destroy();
            }
        }, 1000);
    }

    onClickSubmit() {
        const waiting = instantiate(this.prfWaitingScreen);
    }
}

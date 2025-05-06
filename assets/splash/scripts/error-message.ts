import { Component, Label, UIOpacity, Vec3, _decorator } from "cc";
import { RandomWaitingMessageLandscape } from "../../shared/common-components/random-waiting-message-landscape";

const { ccclass, property } = _decorator;

@ccclass
export class ErrorMessage extends Component {
    @property(Label)
    lblMessage: Label = null;

    reset() {
        this.getComponent(RandomWaitingMessageLandscape)?.reset();
        this.lblMessage.node.getComponent(UIOpacity).opacity = 255;
        this.lblMessage.node.position = Vec3.ZERO;
    }

    setMessage(message: string) {
        this.lblMessage.string = message;
    }
}

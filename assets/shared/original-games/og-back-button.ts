import { _decorator, Button, Component } from "cc";
import { AudioUtils } from "../../game/audios/utils";
import { FunctionUtils } from "../utils";
import { ORIGINAL_GAMES_MESSAGES } from "./original-games-utils";
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

@ccclass
export class OgBackButton extends Component {

    onClick() {
        AudioUtils.playClick();
        FunctionUtils.postMessageToOriginalLobby(ORIGINAL_GAMES_MESSAGES.BACK_TO_ORIGINAL_PAGE);
    }

    onLoad() {
        if (!this.getComponent(Button)) {
            this.node.addComponent(Button);
        }
        this.node.on(Button.EventType.CLICK, this.onClick, this);
    }
}


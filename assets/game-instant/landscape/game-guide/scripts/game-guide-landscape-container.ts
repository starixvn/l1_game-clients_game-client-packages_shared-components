import { _decorator } from "cc";
import { Dialog } from "../../../../shared/common-components/dialogs/dialog";
import { GameGuideContainer } from "../../../../game/game-guide/scripts/game-guide-container";

const { ccclass } = _decorator;

@ccclass("GameGuideLandscapeContainer")
export class GameGuideLandscapeContainer extends GameGuideContainer {
    private isOpen = false;
    onLoad() {
        super.onLoad();
        window.addEventListener("message", this.handleEventFromParent.bind(this));
    }

    handleEventFromParent(event: MessageEvent) {
        if (event.data.openGameGuide) {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.openDialog();
            } else {
                this.node?.getComponentInChildren(Dialog)?.hide();
            }
        }
    }
}

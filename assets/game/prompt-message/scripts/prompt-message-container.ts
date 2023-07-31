import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import PromptMessageComponent from "./prompt-message-component";
const { Rounds } = gc;
const { render } = Observer;
const { ccclass, property } = _decorator;

@ccclass("PromptMessageContainer")
export class PromptMessageContainer extends NodeContainer {
    @property(PromptMessageComponent)
    promptMessageComponent: PromptMessageComponent = null;

    @render(Rounds.RoundTimeStore, (store) => ({ roundState: store.roundState }))
    showStopBetMessage({ roundState }) {
        if (roundState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.getComponent().showStopBetMessage();
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    showStartBetMessage(isStartingRound: boolean) {
        if (isStartingRound) {
            setTimeout(() => {
                this.getComponent().showStartBetMessage();
            }, 1000);            
        }
    }

    getComponent() {
        if (!this.promptMessageComponent) {
            const node = this.createNode();
            this.promptMessageComponent = node.getComponent(PromptMessageComponent);
        }

        return this.promptMessageComponent;
    }
}

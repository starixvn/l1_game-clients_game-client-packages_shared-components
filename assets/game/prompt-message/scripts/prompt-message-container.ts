import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
import PromptMessageComponent from "./prompt-message-component";
const { Rounds } = gc;
const { render } = Observer;
const { ccclass } = _decorator;

@ccclass("PromptMessageContainer")
export class PromptMessageContainer extends NodeContainer {
    @render(Rounds.RoundTimeStore, (store) => ({ roundState: store.roundState }))
    showNoMoreBetMessage({roundState}) {        
        if(roundState === Rounds.ROUND_STATE.LOCKING_BET){
            this.initComponent().showNoMoreBetMessage();
        }               
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    showPlaceYourBetMessage(isStartPlacingBet: boolean) {
        if(isStartPlacingBet){
            this.initComponent().showPlaceYourBetMessage();
        }
    }

    initComponent(){
        const node = this.createNode();
        return node.getComponent(PromptMessageComponent);
    }
}

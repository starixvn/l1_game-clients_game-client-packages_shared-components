import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";
import { WarningCmp } from "./warning-cmp";

const { render } = Observer;

const { Notices, Bet } = gc;
const { ccclass } = _decorator;

@ccclass("WarningContainer")
export class WarningContainer extends NodeContainer {
    protected currentWarningNode: Node = null;
    @render(Notices.NoticeStore, (store) => store.warning, { fireImmediately: false })
    showWarning(warning: gc.Notices.Warning) {
        const node = this.createNode();
        this.currentWarningNode = node;
        const warningCmp = node.getComponent(WarningCmp);
        warningCmp.setData(warning.message);
    }

    @render(Bet.BetStore, (store) => store.isProcessingBet, { fireImmediately: false })
    hideWarning(isProcessingBet: boolean) {
        if (!isProcessingBet && this.currentWarningNode.isValid) {
            this.currentWarningNode.destroyAllChildren();
            this.currentWarningNode = null;
        }
    }
}

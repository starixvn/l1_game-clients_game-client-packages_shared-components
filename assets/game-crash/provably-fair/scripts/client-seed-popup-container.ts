import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { NodeContainer } from "../../../shared/common-components/node-container/node-container";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class ClientSeedPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;
    @render(gc.GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.openClientSeedPopup)
    private renderOpenClientSeedPopup(openClientSeedPopup: boolean) {
        this.nodeOverlay.active = openClientSeedPopup;

        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(gc.GameCrash.ProvablyFair.ProvablyFairHandler, (handle, openCS: boolean) => handle.handleClientSeedPopup(openCS))
    private onClickCloseClientSeedPopup(event) {
        return false;
    }
}

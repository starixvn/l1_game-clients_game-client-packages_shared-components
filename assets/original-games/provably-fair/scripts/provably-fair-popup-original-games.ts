import { _decorator, Node } from "cc";

import gc from "@sg/game-client-base";
import { ProvablyFairPopup } from "db://shared-components/game-crash/provably-fair/scripts/provably-fair-popup";
import Observer from "observer";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { Shared, FormatUtils } = gc;
const { utils } = Shared;

@ccclass()
export class ProvablyFairPopupOriginalGames extends ProvablyFairPopup {
    @property(Node)
    clientSeedsNoDataNode: Node = null;

    updateClientSeedInfo(clientSeeds: gc.GameServiceMessage.SingleClientSeed[]) {
        this.listClientSeedInfo.forEach((clientSeedInfo) => {
            clientSeedInfo.node.active = false;
            clientSeedInfo.activeDisabledBg(true);
        });
        this.clientSeedsNoDataNode.active = !clientSeeds || clientSeeds?.length === 0;
        if (clientSeeds && clientSeeds.length > 0) {
            clientSeeds.forEach((clientSeed, index) => {
                const info = this.listClientSeedInfo[index];
                info.node.active = true;
                info.setDisplay(clientSeed);
                info.activeDisabledBg(false);
            });
        }
    }
}

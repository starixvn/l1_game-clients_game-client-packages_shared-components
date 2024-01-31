import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";

import Observer from "observer";
import EffectAppearanceLabel from "../../../game/md5/scripts/effect-appearance-label";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Rounds, Settlements, Translator } = gc;
@ccclass
export class ServerSeedHash extends ObserverComponent {
    @property(EffectAppearanceLabel)
    sshValue: EffectAppearanceLabel = null;

    @property(Node)
    nodeContentContainer: Node = null;

    @property
    lengthOfMd5 = 21;

    private pf: gc.GameServiceMessage.ProvablyFair = null;

    @render(Rounds.RoundStore, (store) => store.currentServerSeedHash, { fireImmediately: false })
    private renderSSH(currentServerSeedHash: string) {
        this.sshValue.string = currentServerSeedHash;
    }
}

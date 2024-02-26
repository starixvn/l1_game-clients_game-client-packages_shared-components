import gc from "@sg/game-client-base";
import { _decorator } from "cc";

import Observer from "observer";
import EffectAppearanceLabel from "../../../game/md5/scripts/effect-appearance-label";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass
export class ServerSeedHash extends ObserverComponent {
    @property(EffectAppearanceLabel)
    sshValue: EffectAppearanceLabel = null;

    @render(gc.RoundPF.RoundPFStore, (store) => store.currentPF, { fireImmediately: false })
    private renderSSH(currentPF: gc.GameServiceMessage.RoundPFResult) {
        if (currentPF) {
            this.sshValue.string = currentPF.serverSeedHash;
        } else {
            this.sshValue.string = "";
        }
    }
}

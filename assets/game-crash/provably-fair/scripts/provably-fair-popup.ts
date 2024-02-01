import { _decorator } from "cc";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

import gc from "@sg/game-client-base";
import Observer from "observer";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass()
export class ProvablyFairPopup extends ObserverComponent {
    @render(gc.GameCrash.ProvablyFair.PFVerificationStore, (store) => store.verification)
    private renderVerification(verification: gc.GameCrash.ProvablyFair.CrashPFVerfication) {}
}

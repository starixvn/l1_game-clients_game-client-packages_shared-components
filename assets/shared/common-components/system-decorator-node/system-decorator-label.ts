import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { StorageManager, localStorageKeys } = gc;
const { ccclass, property } = _decorator;

const { render, handle } = Observer;

@ccclass("SystemDecoratorLabel")
export class SystemDecoratorLabel extends ObserverComponent {
    label: Label = null;

    private readonly OPERATOR_NAMES = {
        SG: "SABA.games",
        VG: "Vgaming",
        SP: "SABA Play",
        TIP88: "",
    } as const;

    onLoad(): void {
        this.label = this.getComponent(Label);
        super.onLoad();
        this.renderOperatorName();
    }

    renderOperatorName() {
        const operator = StorageManager.get(localStorageKeys?.operator);
        const operatorKey = operator?.toString().toUpperCase();
        console.log("operator", this.OPERATOR_NAMES[operatorKey]);
        this.label.string = this.OPERATOR_NAMES[operatorKey] || "";
    }
}

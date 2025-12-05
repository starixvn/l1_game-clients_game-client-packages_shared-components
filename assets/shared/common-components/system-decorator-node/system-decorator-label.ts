import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "../observer-component/scripts/observer-component";

const { StorageManager, localStorageKeys } = gc;
const { ccclass, property } = _decorator;

@ccclass("SystemDecoratorLabel")
export class SystemDecoratorLabel extends ObserverComponent {
    @property(Node)
    bgNode: Node = null;

    @property
    prefix = "";

    @property
    suffix = "";

    label: Label = null;

    private readonly OPERATOR_NAMES = {
        SG: "SABA.games",
        VG: "Vgaming",
        SP: "SABA Play",
        TIP88: "",
        NOVA88: "Nova88",
        "12BET": "12Bet"
    } as const;

    onLoad(): void {
        this.label = this.getComponent(Label);
        super.onLoad();
        this.renderOperatorName();
    }

    renderOperatorName() {
        const operatorKey = StorageManager.get(localStorageKeys?.operator)?.toString().toUpperCase();
        const operatorName = this.OPERATOR_NAMES[operatorKey] || "";

        if (this.label) {
            this.label.string = `${this.prefix}${operatorName}${this.suffix}`;
        }

        if (this.bgNode) {
            this.bgNode.active = !!operatorName;
        }
    }
}

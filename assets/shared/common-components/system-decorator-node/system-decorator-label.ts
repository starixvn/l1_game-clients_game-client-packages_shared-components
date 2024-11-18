import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

const { render, handle } = Observer;

@ccclass("SystemDecoratorLabel")
export class SystemDecoratorLabel extends ObserverComponent {
    label: Label = null;

    onLoad(): void {
        this.label = this.getComponent(Label);
        super.onLoad();
    }

    @render(gc.Configs.SiteConfigs, (config) => config.systemType)
    renderLabel(systemType: string) {
        this.label.string = systemType === gc.Configs.SystemConfigs.SG.name ? "SABA.games" : "Vgaming";
    }
}

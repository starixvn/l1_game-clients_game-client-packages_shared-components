import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { FairnessSettingsBaccaratPopup } from "./fairness-settings-baccarat-popup";
const { ccclass, property } = _decorator;
const { GameBaccaratX, CutCardPF } = gc;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessSettingsContainer extends ObserverComponent {
    @property(Prefab)
    prfCutCardSetting: Prefab = null;

    @property
    minCSNumber = 300;

    @property
    maxCSNumber = 350;

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoeHash)
    renderNewShoeHash(newShoeHash: GameServiceMessage.NewShoeHash) {
        if (!newShoeHash) {
            return;
        }
        const setting = instantiate(this.prfCutCardSetting);
        const comp = setting.getComponent(FairnessSettingsBaccaratPopup);
        comp.minCSNumber = this.minCSNumber;
        comp.maxCSNumber = this.maxCSNumber;
        this.node.addChild(setting);
    }

    onLoad() {
        super.onLoad();
        this.updateMaxCS();
        this.updateMinCS();
        this.generateRandomCS();
        this.renderNewShoeHash({ hashValue: "abc" });
    }

    @handle(CutCardPF.FairnessHandler, (handler, min: number) => handler.setMinClientSeed(min))
    updateMinCS() {
        return this.minCSNumber;
    }

    @handle(CutCardPF.FairnessHandler, (handler, max: number) => handler.setMaxClientSeed(max))
    updateMaxCS() {
        return this.maxCSNumber;
    }

    @handle(CutCardPF.FairnessHandler, (handler) => handler.generateClientSeed())
    generateRandomCS() {}
}

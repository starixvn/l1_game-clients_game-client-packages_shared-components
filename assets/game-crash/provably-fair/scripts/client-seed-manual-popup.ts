import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { GameCrash } = gc;
const { render, handle } = Observer;

@ccclass
export class ClientSeedManualPopup extends ObserverComponent {
    @property(Label)
    lblClientSeed: Label = null;

    @property(Node)
    nodeSaveDisabled: Node = null;

    private readonly CLIENT_SEED_CHAR = 4;

    closePopup() {
        this.node.destroy();
    }

    setClientSeedValue(value: string) {
        this.lblClientSeed.string = value;
    }

    getClientSeed() {
        return this.lblClientSeed.string;
    }

    addValue(event, value) {
        const clientSeed = this.lblClientSeed.string;
        let newValue = `${clientSeed}`;
        if (clientSeed.length < this.CLIENT_SEED_CHAR) {
            newValue = `${clientSeed}${value}`;
        }
        this.lblClientSeed.string = newValue;
        if (this.lblClientSeed.string !== "") {
            this.nodeSaveDisabled.active = false;
        }
    }

    clear() {
        this.lblClientSeed.string = "";
        this.nodeSaveDisabled.active = true;
    }

    removeLastLetter() {
        let multiplierString = this.lblClientSeed.string.slice(0, -1);
        if (!multiplierString) {
            multiplierString = "0";
        }

        this.lblClientSeed.string = multiplierString;
    }

    clickSaveBtn() {
        this.updateClientSeedValue();
        this.closePopup();
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, value: string) => handle.saveManualClientSeed(value))
    updateClientSeedValue() {
        return this.lblClientSeed.string;
    }
}

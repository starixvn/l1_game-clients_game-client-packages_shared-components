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

    private clientSeedForManualForm = "";

    closePopup() {
        this.updateClientSeedValue(this.clientSeedForManualForm);
        this.node.destroy();
    }

    @render(GameCrash.ProvablyFair.ProvablyFairStore, (store) => store.clientSeedForManualForm)
    setClientSeedValue(value: string) {
        this.lblClientSeed.string = value;
        this.clientSeedForManualForm = value;
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
            multiplierString = "";
            this.nodeSaveDisabled.active = true;
        }

        this.lblClientSeed.string = multiplierString;
    }

    clickSaveBtn() {
        this.updateClientSeedValue(this.lblClientSeed.string);
        this.closePopup();
    }

    @handle(GameCrash.ProvablyFair.ProvablyFairHandler, (handle, value: string) => handle.saveManualClientSeed(value))
    updateClientSeedValue(value: string) {
        return value;
    }
}

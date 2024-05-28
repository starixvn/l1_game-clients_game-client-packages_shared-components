import gc from "@sg/game-client-base";
import { Component, Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { settings } from "../../../../../../assets/game/scripts/game-settings";
import { ClientSeedManualBaccaratPopup } from "./client-seed-manual-baccarat-popup";
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX } = gc;
const { render, handle, observer } = Observer;

@ccclass
@observer(settings.name)
export class FairnessSettingsBaccaratPopup extends Component {
    @property(Label)
    lblClientSeed: Label = null;

    @property(Label)
    lblSHA256: Label = null;

    @property(Prefab)
    prfManualSettings: Prefab = null;

    @property(Node)
    nodeManualSettings: Node = null;

    @property(Label)
    lblCountDown: Label = null;

    @property(Prefab)
    prfWaitingScreen: Prefab = null;

    @property
    timer = 10;

    onLoad() {
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopup, this);
        this.renderCountDown();
    }

    showPopup() {
        const manual = instantiate(this.prfManualSettings);
        const comp = manual.getComponent(ClientSeedManualBaccaratPopup);
        this.nodeManualSettings.addChild(manual);
        comp.setClientSeedValue(this.lblClientSeed.string);
    }

    renderCountDown() {
        const interval = setInterval(() => {
            this.lblCountDown && (this.lblCountDown.string = this.timer.toString());
            this.timer--;
            if (this.timer < 0) {
                clearInterval(interval);
                this.node.active = false;
            }
        }, 1000);
    }

    @handle(CutCardPF.FairnessHandler, (handler, clientSeed: string) => handler.handle(clientSeed))
    onClickSubmit() {
        return this.lblClientSeed.string;
    }

    @render(CutCardPF.FairnessStore, (store) => store.clientSeed)
    renderClientSeed(clientSeed: string) {
        this.lblClientSeed.string = clientSeed;
    }

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.newShoeHash)
    renderSHA256(sha256: string) {
        this.lblSHA256.string = sha256;
    }
}

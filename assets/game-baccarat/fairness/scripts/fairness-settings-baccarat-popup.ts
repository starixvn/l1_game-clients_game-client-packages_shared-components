import gc from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ClientSeedManualBaccaratPopup } from "./client-seed-manual-baccarat-popup";
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX } = gc;
const { render, handle, observer } = Observer;

@ccclass
export class FairnessSettingsBaccaratPopup extends ObserverComponent {
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

    minCSNumber = 0;
    maxCSNumber = 0;
    @property
    timer = 10;

    onLoad() {
        super.onLoad();
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopup, this);
        this.renderCountDown();
    }

    showPopup() {
        const manual = instantiate(this.prfManualSettings);
        const comp = manual.getComponent(ClientSeedManualBaccaratPopup);
        comp.minClientSeed = this.minCSNumber;
        comp.maxClientSeed = this.maxCSNumber;
        comp.renderRangeCS();
        this.nodeManualSettings.addChild(manual);
        comp.setClientSeedValue(this.lblClientSeed.string);
    }

    renderCountDown() {
        const interval = setInterval(() => {
            this.lblCountDown && (this.lblCountDown.string = this.timer.toString());
            this.timer--;
            if (this.timer < 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    @render(CutCardPF.CutCardStore, (store) => store.cutCardInfo)
    hidePopup(cutCardInfo: any) {
        if (!cutCardInfo) {
            return;
        }
        cutCardInfo.successful && (this.node.active = false);
    }

    @handle(CutCardPF.CutCardHandler, (handler, clientSeed: string) => handler.handle(clientSeed))
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

    @render(GameBaccaratX.Shoe.ShoeStore, (store) => store.shoeInfo)
    hideNode(shoeInfo: any) {
        if (shoeInfo) {
            this.node.active = false;
        }
    }
}

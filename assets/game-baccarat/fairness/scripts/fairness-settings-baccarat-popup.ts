import gc from "@sg/game-client-base";
import { Color, Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ClientSeedManualBaccaratPopup } from "./client-seed-manual-baccarat-popup";
const { ccclass, property } = _decorator;
const { CutCardPF, GameBaccaratX, Rounds } = gc;
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

    @property(Label)
    lblMessageSubmit: Label = null;

    @property(Node)
    nodeDisabledSubmit: Node = null;

    @property
    minCSNumber = 300;

    @property
    maxCSNumber = 350;

    private timer = 30;
    private interval;

    onLoad() {
        super.onLoad();
        this.updateMaxCS();
        this.updateMinCS();
        this.generateRandomCS();
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopupManual, this);
        this.renderCountDown();
    }

    onDestroy() {
        this.interval && clearInterval(this.interval);
        super.onDestroy();
    }

    @handle(CutCardPF.FairnessHandler, (handle, isShow: boolean) => handle.updateDontShowAgain(isShow))
    openFairnessSetting() {
        return true;
    }

    showPopupManual() {
        const manual = instantiate(this.prfManualSettings);
        const comp = manual.getComponent(ClientSeedManualBaccaratPopup);
        comp.minClientSeed = this.minCSNumber;
        comp.maxClientSeed = this.maxCSNumber;
        comp.renderRangeCS();
        this.nodeManualSettings.addChild(manual);
        comp.setClientSeedValue(this.lblClientSeed.string);
    }

    @render(CutCardPF.CutCardStore, (store) => store.cutCardInfo)
    updateMessageSubmit(cutCardInfo: any) {
        const color: Color = new Color(0, 0, 0, 255);
        if (!cutCardInfo) {
            return;
        }
        console.log("updateMessageSubmit", cutCardInfo);
        if (cutCardInfo.successful) {
            this.lblMessageSubmit.string = "Submission Successful";
            this.nodeDisabledSubmit.active = true;
            this.lblMessageSubmit.color = Color.fromHEX(color, "#06681D");
        } else {
            this.lblMessageSubmit.string = "Submission fails, please try again";
            this.nodeDisabledSubmit.active = false;
            this.lblMessageSubmit.color = Color.fromHEX(color, "#B82222");
        }
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

    @handle(CutCardPF.FairnessHandler, (handle, isShow: boolean) => handle.updateDontShowAgain(isShow))
    onClickDontShowAgain() {
        return true;
    }

    private renderCountDown() {
        this.interval = setInterval(() => {
            this.lblCountDown && (this.lblCountDown.string = this.timer.toString());
            this.timer--;
            if (this.timer < 0) {
                this.closePopup();
                clearInterval(this.interval);
            }
        }, 1000);
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

    @handle(CutCardPF.FairnessHandler, (handler, isShow: boolean) => handler.handleShowFairnessSettingsPopup(isShow))
    closePopup() {
        return false;
    }
}

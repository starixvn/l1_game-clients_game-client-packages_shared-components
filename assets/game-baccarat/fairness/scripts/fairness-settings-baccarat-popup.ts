import gc from "@sg/game-client-base";
import { Color, Label, Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { settings } from "../../../../../../assets/game/scripts/game-settings";
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

    minCSNumber = 0;
    maxCSNumber = 0;

    onLoad() {
        super.onLoad();
        this.lblClientSeed.node?.on(Node.EventType.TOUCH_START, this.showPopup, this);
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

    @render(CutCardPF.CutCardStore, (store) => store.cutCardInfo)
    updateMessageSubmit(cutCardInfo: any) {
        if (!cutCardInfo) {
            return;
        }
        if (cutCardInfo.sucessful) {
            this.lblMessageSubmit.string = "Submission Successful";
            this.lblMessageSubmit.color = Color.WHITE.fromHEX("#06681D");
        } else {
            this.lblMessageSubmit.string = "Submission fails, please try again";
            this.nodeDisabledSubmit.active = true;
            this.lblMessageSubmit.color = Color.WHITE.fromHEX("B82222");
        }
    }

    @handle(CutCardPF.CutCardHandler, (handler, clientSeed: string) => handler.handle(clientSeed))
    onClickSubmit() {
        this.nodeDisabledSubmit.active = false;
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

    @handle(CutCardPF.FairnessHandler, (handle, isShow: boolean) => handle.handleShowFairnessSettingsPopup(isShow))
    onClickDontShowAgain() {
        return false;
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    renderCountDown(remaining: number) {
        const countDown = settings.durations.wholeShoe - remaining;
        this.lblCountDown.string = countDown < 9 ? countDown.toString() : "";
    }
}

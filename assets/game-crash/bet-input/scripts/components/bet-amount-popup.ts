import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { PopupsHandlers } from "../../../popups/popups-handlers";
import { BetInputHandler } from "../handlers/bet-input-handlers";
import { BetInputStore } from "../stores/bet-input-store";
import { BetAmountItem } from "./bet-amount-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopup extends ObserverComponent {
    @property(Node)
    nodeBetContainer: Node = null;

    @property(Prefab)
    prfBetAmount: Prefab = null;

    @property(Label)
    lblBetAmount: Label = null;

    @property(Label)
    lblBetRange: Label = null;

    @property(Button)
    btnConfirm: Button = null;

    private readonly chipsLimit = 8;

    @render(gc.GameConfigs.GameConfigStore, (store) => store.chips)
    private initBetAmount(chips) {
        this.nodeBetContainer.destroyAllChildren();
        chips = chips.slice(0, this.chipsLimit);
        chips.forEach((chip) => {
            const node = instantiate(this.prfBetAmount);
            const comp = node.getComponent(BetAmountItem);
            comp?.setBetAmountItem(chip);
            this.nodeBetContainer.addChild(node);
        });
    }

    @render(gc.Rounds.RoundStore, (store) => ({
        minBet: store.minBet,
        maxBet: store.maxBet,
    }))
    private updateBetRange({ minBet, maxBet }) {
        this.lblBetRange.string = `${minBet} - ${maxBet}`;
    }

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private setBetAmountPopupVisibilty(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    @handle(PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutBetInput())
    closeOtherPopups() {}

    @render(BetInputStore, (store) => store.betAmountTemp)
    private updateBetAmount(amount: number) {
        this.lblBetAmount.string = `${amount}`;
        this.checkConfirmBtnStatus(amount > 0);
    }

    @handle(BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onCloseClick() {}

    @handle(BetInputHandler)
    private onConfirmClick() {}

    @handle(BetInputHandler, (handler) => handler.resetBetAmount())
    private onClearClick() {}

    private checkConfirmBtnStatus(status: boolean) {
        this.btnConfirm.interactable = status;
        this.btnConfirm.node.getChildByName("overlay").active = !status;
    }
}

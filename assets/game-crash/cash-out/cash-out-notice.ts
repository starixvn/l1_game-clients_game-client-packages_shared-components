import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

const { GameCrash, Rounds, FormatUtils, Translator } = gc;

@ccclass
export class CashOutNotice extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    @property(Label)
    lblReachMaxWin: Label = null;

    @property({ type: Node })
    othersNoticeNode: Node[] = [];

    onLoad(): void {
        super.onLoad();
        this.node.active = false;
    }

    @render(GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    updateCashoutNotice(cashOutNotice: any) {
        this.updateCashOutAmount(cashOutNotice);
        this.lblReachMaxWin.string = `(${Translator.gameTranslate("total_cashout_amount_reach_max")})`;
        this.lblReachMaxWin.node.active = cashOutNotice?.reachMaxWin;
        this.showNotice(true);
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            ComponentUtils.hideOtherNotices(this.othersNoticeNode);
            ComponentUtils.autoDisappear(this.node, false);
            setTimeout(() => {
                this.setDisplayNotice(true);
            }, 3000);
        } else {
            this.node.active = false;
        }
    }

    updateCashOutAmount(cashOutNotice: any) {
        const win = cashOutNotice?.reachMaxWin ? cashOutNotice.win : cashOutNotice.cashOutWin;
        this.lblCashOut.string = FormatUtils.numberWithCommas(win, 2);
    }

    @handle(GameCrash.PlayerActions.PlayerActionHandlers, (handle, flag: boolean) => handle.handleEndShowCashOutNotice(flag))
    setDisplayNotice(flag: boolean) {
        return flag;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    hideNotice(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.setDisplayNotice(false);
        }
    }
}

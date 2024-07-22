import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { WarningCmp } from "../shared/common-components/notice/scripts/warning-cmp";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class CutCardInfoNotice extends ObserverComponent {
    @property(Prefab)
    prfWarning: Prefab = null;

    addNotice() {
        if (!this.prfWarning) {
            return null;
        }
        const node = instantiate(this.prfWarning);
        this.node.addChild(node);
        const warning = node.getComponent(WarningCmp);
        warning.setData(gc.Translator.gameTranslate("submission_failed_time_expired"));
    }

    @render(gc.GameBaccaratX.CutCardPF.FairnessStore, (store) => store.showNoticeCutCardFailed)
    renderTotalWin(showNoticeCutCardMessage: boolean) {
        showNoticeCutCardMessage && this.addNotice();
    }
}

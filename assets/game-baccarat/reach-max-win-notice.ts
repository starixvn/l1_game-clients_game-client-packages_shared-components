import gc from "@sg/game-client-base";
import { _decorator, instantiate, Prefab } from "cc";
import Observer from "observer";
import { WarningCmp } from "../shared/common-components/notice/scripts/warning-cmp";
import { ObserverComponent } from "../shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass
export class ReachMaxWinNotice extends ObserverComponent {
    @property(Prefab)
    prfWarning: Prefab = null;

    winAmount = 0;

    addNotice() {
        if (!this.prfWarning) {
            return null;
        }
        const node = instantiate(this.prfWarning);
        this.node.addChild(node);
        const warning = node.getComponent(WarningCmp);
        warning.setData(`(${gc.Translator.commonTranslate("you_reach_max_win")})`);
    }

    @render(gc.Settlements.SettlementStatusStore, (store) => store.eventData)
    renderTotalWin(eventData: any) {
        if (eventData && eventData.event === gc.Settlements.SettlementAction.TOTAL_WIN) {
            this.addNotice();
        }
    }
}

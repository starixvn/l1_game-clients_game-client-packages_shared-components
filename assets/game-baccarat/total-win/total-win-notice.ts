import { _decorator, Component, instantiate, Prefab, tween } from "cc";
import { TotalWin } from "./total-win";
const { ccclass, property } = _decorator;

@ccclass
export class TotalWinNotice extends Component {
    @property(Prefab)
    prfTotalWin: Prefab = null;

    winAmount = 0;

    addNotice() {
        const node = instantiate(this.prfTotalWin);
        const totalWin = node.getComponent(TotalWin);
        totalWin.renderNotice(this.winAmount);
        this.node.addChild(node);
        tween(node).delay(3).destroySelf().start();
    }
}

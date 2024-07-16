import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("total_win")
export class TotalWin extends Component {
    @property(Label)
    lblReachMaxWin: Label = null;

    @property(Label)
    lblWinAmount: Label = null;

    renderNotice(winAmount: number) {
        this.lblReachMaxWin.string = `(${gc.Translator.commonTranslate("you_reach_max_win")})`;
        this.lblWinAmount.string = winAmount.toString();
    }
}

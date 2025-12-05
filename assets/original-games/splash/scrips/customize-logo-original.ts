import { _decorator, Component, Node } from "cc";
import { OperatorAlias, OperatorUtils } from "db://shared-components/shared/utils/operator-utils";
const { ccclass, property } = _decorator;


@ccclass
export class CustomizeLogoOriginal extends Component {
    @property(Node)
    nodeLogoNova88: Node = null;

    @property(Node)
    nodeLogo12Bet: Node = null;


    onLoad() {
        const operator = OperatorUtils.getOperatorAlias();
        this.showLogo(operator);
    }

    private showLogo(operator: string) {
        this.nodeLogoNova88.active = false;
        this.nodeLogo12Bet.active = false;

        switch (operator) {
            case OperatorAlias.NOVA88:
                this.nodeLogoNova88.active = true;
                break;

            case OperatorAlias._12BET:
                this.nodeLogo12Bet.active = true;
                break;

            default:
                this.nodeLogoNova88.active = true;
                break;
        }
    }
}

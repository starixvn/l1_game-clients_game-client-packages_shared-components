import { _decorator, Component } from 'cc';
import { OperatorAlias, OperatorUtils } from '../../utils/operator-utils';
const { ccclass, property } = _decorator;

@ccclass('CertGamingLabs')
export class CertGamingLabs extends Component {
    onLoad() {
        const operator = OperatorUtils.getOperatorAlias();
        this.node.active = operator === OperatorAlias.SP;
    }
}



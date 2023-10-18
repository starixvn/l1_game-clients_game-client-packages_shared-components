import { Node, _decorator } from "cc";
import { BalanceContainer } from "../../../../../game/balance-effect/scripts/components/balance-effect";

const { ccclass } = _decorator;

@ccclass()
export class BalanceContainerInstant extends BalanceContainer {
    protected fontSize = 40;
    updateBalanceEffect(parent: Node, balance: number): void {
        super.updateBalanceEffect(parent, balance);
    }
}

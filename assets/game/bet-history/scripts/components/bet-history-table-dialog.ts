import { _decorator, Node, Prefab, ScrollView } from "cc";
import { Dialog } from "../../../../shared/common-components/dialogs/dialog";
const { ccclass, property } = _decorator;

@ccclass()
export class BetHistoryTableDialog extends Dialog {
    @property(Node)
    closedButton: Node = null;

    @property(Node)
    mainBackground: Node = null;

    @property(Node)
    table: Node = null;

    @property(Node)
    tableContent: Node = null;

    @property(Prefab)
    tablePrefab: Prefab = null;

    @property(Node)
    pagination: Node = null;

    @property(ScrollView)
    scrollView: ScrollView = null;

    onClosed() {
        this.hide();
    }
}

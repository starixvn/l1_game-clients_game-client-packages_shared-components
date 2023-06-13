import { _decorator, Node, Prefab, ScrollView, UITransform, Widget } from "cc";
import { Dialog } from "../../../../shared/common-components/dialogs/dialog";
const { ccclass, property } = _decorator;

@ccclass()
export class BetHistoryTable extends Dialog {
    @property(Node)
    closedButton: Node = null;

    @property(Node)
    mainBackground: Node = null;

    @property(Node)
    table: Node = null;

    @property(Node)
    header: Node = null;

    @property(Node)
    body: Node = null;

    @property(Node)
    pagination: Node = null;

    @property(Prefab)
    headerPrefab: Prefab = null;

    @property(Prefab)
    bodyPrefab: Prefab = null;

    @property(ScrollView)
    scrollView: ScrollView = null;

    protected start(): void {
        this.table.getComponent(UITransform).width = 1300;
        this.mainBackground.getComponent(UITransform).width = 750;

        const widget = this.closedButton.getComponent(Widget);
        widget!.right = widget!.right - 75;
    }

    onClosed() {
        this.hide();
    }
}

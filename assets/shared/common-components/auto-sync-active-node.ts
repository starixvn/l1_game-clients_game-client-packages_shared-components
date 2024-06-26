import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class AutoSyncActiveNode extends Component {
    @property(Node)
    target: Node = null;

    update() {
        this.syncActive();
    }

    syncActive() {
        this.node.active = this.target.activeInHierarchy;
    }
}

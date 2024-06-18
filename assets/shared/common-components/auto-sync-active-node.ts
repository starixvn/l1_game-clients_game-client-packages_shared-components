import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class AutoSyncActiveNode extends Component {
    @property(Node)
    target: Node = null;

    onLoad() {
        this.target?.on(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED, this.syncActive, this);
        this.syncActive();
    }

    syncActive() {
        this.node.active = this.target.activeInHierarchy;
    }
}

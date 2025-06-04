import { _decorator, Component, Node } from "cc";
import { NodeAddedEvent } from "db://shared-components/shared/common-components/node-container/node-container";
const { ccclass, property } = _decorator;

@ccclass("LoadingScoreboard")
export class LoadingNode extends Component {
    @property(Node)
    nodeContainer: Node = null;

    onLoad() {
        this.nodeContainer?.on(NodeAddedEvent, this.onNodeEvent, this);
    }

    private onNodeEvent(node: Node) {
        if (node) {
            this.node.active = false;
        }
    }
}

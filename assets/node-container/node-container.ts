import { _decorator, Component, instantiate, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("NodeContainer")
export class NodeContainer extends Component {
    @property(Prefab)
    prefab: Prefab = null;

    createNode() {
        if (!this.prefab) {
            return null;
        }
        const node = instantiate(this.prefab);
        this.node.addChild(node);
        return node;
    }
}

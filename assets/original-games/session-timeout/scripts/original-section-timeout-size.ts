import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { FunctionUtils } from 'db://shared-components/shared/utils/function-utils';
const { ccclass, property } = _decorator;

@ccclass('OriginalSectionTimeoutSize')
export class OriginalSectionTimeoutSize extends Component {
    @property(Prefab)
    prefabViewPortrait: Prefab = null;

    @property(Prefab)
    prefabViewLandscape: Prefab = null;

    private viewNode: Node = null;

    get prefabView(): Prefab {
        return FunctionUtils.isPortraitMode()
            ? this.prefabViewPortrait
            : this.prefabViewLandscape;
    }

    start() {
        if (this.viewNode) {
            this.viewNode.destroy();
            this.viewNode = null;
        }

        if (this.prefabView) {
            this.viewNode = instantiate(this.prefabView);
            this.node.addChild(this.viewNode);
        }
    }
}

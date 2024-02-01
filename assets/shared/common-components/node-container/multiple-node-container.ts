import { Node, Prefab, _decorator, instantiate } from "cc";
import { Dialog } from "../dialogs/dialog";
import { ObserverComponent } from "../observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;

@ccclass("PrefabItem")
class PrefabItem {
    @property
    name = "";

    @property(Prefab)
    prefab: Prefab = null;
}

@ccclass("MultipleNodeContainer")
export class MultipleNodeContainer extends ObserverComponent {
    @property({ type: PrefabItem })
    prefabItems: PrefabItem[] = [];

    @property(Node)
    nodeOverlay: Node = null;

    protected visibleNodes: { [nodeName: string]: Node } = {};

    isNodeVisible(name: string): boolean {
        return !!this.visibleNodes[name];
    }

    clearNode(name: string) {
        this.displayOverlay(false);
        const node = this.visibleNodes[name];
        if (node) {
            const dialog = node.getComponent(Dialog);
            if (dialog) {
                dialog.hide();
            } else {
                node.destroy();
            }
            delete this.visibleNodes[name];
        }
    }

    showNode(name: string) {
        this.displayOverlay(true);

        if (this.isNodeVisible(name)) {
            return;
        }

        const node = this.createNode(name);
        this.visibleNodes[name] = node;
    }

    displayOverlay(show: boolean) {
        if (this.nodeOverlay) {
            this.nodeOverlay.active = show;
        }
    }

    getPrefab(name: string) {
        return this.prefabItems.find((item) => item.name === name)?.prefab;
    }

    createNode(name: string) {
        const prefab = this.getPrefab(name);
        if (!prefab) {
            return null;
        }
        const node = instantiate(prefab);
        node.name = name;
        this.node.addChild(node);
        return node;
    }

    onClickOverlay() {
        this.displayOverlay(false);
    }
}

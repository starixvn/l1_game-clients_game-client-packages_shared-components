import { Component, Layout, Node, _decorator, macro } from "cc";
import { GameUtils } from "../../utils";
import { StaticNode } from "./static-node";
const { ccclass, property } = _decorator;

@ccclass("StaticGroup")
export class StaticGroup extends Component {
    @property({ type: Node })
    contents: Node[] = [];

    @property(Node)
    container: Node = null;

    @property
    groupId = 0;

    @property({ type: Node })
    dynamicRootNodes: Node[] = [];

    private initialized = false;

    onLoad() {
        this.dynamicRootNodes.forEach((node) =>
            node.on(Node.EventType.TRANSFORM_CHANGED, () => {
                this.container.getComponentsInChildren(StaticNode).forEach((node) => node.node.active && node.updatePosition());
            })
        );
    }

    lateUpdate() {
        this.initForContents();
    }

    initForContents() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.schedule(this.scheduleMoveNodeToContainer, 0.1, macro.REPEAT_FOREVER);
    }

    scheduleMoveNodeToContainer() {
        this.contents.forEach((child) => {
            this.moveNodeToContainer(child, this.container);
        });
    }

    moveNodeToContainer(content: Node, container: Node) {
        content.getComponent(Layout)?.updateLayout();
        const staticNodes = content.getComponentsInChildren(StaticNode).filter((node) => node.groupId === this.groupId);
        staticNodes.forEach((staticNode) => {
            staticNode.init();
            GameUtils.moveToOtherNode(staticNode.node, container);
        });
    }
}

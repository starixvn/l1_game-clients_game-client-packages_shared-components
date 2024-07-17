import { _decorator, Component, Node, UITransform, v3 } from "cc";
import { ComponentUtils } from "../../utils";
import { ChipStackSetting } from "./chip-stack-setting";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("ChipStack")
export class ChipStack extends Component {
    @property(ChipStackSetting)
    setting: ChipStackSetting = null;

    _stacks: Node[] = [];
    content: Node = null;

    flyingNodeId: string[] = [];
    chipOrder = "";

    onLoad() {
        this.content = new Node("content");
        this.content.addComponent(UITransform);
        this.node.addChild(this.content);
    }

    get currentStack() {
        if (this._stacks.length === 0) {
            this.splitStack();
        }
        return this._stacks[0];
    }

    get highestY() {
        return this.currentStack.children.length * this.setting.chipThickness;
    }

    async throwChip(node: Node, chipValue: number): Promise<boolean> {
        ComponentUtils.moveToOtherNode(node, this.currentStack);
        this.flyingNodeId.push(node.uuid);
        this.chipOrder += `,${chipValue}`;
        await this.flyingChip(node);
        try {
            return this.onEndFlying(node.uuid);
        } catch (e) {
            return false;
        }
    }

    placeChip(node: Node) {
        if (this.currentStack.children.length === this.setting.maxChipCount) {
            this.splitStack();
        }
        ComponentUtils.moveToOtherNode(node, this.currentStack);
        node.position = v3(0, this.highestY);
    }

    placeChips(nodes: Node[], chipOrder: string) {
        this.clearChips();
        this.chipOrder = chipOrder;
        nodes.forEach((node) => {
            this.placeChip(node);
        });
    }

    clearChips() {
        this.content.children.forEach((child) => child.destroy());
        this.content.removeAllChildren();
        this.flyingNodeId = [];
        this._stacks = [];
        this.chipOrder = "";
    }

    private flyingChip(node: Node) {
        return new Promise<void>((resolve) => {
            const destPosition = v3(0, this.highestY);
            const currentPosition = v3(node.position);
            const distance = currentPosition.subtract(destPosition).length();
            const tempDuration = (0.3 * distance) / 200;
            const duration = Math.min(0.3, tempDuration);
            node.qtJumpPosition(destPosition, 80, 1, duration, { easing: "sineOut" })
                .call(() => resolve())
                .start();
        });
    }

    onEndFlying(idNode: string) {
        const index = this.flyingNodeId.findIndex((id) => idNode === id);
        this.flyingNodeId.splice(index, 1);

        return this.isNoFlyingChip;
    }

    get isNoFlyingChip() {
        return this.flyingNodeId.length === 0;
    }

    splitStack() {
        console.log("splitStack");
        const stack = new Node("stack");
        stack.addComponent(UITransform);
        this.content.addChild(stack);
        this._stacks.unshift(stack);

        this.alignChipStacks();
    }

    alignChipStacks() {
        const spacing = 20;
        this.content.children.forEach((child, index) => {
            console.log("align ------------------------- ", index);
            child.position = v3(index * spacing, 0, 0);
        });
    }
}

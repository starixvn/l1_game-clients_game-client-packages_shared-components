import { Node, UITransform, v3 } from "cc";

export namespace GameUtils {
    export const moveToOtherNode = (node: Node, destNode: Node) => {
        const position = destNode
            .getComponent(UITransform)
            .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
        node.parent = destNode;
        node.position = position;
    };
}

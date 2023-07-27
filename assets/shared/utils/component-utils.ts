import { Label, Node, UITransform, v3 } from "cc";

export namespace ComponentUtils {
    export const moveToOtherNode = (node: Node, destNode: Node) => {
        const position = destNode
            .getComponent(UITransform)
            .convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)));
        node.parent = destNode;
        node.position = position;
    };

    export const firstLoadEmptyLabel = (labels: Label[]) => {
        labels?.forEach((label) => {
            if (label) {
                label.string = "";
                label.cacheMode = Label.CacheMode.CHAR;
            }
        });
    };
}

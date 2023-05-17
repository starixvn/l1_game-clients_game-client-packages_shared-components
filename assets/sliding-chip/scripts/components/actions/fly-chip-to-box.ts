import { Node, UITransform, Vec3, tween, v3 } from "cc";
import { random } from "lodash-es";
import SlidingChip from "../sliding-chip";

const loginUserChipFlyingTime = 0.5;
const chipFlyingTime = 0.8;

export const placeChipToChipBox = (slidingChip: SlidingChip, bet: number, destNode: Node, startNode: Node, onComplete: () => void) => {
    // Audio Chip Fly
    if (slidingChip) {
        const isLoginUserPlaceBet = startNode == null;
        const flyingDuration = isLoginUserPlaceBet ? loginUserChipFlyingTime : chipFlyingTime;
        const chipPosition = destNode
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(slidingChip.createStartNodeInfo(startNode, bet).worldPos);
        const chipNode = slidingChip.createSmallChip(bet);
        chipNode.position = chipPosition;
        const randomPosition = getRandomPositionChip(chipNode, destNode);
        destNode?.addChild(chipNode);

        if (!chipNode.activeInHierarchy) {
            chipNode.position = randomPosition;
        } else {
            chipNode && moveChipTo(chipNode, randomPosition, flyingDuration, onComplete);
        }
    }
};

export const getRandomPositionChip = (chip: Node, box: Node): Vec3 => {
    if (chip && box) {
        const chipBoundingBox = chip.getComponent(UITransform).getBoundingBox();
        const xDest = random(
            Math.floor(chip.getComponent(UITransform).width / 4),
            Math.floor(box.getComponent(UITransform).width - chipBoundingBox.width / 2) + 1
        );
        const yDest = random(
            Math.floor(chip.getComponent(UITransform).height / 4),
            Math.floor(box.getComponent(UITransform).height - chipBoundingBox.height / 2) + 1
        );
        return v3(xDest, yDest);
    }

    return v3(0, 0);
};

export const moveChipTo = (chipNode: Node, randomPosition: Vec3, flyingDuration: number, onComplete?: () => void) => {
    tween(chipNode)
        .to(flyingDuration, { position: v3(randomPosition.x, randomPosition.y, 0) }, { easing: "sineOut" })
        .call(() => {
            onComplete && onComplete();
        })
        .start();
};

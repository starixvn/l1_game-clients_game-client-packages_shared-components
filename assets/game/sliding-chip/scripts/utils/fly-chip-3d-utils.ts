import { Node, Vec3 } from "cc";
import { NewChip } from "../components/new-chip";
import SlidingChip from "../components/sliding-chip";
export namespace FlyChip3DUtils {
    export const mergeAndStackChips = (container: Node, totalAmount: number, slidingChip: SlidingChip, offsetStack = 7) => {
        if (!container || !slidingChip) {
            return;
        }
        let numberOfChip = 0;
        while (totalAmount > 0) {
            const index = slidingChip.chipValues.findIndex((chipValue) => chipValue > +totalAmount);
            let chipNode: Node = null;
            let value = 0;
            if (index === 0) {
                value = totalAmount;
            } else {
                value = slidingChip.chipValues[index - 1];
            }
            chipNode = slidingChip.createChip3D(value);
            totalAmount -= value;
            numberOfChip++;
            const destPosition = new Vec3(0, 0, 0);
            if (numberOfChip === 1) {
                chipNode.getComponent(NewChip).firstChipShadow.active = true;
            }
            if (numberOfChip > 1) {
                const destY = (numberOfChip - 1) * offsetStack;
                destPosition.set(destPosition.x, destPosition.y + destY, destPosition.z);
            }
            chipNode.setPosition(destPosition);
            container.addChild(chipNode);
        }
    };

    export const createChipStack = (totalAmount: number, slidingChip: SlidingChip, offsetStack = 7) => {
        if (!slidingChip) {
            return;
        }
        let numberOfChip = 0;
        const container = new Node();
        while (totalAmount > 0) {
            const index = slidingChip.chipValues.findIndex((chipValue) => chipValue > +totalAmount);
            let chipNode: Node = null;
            let value = 0;
            if (index === 0) {
                value = totalAmount;
            } else {
                value = slidingChip.chipValues[index - 1];
            }
            chipNode = slidingChip.createChip3D(value);
            totalAmount -= value;
            numberOfChip++;
            const destPosition = new Vec3(0, 0, 0);
            if (numberOfChip === 1) {
                chipNode.getComponent(NewChip).firstChipShadow.active = true;
            }
            if (numberOfChip > 1) {
                const destY = (numberOfChip - 1) * offsetStack;
                destPosition.set(destPosition.x, destPosition.y + destY, destPosition.z);
            }
            chipNode.setPosition(destPosition);
            container.addChild(chipNode);
        }
        return container;
    };
}

import gc from "@sg/game-client-base";
import { Node, UITransform } from "cc";
import { IMainPlayerChip } from "../../../../chip-flying/scripts/components/chip-flying";
import { FlyChipUtils } from "../../utils/fly-chip-utils";
import SlidingChip from "../sliding-chip";

type TChips = {
    [value: number]: number;
};

export const placeChipToChipBox = (slidingChip: SlidingChip, mainPlayerChip: IMainPlayerChip, startNode: Node, onComplete: () => void) => {
    const { chipBox, chipValue } = mainPlayerChip;
    if (slidingChip && chipValue > 0) {
        const flyingDuration = startNode == null ? SlidingChip.mainPlayerChipFlyingTime : SlidingChip.chipFlyingTime;
        const chipPosition = chipBox
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(slidingChip.createStartNodeInfo(startNode, chipValue).worldPos);
        const chipNode = slidingChip.createSmallChip(chipValue);
        chipNode.position = chipPosition;
        const randomPosition = FlyChipUtils.getRandomPositionChip(chipNode, chipBox);
        chipBox?.addChild(chipNode);

        if (!chipNode.activeInHierarchy) {
            chipNode.position = randomPosition;
        } else {
            chipNode && FlyChipUtils.moveChipTo(chipNode, randomPosition, flyingDuration, onComplete);
        }
    }
};

export const addChipsToChipBoxWhenJoinRoom = (chipBox: Node, chipGroup: gc.Chips.IChipGroup, slidingChip: SlidingChip) => {
    if (!chipGroup) {
        return;
    }

    const chipValues = Object.keys(chipGroup);
    chipValues.forEach((chipValue) => {
        const chipCountOfBet = chipGroup[chipValue];
        const convertValues = getChipQuantity(+chipValue, slidingChip.chipValues);
        for (let i = 0; i < chipCountOfBet; i++) {
            addChipsByChipsData(slidingChip, convertValues, chipBox);
        }
    });
};

export const getChipQuantity = (bet: number, options: number[]): TChips => {
    const list = [...options].reverse();
    const chipValue = calculateChipValue(list, bet);
    const chips = chipValue.chips;

    if (chipValue.chipTotal > 0) {
        chips[0] = 1;
    }

    return chips;
};

const calculateChipValue = (list: number[], total: number) => {
    const chips = {};
    let chipTotal = total;
    list.forEach((value) => {
        const count = Math.floor(chipTotal / value);
        chips[value] = count;
        chipTotal = chipTotal % value;
    });

    return { chips, chipTotal };
};

const addChipsByChipsData = (slidingChip: SlidingChip, chips: TChips, chipsBox: Node) => {
    Object.keys(chips).forEach((chipValue) => {
        const count = chips[chipValue];
        for (let i = 0; i < count; i++) {
            const chip = slidingChip.createSmallChip(+chipValue);
            chip.position = FlyChipUtils.getRandomPositionChip(chip, chipsBox);
            chipsBox.addChild(chip);
        }
    });
};

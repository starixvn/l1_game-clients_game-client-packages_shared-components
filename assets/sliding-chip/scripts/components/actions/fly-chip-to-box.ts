import { Node, UITransform } from "cc";
import { IOwnChip, IOwnChips } from "../../../../bets/scripts/stores/bet-item-store";
import { NumberUtils } from "../../../../utils";
import SlidingChip from "../sliding-chip";
import { FlyChipUtils } from "./fly-chip-utils";

type TChips = {
    [value: number]: number;
};

const loginUserChipFlyingTime = 0.5;
const chipFlyingTime = 0.8;

export const placeChipToChipBox = (ownerChip: IOwnChip, startNode: Node, onComplete: () => void) => {
    // Audio Chip Fly
    const { chipBox, chipBet, slidingChip } = ownerChip;
    if (slidingChip && chipBet > 0) {
        const isLoginUserPlaceBet = startNode == null;
        const flyingDuration = isLoginUserPlaceBet ? loginUserChipFlyingTime : chipFlyingTime;
        const chipPosition = chipBox
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(slidingChip.createStartNodeInfo(startNode, chipBet).worldPos);
        const chipNode = slidingChip.createSmallChip(chipBet);
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

export const addChipsToChipBoxWhenJoinRoom = (otherRate: number, ownChip: IOwnChips) => {
    const { slidingChip, chipBox, totalChipBet, playerRate, chipRate } = ownChip;
    if (!totalChipBet) {
        return;
    }

    const chipValues = Object.keys(totalChipBet);
    chipValues.forEach((originalChipValue) => {
        const chipCountOfBet = totalChipBet[originalChipValue];
        const convertChip = NumberUtils.getChipValueByCurrency(+originalChipValue, playerRate, chipRate);
        const convertValues = getChipQuantity(convertChip, slidingChip.chipValues);
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

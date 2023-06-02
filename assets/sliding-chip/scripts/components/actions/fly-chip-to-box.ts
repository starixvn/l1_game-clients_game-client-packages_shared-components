import { Node, UITransform } from "cc";
import { IOwnChip, IPlayersChips } from "../../../../bets/scripts/stores/bet-item-store";
import { FlyChipUtils } from "../../utils/fly-chip-utils";
import SlidingChip from "../sliding-chip";

type TChips = {
    [value: number]: number;
};

const loginUserChipFlyingTime = 0.5;
const chipFlyingTime = 0.8;

export const placeChipToChipBox = (ownerChip: IOwnChip, startNode: Node, onComplete: () => void) => {
    // Audio Chip Fly
    const { chipBox, chipAmount, slidingChip } = ownerChip;
    if (slidingChip && chipAmount > 0) {
        const isLoginUserPlaceBet = startNode == null;
        const flyingDuration = isLoginUserPlaceBet ? loginUserChipFlyingTime : chipFlyingTime;
        const chipPosition = chipBox
            ?.getComponent(UITransform)
            ?.convertToNodeSpaceAR(slidingChip.createStartNodeInfo(startNode, chipAmount).worldPos);
        const chipNode = slidingChip.createSmallChip(chipAmount);
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

export const addChipsToChipBoxWhenJoinRoom = (ownChip: IPlayersChips) => {
    const { slidingChip, chipBox, chipAmount } = ownChip;
    if (!chipAmount) {
        return;
    }

    const chipValues = Object.keys(chipAmount);
    chipValues.forEach((chipValue) => {
        const chipCountOfBet = chipAmount[chipValue];
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

import { Node, UITransform, Vec3, tween, v3 } from "cc";
import { random } from "lodash-es";
import { IOwnChip, IOwnChips } from "../../../../bets/scripts/stores/bet-item-store";
import { NumberUtils } from "../../../../utils";
import SlidingChip from "../sliding-chip";

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
        const randomPosition = getRandomPositionChip(chipNode, chipBox);
        chipBox?.addChild(chipNode);

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

export const addChipsToChipBoxWhenJoinRoom = (rate: number, ownChip: IOwnChips) => {
    const { slidingChip, chipBox, totalChipBet } = ownChip;
    if (!totalChipBet) {
        return;
    }

    const chipValues = Object.keys(totalChipBet);
    chipValues.forEach((originalChipValue) => {
        const chipCountOfBet = totalChipBet[originalChipValue];
        const convertChip = NumberUtils.getChipValueByCurrency(+originalChipValue, rate);
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
            chip.position = getRandomPositionChip(chip, chipsBox);
            chipsBox.addChild(chip);
        }
    });
};

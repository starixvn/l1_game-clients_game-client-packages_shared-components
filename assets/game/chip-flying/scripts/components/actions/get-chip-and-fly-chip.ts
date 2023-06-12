import { Node, UITransform, instantiate } from "cc";
import gc from "game-client-base";
import BetItem from "../../../../bets/scripts/components/bet-item";
import SlidingChip from "../../../../sliding-chip/scripts/components/sliding-chip";
import { FlyChipUtils } from "../../../../sliding-chip/scripts/utils";
import { IChipFlyingInfo } from "../chip-flying";

export namespace ActionChipFlying {
    export const dealerGetChips = (dealerChipBox: Node, lostBetItems: BetItem[]) => {
        lostBetItems.forEach((item: BetItem) => {
            moveChips(item.chipBox, dealerChipBox);
        });
    };

    const moveChips = (chipsBox: Node, destBox: Node) => {
        const destBoxPosition = destBox.parent.getComponent(UITransform).convertToWorldSpaceAR(destBox.position);
        const destBoxInChipBoxSpacePosition = chipsBox.getComponent(UITransform).convertToNodeSpaceAR(destBoxPosition);

        chipsBox?.children?.forEach((chip: Node) => {
            FlyChipUtils.moveChipThenDestroy(chip, destBoxInChipBoxSpacePosition, SlidingChip.chipFlyingTime);
        });
    };

    export const dealerPayChips = (dealerChipBox: Node, winBetItems: BetItem[]) => {
        winBetItems?.forEach((item: BetItem) => {
            payChipsToWinningBetItem(item.chipBox, dealerChipBox);
        });
    };

    const payChipsToWinningBetItem = (chipBox: Node, dealerChipBox: Node) => {
        const dealerBoxPosition = dealerChipBox.parent.getComponent(UITransform).convertToWorldSpaceAR(dealerChipBox.position);
        const dealerBoxInChipBoxSpacePosition = chipBox.getComponent(UITransform).convertToNodeSpaceAR(dealerBoxPosition);

        chipBox?.children?.forEach((chip: Node) => {
            const cloneChip = instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            chipBox.addChild(cloneChip);
            const randomPosition = FlyChipUtils.getRandomPositionChip(cloneChip, chipBox);
            FlyChipUtils.moveChipTo(cloneChip, randomPosition, SlidingChip.chipFlyingTime);
        });
    };

    export const removeChipStack = (winBetItems: BetItem[]) => {
        winBetItems?.forEach((item: BetItem) => {
            const stackNode = item.chipBox.children[0];
            stackNode && item.chipBox.removeChild(stackNode);
            stackNode?.destroy();
        });
    };

    export const payChipsToMainPlayer = (
        settleStatus: gc.Settlements.SettlementStatusStore,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[]
    ) => {
        const isHiddenPlayers = chipFlyingInfo?.hiddenPlayersNode !== null;

        if (settleStatus && settleStatus?.win) {
            if (isHiddenPlayers) {
                moveChipWithRandomAmountToMainPlayer(settleStatus, chipFlyingInfo, winBetItems);
            } else {
                moveChipWithAmountToMainPlayer(settleStatus, chipFlyingInfo, winBetItems);
            }
        }
    };

    const moveChipWithRandomAmountToMainPlayer = (
        settleStatus: gc.Settlements.SettlementStatusStore,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[]
    ) => {
        const { isChipStack, payChipsDuration, mainPlayerAvatarNode, slidingChip } = chipFlyingInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            if (settleStatus?.winningByChoices[item.node.name.toLowerCase()]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && slidingChip.moveChipsWithRandomAmount(chipNode, mainPlayerAvatarNode, payChipsDuration);
            }
        });
    };

    const moveChipWithAmountToMainPlayer = (
        settleStatus: gc.Settlements.SettlementStatusStore,
        chipFlyingInfo: IChipFlyingInfo,
        winBetItems: BetItem[]
    ) => {
        const { isChipStack, mainPlayerAvatarNode } = chipFlyingInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            if (settleStatus?.winningByChoices[item.betChoice]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && moveChips(chipNode, mainPlayerAvatarNode);
            }
        });
    };

    export const payChipsToHiddenPlayers = (hiddenPlayersNode: Node, isChipStack: boolean, winBetItems: BetItem[]) => {
        if (!hiddenPlayersNode) {
            return;
        }

        winBetItems?.forEach((item: BetItem) => {
            const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
            chipNode && moveChips(chipNode, hiddenPlayersNode);
        });
    };
}

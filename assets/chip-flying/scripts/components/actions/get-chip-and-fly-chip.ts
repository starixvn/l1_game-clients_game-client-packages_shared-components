import { Node, UITransform, instantiate } from "cc";
import { forEach } from "lodash-es";
import BetItem from "../../../../bets/scripts/components/bet-item";
import { FlyChipUtils } from "../../../../sliding-chip/scripts/components/actions";
import { TPayChipInfo } from "../../stores/chip-flying.store";

export namespace ActionChipFlying {
    export const dealerGetChips = (payChipInfo: TPayChipInfo, lostBetItems: BetItem[]) => {
        const { chipFlyingTime, dealerChipBox } = payChipInfo;
        forEach(lostBetItems, (item: BetItem) => {
            moveChips(item.chipBox, dealerChipBox, chipFlyingTime);
        });
    };

    const moveChips = (chipsBox: Node, destBox: Node, chipFlyingTime: number) => {
        const destBoxPosition = destBox.parent.getComponent(UITransform).convertToWorldSpaceAR(destBox.position);
        const destBoxInChipBoxSpacePosition = chipsBox.getComponent(UITransform).convertToNodeSpaceAR(destBoxPosition);

        forEach(chipsBox.children, (chip: Node) => {
            FlyChipUtils.moveChipThenDestroy(chip, destBoxInChipBoxSpacePosition, chipFlyingTime);
        });
    };

    export const dealerPayChips = (payChipInfo: TPayChipInfo, winBetItems: BetItem[]) => {
        const { dealerChipBox, chipFlyingTime } = payChipInfo;
        forEach(winBetItems, (item: BetItem) => {
            payChipsToWinningBetItem(item.chipBox, dealerChipBox, chipFlyingTime);
        });
    };

    const payChipsToWinningBetItem = (chipBox: Node, dealerChipBox: Node, chipFlyingTime: number) => {
        const dealerBoxPosition = dealerChipBox.parent.getComponent(UITransform).convertToWorldSpaceAR(dealerChipBox.position);
        const dealerBoxInChipBoxSpacePosition = chipBox.getComponent(UITransform).convertToNodeSpaceAR(dealerBoxPosition);

        forEach(chipBox.children, (chip: Node) => {
            const cloneChip = instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            chipBox.addChild(cloneChip);
            const randomPosition = FlyChipUtils.getRandomPositionChip(cloneChip, chipBox);
            FlyChipUtils.moveChipTo(cloneChip, randomPosition, chipFlyingTime);
        });
    };

    export const removeChipStack = (winBetItems: BetItem[]) => {
        forEach(winBetItems, (item: BetItem) => {
            const stackNode = item.chipBox.children[0];
            stackNode && item.chipBox.removeChild(stackNode);
            stackNode?.destroy();
        });
    };

    export const payChipsToMainPlayer = (payChipInfo: TPayChipInfo) => {
        const { settleStatus, hiddenPlayersNode } = payChipInfo;
        const isHiddenPlayers = hiddenPlayersNode !== null;

        if (!settleStatus || !settleStatus.win) {
            return;
        }

        if (isHiddenPlayers) {
            moveChipWithRandomAmountToMainPlayer(payChipInfo);
        } else {
            moveChipWithAmountToMainPlayer(payChipInfo);
        }
    };

    const moveChipWithRandomAmountToMainPlayer = (payChipInfo: TPayChipInfo) => {
        const { slidingChip, betInfo, isChipStack, payChipsDuration, mainPlayerAvatarNode, settleStatus } = payChipInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        forEach(betInfo?.winBetItems, (item: BetItem) => {
            if (settleStatus?.winningByChoices[item.node.name.toLowerCase()]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && slidingChip.moveChipsWithRandomAmount(chipNode, mainPlayerAvatarNode, payChipsDuration);
            }
        });
    };

    const moveChipWithAmountToMainPlayer = (payChipInfo: TPayChipInfo) => {
        const { chipFlyingTime, betInfo, mainPlayerAvatarNode, isChipStack, settleStatus } = payChipInfo;

        if (!mainPlayerAvatarNode) {
            return;
        }

        forEach(betInfo?.winBetItems, (item: BetItem) => {
            if (settleStatus?.winningByChoices[item.betChoice]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && moveChips(chipNode, mainPlayerAvatarNode, chipFlyingTime);
            }
        });
    };

    export const payChipsToHiddenPlayers = (payChipInfo: TPayChipInfo) => {
        const { hiddenPlayersNode, isChipStack, betInfo, chipFlyingTime } = payChipInfo;
        if (!hiddenPlayersNode) {
            return;
        }

        forEach(betInfo?.winBetItems, (item: BetItem) => {
            const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
            chipNode && moveChips(chipNode, hiddenPlayersNode, chipFlyingTime);
        });
    };

    export const payChipsToAroundTablePlayers = (payChipInfo: TPayChipInfo) => {
        const { finish } = payChipInfo;
        const winningPlayers = finish.winningPlayers;

        if (!winningPlayers) {
            return;
        }

        const winningPlayerIds = Object.keys(winningPlayers);

        forEach(winningPlayerIds, (playerId) => {
            // anim winning
        });
    };
}

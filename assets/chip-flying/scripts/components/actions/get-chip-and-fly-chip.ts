import { Node, UITransform, instantiate } from "cc";
import gc from "game-client-base";
import { forEach } from "lodash-es";
import BetItem from "../../../../bets/scripts/components/bet-item";
import { FlyChipUtils } from "../../../../sliding-chip/scripts/components/actions";
import { ObjectUtils } from "../../../../utils";
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

    export const payChipToAllPlayers = (payChipInfo: TPayChipInfo) => {
        const { otherPlayers, settleStatus } = payChipInfo;

        payChipsToLoginPlayer(payChipInfo);
        showPayoutForLoginPlayer(settleStatus);

        if (otherPlayers) {
            payChipsToOtherPlayers(payChipInfo);
        }

        payChipsToInGamePlayers(payChipInfo);
    };

    const payChipsToLoginPlayer = (payChipInfo: TPayChipInfo) => {
        const { settleStatus, otherPlayers } = payChipInfo;
        const isOtherPlayers = otherPlayers !== null;

        if (!settleStatus || !settleStatus.win) {
            return;
        }

        if (isOtherPlayers) {
            moveChipWithRandomAmountToLoginPlayer(payChipInfo);
        } else {
            moveChipWithAmountToLoginPlayer(payChipInfo);
        }
    };

    const moveChipWithRandomAmountToLoginPlayer = (payChipInfo: TPayChipInfo) => {
        const { slidingChip, betInfo, isChipStack, payChipsDuration, ownerAvatar, settleStatus } = payChipInfo;

        if (!ownerAvatar) {
            return;
        }
        forEach(betInfo?.winBetItems, (item: BetItem) => {
            if (settleStatus?.winningByChoices[item.node.name.toLowerCase()]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && slidingChip.moveChipsWithRandomAmount(chipNode, ownerAvatar, payChipsDuration);
            }
        });
    };

    const moveChipWithAmountToLoginPlayer = (payChipInfo: TPayChipInfo) => {
        const { chipFlyingTime, betInfo, ownerAvatar, isChipStack, settleStatus } = payChipInfo;

        if (!ownerAvatar) {
            return;
        }
        const betItemLowercaseObjectKeys = ObjectUtils.getLowercaseObjectKeys(settleStatus?.winningByChoices);
        forEach(betInfo?.winBetItems, (item: BetItem) => {
            if (settleStatus?.winningByChoices[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
                const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
                chipNode && moveChips(chipNode, ownerAvatar, chipFlyingTime);
            }
        });
    };

    const showPayoutForLoginPlayer = (settleStatus: gc.Settlements.SettlementStatusStore) => {
        if (!settleStatus || !settleStatus.win) {
            return;
        }
    };

    const payChipsToOtherPlayers = (payChipInfo: TPayChipInfo) => {
        const { otherPlayers, isChipStack, betInfo, chipFlyingTime } = payChipInfo;
        if (!otherPlayers) {
            return;
        }

        forEach(betInfo?.winBetItems, (item: BetItem) => {
            const chipNode = !isChipStack ? item.chipBox : item.chipBox.children[0];
            chipNode && moveChips(chipNode, otherPlayers, chipFlyingTime);
        });
    };

    const payChipsToInGamePlayers = (payChipInfo: TPayChipInfo) => {
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

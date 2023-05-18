import { tween } from "cc";
import { filter, forEach } from "lodash-es";
import { ObjectUtils } from "../../../../utils";

export const payChips = (
    main: any,
    settlementResult: any,
    winningPlayers: any,
    payChipFlyTime: number,
    winningAnimationDuration: number,
    isChipStack = false
) => {
    const mainRoomGame = main;
    const payChipsDuration = payChipFlyTime;
    const winningDuration = winningAnimationDuration;
    if (!mainRoomGame || !settlementResult || !mainRoomGame.enablePlaceChips || !main.node) {
        return;
    }
    const settlementResultKeys = ObjectUtils.getLowercaseObjectKeys(settlementResult);
    const lostBetItems = filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    const winBetItems = filter(main.betItems, (item) => !!settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);

    const payChipInfo: any = {
        mainRoomGame,
        winBetItems,
        winningPlayers,
        payChipsDuration,
        winningDuration,
        isChipStack,
    };
    if (!main.node.activeInHierarchy) {
        dealerGetChips(mainRoomGame, lostBetItems);
        dealerPayChips(mainRoomGame, winBetItems);
        isChipStack && removeChipStack(winBetItems);
        payChipToAllPlayers(payChipInfo);
    } else {
        tween(main.node)
            .delay(main.betChips.chipDelayFlyingTime)
            .call(() => {
                dealerGetChips(mainRoomGame, lostBetItems);
            })
            .delay(main.betChips.chipDelayFlyingTime)
            .call(() => {
                dealerPayChips(mainRoomGame, winBetItems);
            })
            .delay(main.betChips.chipDelayFlyingTime)
            .call(() => {
                isChipStack && removeChipStack(winBetItems);
                mainRoomGame.payChipToAllPlayers(payChipInfo);
            })
            .start();
    }
};

const dealerGetChips = (mainRoomGame: any, lostBetItems: any[]) => {
    forEach(lostBetItems, (item) => {
        mainRoomGame.betChips.moveChips(item.chipNode, mainRoomGame.dealerChipBox);
    });
};

const dealerPayChips = (mainRoomGame: any, winBetItems: any[]) => {
    forEach(winBetItems, (item) => {
        mainRoomGame.betChips.payChipsToWinningBetItem(item.chipNode, mainRoomGame.dealerChipBox);
    });
};

const removeChipStack = (winBetItems: any[]) => {
    forEach(winBetItems, (item) => {
        const stackNode = item.chipNode.children[0];
        stackNode && item.chipNode.removeChild(stackNode);
        stackNode?.destroy();
    });
};

const payChipToAllPlayers = (info: any) => {
    const { mainRoomGame } = info;
    payChipsToLoginPlayer(info, mainRoomGame.otherPlayers !== null);

    // this.showPayoutForLoginPlayer(mainRoomGame);

    if (mainRoomGame.otherPlayers) {
        payChipsToOtherPlayers(info);
    }

    payChipsToInGamePlayers(info);
    // this.inSettlementSequence = false;
};

const payChipsToLoginPlayer = (info: any, isOtherPlayers = true) => {
    const { mainRoomGame } = info;
    const statusData = mainRoomGame.getCurrentStatusData();
    if (!statusData || !statusData.win) {
        return;
    }

    const winningByChoices = statusData.winningByChoices;
    if (isOtherPlayers) {
        moveChipWithRandomAmountToLoginPlayer(info, winningByChoices);
    } else {
        moveChipWithAmountToLoginPlayer(info, winningByChoices);
    }
};

const moveChipWithRandomAmountToLoginPlayer = (info: any, winningByChoices) => {
    const { mainRoomGame, winBetItems, payChipsDuration } = info;
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    forEach(winBetItems, (item) => {
        if (winningByChoices[item.node.name.toLowerCase()]) {
            const chipNode = !info.isChipStack ? item.chipNode : item.chipNode.children[0];
            chipNode && mainRoomGame.betChips.moveChipsWithRandomAmount(chipNode, destNode, payChipsDuration);
        }
    });
};

const moveChipWithAmountToLoginPlayer = (info: any, winningByChoices) => {
    const { mainRoomGame, winBetItems } = info;
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    const betItemLowercaseObjectKeys = ObjectUtils.getLowercaseObjectKeys(winningByChoices);
    forEach(winBetItems, (item) => {
        if (winningByChoices[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
            const chipNode = !info.isChipStack ? item.chipNode : item.chipNode.children[0];
            chipNode && mainRoomGame.betChips.moveChips(chipNode, destNode);
        }
    });
};

const payChipsToOtherPlayers = (info: any) => {
    const { mainRoomGame, winBetItems } = info;
    if (!mainRoomGame.otherPlayers) {
        return;
    }

    forEach(winBetItems, (item) => {
        const chipNode = !info.isChipStack ? item.chipNode : item.chipNode.children[0];
        chipNode && mainRoomGame.betChips.moveChips(chipNode, mainRoomGame.otherPlayers);
    });
};

const payChipsToInGamePlayers = (info: any) => {
    const { mainRoomGame, winBetItems, payChipsDuration, winningDuration } = info;
    let winningPlayers = info.winningPlayers;

    if (mainRoomGame?.gameData?.settlement?.winningPlayers) {
        winningPlayers = mainRoomGame.gameData.settlement.winningPlayers;
        mainRoomGame.gameData.settlement.clearWinnersData();
    }

    if (!winningPlayers) {
        return;
    }

    const winningPlayerIds = Object.keys(winningPlayers);

    forEach(winningPlayerIds, (playerId) => {
        // anim winning
    });
};

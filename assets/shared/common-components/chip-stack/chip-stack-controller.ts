import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { AroundTablePlayers } from "../../../game/around-table-player/scripts/components/around-table-players";

import {
    AroundTablePlayersChipStore,
    IAroundTablePlayerChip,
} from "../../../game/around-table-player/scripts/stores/around-table-players-chip-store";
import { AroundTablePlayerUtils } from "../../../game/around-table-player/scripts/utils/around-table-player-utils";
import { BalanceEffectHandlers } from "../../../game/balance-effect/scripts/handlers/balance-effect-handlers";
import SlidingChip from "../../../game/sliding-chip/scripts/components/sliding-chip";
import { FunctionUtils } from "../../utils";
import { ObserverComponent } from "../observer-component/scripts/observer-component";
import { ChipStack } from "./chip-stack";
import { ChipStackSetting } from "./chip-stack-setting";
import { convertToChipStack } from "./utils";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Auth, Chips, Settlements, Rounds } = gc;

@ccclass("ChipStackController")
export class ChipStackController extends ObserverComponent {
    @property(ChipStackSetting)
    setting: ChipStackSetting = null;

    @property(Node)
    nodeSlidingChip: Node = null;

    @property(Node)
    nodeAroundTablePlayers: Node = null;

    @property(Node)
    hiddenPlayersNode: Node = null;

    _slidingChip: SlidingChip = null;
    _aroundTablePlayers: AroundTablePlayers = null;
    _stacks: ChipStack[];

    totalBet: { [choice: string]: number } = {};

    get slidingChip() {
        if (!this._slidingChip) {
            this._slidingChip = this.nodeSlidingChip?.getComponent(SlidingChip);
        }
        return this._slidingChip;
    }
    get aroundTablePlayers() {
        if (!this._aroundTablePlayers) {
            this._aroundTablePlayers = this.nodeAroundTablePlayers?.getComponent(AroundTablePlayers);
        }
        return this._aroundTablePlayers;
    }

    get stacks() {
        if (!this._stacks) {
            this._stacks = this.getComponentsInChildren(ChipStack);
            this._stacks.forEach((stack) => {
                if (!stack.setting) {
                    stack.setting = this.setting;
                }
            });
        }
        return this._stacks;
    }

    @render(gc.Chips.ChipStore, (store) => store.chipsByMainPlayerRate)
    async placeChipsWhenJoinGame(chipsByMainPlayerRate: gc.Chips.TChipsByMainPlayerRate) {
        if (!this.node.activeInHierarchy || !chipsByMainPlayerRate.isShow || Object.keys(chipsByMainPlayerRate?.chips).length === 0) {
            return;
        }
        while (!this.slidingChip.getReady()) {
            await FunctionUtils.delay(100);
        }

        const data = chipsByMainPlayerRate.chips;
        Object.keys(data).forEach((choice) => {
            const stack = this.getStack(choice);
            if (stack) {
                const rawStackData = data[choice];
                const total = this.calculateTotolBet(rawStackData);
                const stackData = convertToChipStack(total, this.slidingChip.chipValues);
                const { chipOrder, sortedStack } = this.prepareStackInfo(stackData);
                this.addChipsToStack(stack, stackData, sortedStack, chipOrder);
            }
        });
    }

    private calculateTotolBet(stackData) {
        let total = 0;
        Object.keys(stackData).forEach((key) => {
            const count = stackData[key];
            total += +key * count;
        });
        return total;
    }

    @render(gc.Chips.ChipStore, (store) => store.ownChip, { fireImmediately: false })
    async flyOwnChip(ownChip: gc.GameServiceMessage.OwnChip) {
        const { betChoice, amount } = ownChip ?? {};
        if (!betChoice || !amount) {
            return;
        }
        await this.throwSingleChip(betChoice, amount);
    }

    private async throwSingleChip(betChoice: string, amount: number, player?: Node) {
        this.playSoundSingleChip();
        this.addChipValue(betChoice, amount);
        const stack = this.getStack(betChoice);
        const node = this.slidingChip.createSmallChip(amount);

        if (!!player) {
            player.addChild(node);
        } else {
            const chipNode = this.slidingChip.getChipNode(amount);
            chipNode.addChild(node);
        }

        const isNoFlyingChip = await stack.throwChip(node, amount);
        try {
            if (isNoFlyingChip) {
                this.checkToMergeChip(stack, betChoice);
            }
        } catch (e) {}
    }

    private prepareStackInfo(stackData) {
        let chipOrder = "";
        const sortedStack = Object.keys(stackData).sort((a, b) => +b - +a);
        sortedStack.forEach((key) => {
            const count = stackData[key];
            for (let i = 0; i < count; i++) {
                chipOrder += `,${key}`;
            }
        });

        return { chipOrder, sortedStack };
    }

    addChipsToStack(stack, stackData, sortedStack, chipOrder) {
        const nodes = [];
        sortedStack.forEach((key) => {
            const count = stackData[key];
            for (let i = 0; i < count; i++) {
                const node = this.slidingChip.createSmallChip(+key);
                this.node.addChild(node);
                nodes.push(node);
            }
        });

        stack.placeChips(nodes, chipOrder);
    }

    checkToMergeChip(stack: ChipStack, betChoice: string) {
        const total = this.totalBet[betChoice];
        const stackData = convertToChipStack(total, this.slidingChip.chipValues);
        //parse stack data to chip order array
        const { chipOrder, sortedStack } = this.prepareStackInfo(stackData);
        const isDifferent = chipOrder !== stack.chipOrder;
        console.log("================================");
        console.log(`current chip order `, stack.chipOrder);
        console.log(`merge chip order `, chipOrder);
        console.log(isDifferent);
        if (isDifferent) {
            this.addChipsToStack(stack, stackData, sortedStack, chipOrder);
        }
    }

    private getStack(betChoice: string) {
        return this.stacks.find((stack) => stack.node.name === betChoice);
    }

    private addChipValue(choice: string, value: number) {
        const currentValue = this.totalBet[choice] ?? 0;
        this.totalBet[choice] = currentValue + value;
    }

    @render(Chips.ChipStore, (store) => store.collectChipsReBet, { fireImmediately: false })
    flyChipsReBet(collectChipsReBet: gc.Chips.TChipReBet[]) {
        if (collectChipsReBet.length === 0) {
            return;
        }

        // collectChipsReBet.forEach((chipReBet) => {
        //     const { betChoice, amount } = chipReBet;
        //     const betItem = this.betItems?.betItemComponents.find((item) => betChoice === item.betChoice);
        //     this.placeChipToChipBox(
        //         betChoice,
        //         this.chipContainer,
        //         this.slidingChip,
        //         {
        //             chipBox: betItem?.chipBox,
        //             chipValue: amount,
        //         },
        //         null,
        //         null
        //     );
        //     this.playSoundSingleChip();
        // });
    }

    @render(AroundTablePlayersChipStore, (store) => store.aroundTablePlayerChip, { fireImmediately: false })
    async handleAroundTablePlayerPlaceChip(aroundTablePlayerPlaceChip: IAroundTablePlayerChip) {
        if (!this.aroundTablePlayers) {
            return;
        }
        const { playerChip, chipValues } = aroundTablePlayerPlaceChip ?? {};
        if (!playerChip) {
            return;
        }
        const { betChoice, playerId } = playerChip;
        let playerNode: Node;
        let isHiddenPlayer = false;
        const aroundTablePlayer = AroundTablePlayerUtils.getAroundTablePlayerSlot(
            this.aroundTablePlayers.aroundTablePlayerComponents,
            playerId
        );
        if (aroundTablePlayer) {
            AroundTablePlayerUtils.updatePlayerSlotDataStorage(playerChip, aroundTablePlayer);
            playerNode = aroundTablePlayer.avatar.node;
        } else {
            playerNode = this.hiddenPlayersNode;
            isHiddenPlayer = true;
            this.aroundTablePlayers.updateHiddenPlayerStorage(playerChip);
        }

        if (chipValues) {
            for (const chipValue of Object.keys(chipValues)) {
                let count = chipValues[chipValue];
                for (; count > 0; count--) {
                    await this.throwSingleChip(betChoice, +chipValue, playerNode);
                }
            }
        }
    }

    @render(Chips.ChipStore, (store) => store.clearAllChips, { fireImmediately: false })
    clearChipsForAllBetItems() {
        this.stacks.forEach((stack) => stack.clearChips());
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX("pay-money"))
    playPayMoneySound() {}

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.SINGLE_CHIP))
    playSoundSingleChip() {}

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }
}

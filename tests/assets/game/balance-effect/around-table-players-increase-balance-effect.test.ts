import { Container } from "inversify";
import { AroundTablePlayersIncreaseBalanceEffect } from "../../../../assets/game/balance-effect/scripts/components/around-table-players-increase-balance-effect";
import { TBalanceEffect, TUpdateBalances } from "../../../../assets/game/balance-effect/scripts/stores/balance-effect-store";

// Mock FormatUtils and other dependencies
jest.mock("@sg/game-client-base", () => ({
    __esModule: true,
    default: {
        FormatUtils: {
            numberWithCommas: jest.fn((num, digits) => `${num},${digits}`),
        },
    },
}));

// No need to mock cc or observer, handled by test setup

describe("AroundTablePlayersIncreaseBalanceEffect", () => {
    let container: Container;
    let effect: AroundTablePlayersIncreaseBalanceEffect;

    beforeEach(() => {
        container = new Container();
        container.bind(AroundTablePlayersIncreaseBalanceEffect).toSelf();
        effect = container.get(AroundTablePlayersIncreaseBalanceEffect);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("increaseBalanceAroundTablePlayers", () => {
        it("should call updateBalanceWhenPlayerBet for each balanceEffect in balanceEffects array", () => {
            // Arrange
            const mockEffectNode = { addChild: jest.fn() };
            const mockBalanceEffect1: TBalanceEffect = { effectNode: mockEffectNode, balance: 100 } as any;
            const mockBalanceEffect2: TBalanceEffect = { effectNode: mockEffectNode, balance: 200 } as any;
            const mockUpdate: TUpdateBalances = { balanceEffects: [mockBalanceEffect1, mockBalanceEffect2] };
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceAroundTablePlayers(mockUpdate);

            // Assert
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(mockBalanceEffect1);
            expect(spy).toHaveBeenCalledWith(mockBalanceEffect2);
        });

        it("should not call updateBalanceWhenPlayerBet if payoutBalanceAroundTablePlayers is null", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceAroundTablePlayers(null);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });

        it("should not call updateBalanceWhenPlayerBet if payoutBalanceAroundTablePlayers is undefined", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceAroundTablePlayers(undefined);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });

        it("should not call updateBalanceWhenPlayerBet if balanceEffects is an empty array", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceAroundTablePlayers({ balanceEffects: [] });

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });

        it("should not call updateBalanceWhenPlayerBet if balanceEffects is missing", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceAroundTablePlayers({} as any);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });
    });
});

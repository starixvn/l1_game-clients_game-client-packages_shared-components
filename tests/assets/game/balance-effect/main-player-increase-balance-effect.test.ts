import { Container } from "inversify";
import { MainPlayerIncreaseBalanceEffect } from "../../../../assets/game/balance-effect/scripts/components/main-player-increase-balance-effect";
import { TBalanceEffect, TUpdateBalance } from "../../../../assets/game/balance-effect/scripts/stores/balance-effect-store";

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

describe("MainPlayerIncreaseBalanceEffect", () => {
    let container: Container;
    let effect: MainPlayerIncreaseBalanceEffect;

    beforeEach(() => {
        container = new Container();
        container.bind(MainPlayerIncreaseBalanceEffect).toSelf();
        effect = container.get(MainPlayerIncreaseBalanceEffect);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("increaseBalanceMainPlayer", () => {
        it("should call updateBalanceWhenPlayerBet with the correct balanceEffect", () => {
            // Arrange
            const mockEffectNode = { addChild: jest.fn() };
            const mockBalanceEffect: TBalanceEffect = { effectNode: mockEffectNode, balance: 200 } as any;
            const mockUpdate: TUpdateBalance = { balanceEffect: mockBalanceEffect };
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceMainPlayer(mockUpdate);

            // Assert
            expect(spy).toHaveBeenCalledWith(mockBalanceEffect);
        });

        it("should call updateBalanceWhenPlayerBet with undefined if balanceWhenMainPlayerPayout is null", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceMainPlayer(null);

            // Assert
            expect(spy).toHaveBeenCalledWith(undefined);
        });

        it("should call updateBalanceWhenPlayerBet with undefined if balanceWhenMainPlayerPayout is undefined", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.increaseBalanceMainPlayer(undefined);

            // Assert
            expect(spy).toHaveBeenCalledWith(undefined);
        });
    });
});

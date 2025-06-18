import { Container } from "inversify";
import { MainPlayerDecreaseBalanceEffect } from "../../../../assets/game/balance-effect/scripts/components/main-player-decrease-balance-effect";
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

describe("MainPlayerDecreaseBalanceEffect", () => {
    let container: Container;
    let effect: MainPlayerDecreaseBalanceEffect;

    beforeEach(() => {
        container = new Container();
        container.bind(MainPlayerDecreaseBalanceEffect).toSelf();
        effect = container.get(MainPlayerDecreaseBalanceEffect);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("decreaseBalanceMainPlayer", () => {
        it("should call updateBalanceWhenPlayerBet with the correct balanceEffect", () => {
            // Arrange
            const mockEffectNode = { addChild: jest.fn() };
            const mockBalanceEffect: TBalanceEffect = { effectNode: mockEffectNode, balance: 100 } as any;
            const mockUpdate: TUpdateBalance = { balanceEffect: mockBalanceEffect };
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.decreaseBalanceMainPlayer(mockUpdate);

            // Assert
            expect(spy).toHaveBeenCalledWith(mockBalanceEffect);
        });

        it("should call updateBalanceWhenPlayerBet with undefined if balanceWhenMainPlayerBet is null", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.decreaseBalanceMainPlayer(null);

            // Assert
            expect(spy).toHaveBeenCalledWith(undefined);
        });

        it("should call updateBalanceWhenPlayerBet with undefined if balanceWhenMainPlayerBet is undefined", () => {
            // Arrange
            const spy = jest.spyOn(effect, "updateBalanceWhenPlayerBet");

            // Act
            effect.decreaseBalanceMainPlayer(undefined);

            // Assert
            expect(spy).toHaveBeenCalledWith(undefined);
        });
    });
});

import { Container } from "inversify";
import { BalanceEffectHandlers } from "../../../../assets/game/balance-effect/scripts/handlers/balance-effect-handlers";
import {
    BalanceEffectStore,
    TBalanceEffect,
    TWinningEffect,
} from "../../../../assets/game/balance-effect/scripts/stores/balance-effect-store";

describe("BalanceEffectHandlers", () => {
    let container: Container;
    let balanceEffectStoreMock: jest.Mocked<BalanceEffectStore>;

    beforeEach(() => {
        container = new Container();
        // Create a mock for BalanceEffectStore
        balanceEffectStoreMock = {
            updateMainPlayerDecreaseBalance: jest.fn(),
            updateMainPlayerIncreaseBalance: jest.fn(),
            updateMainPlayerWinEffect: jest.fn(),
            updateAroundTablePlayersWinEffect: jest.fn(),
            updateAroundTablePlayersIncreaseBalance: jest.fn(),
            // Properties (not used in handlers)
            decreaseBalanceMainPlayer: null,
            increaseBalanceMainPlayer: null,
            winEffectMainPlayer: null,
            winEffectAroundTablePlayers: null,
            increaseBalanceAroundTablePlayers: null,
        } as any;
        container.bind(BalanceEffectStore).toConstantValue(balanceEffectStoreMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("MainPlayerDecreaseBalance", () => {
        let handler: BalanceEffectHandlers.MainPlayerDecreaseBalance;
        beforeEach(() => {
            container.bind(BalanceEffectHandlers.MainPlayerDecreaseBalance).toSelf();
            handler = container.get(BalanceEffectHandlers.MainPlayerDecreaseBalance);
        });
        it("should call updateMainPlayerDecreaseBalance with the given balance", async () => {
            // Arrange
            const balance = 100;
            // Act
            await handler.handle(balance);
            // Assert
            expect(balanceEffectStoreMock.updateMainPlayerDecreaseBalance).toHaveBeenCalledWith(balance);
        });
    });

    describe("MainPlayerIncreaseBalance", () => {
        let handler: BalanceEffectHandlers.MainPlayerIncreaseBalance;
        beforeEach(() => {
            container.bind(BalanceEffectHandlers.MainPlayerIncreaseBalance).toSelf();
            handler = container.get(BalanceEffectHandlers.MainPlayerIncreaseBalance);
        });
        it("should call updateMainPlayerIncreaseBalance with the given balance", async () => {
            // Arrange
            const balance = 200;
            // Act
            await handler.handle(balance);
            // Assert
            expect(balanceEffectStoreMock.updateMainPlayerIncreaseBalance).toHaveBeenCalledWith(balance);
        });
    });

    describe("MainPlayerWinEffect", () => {
        let handler: BalanceEffectHandlers.MainPlayerWinEffect;
        beforeEach(() => {
            container.bind(BalanceEffectHandlers.MainPlayerWinEffect).toSelf();
            handler = container.get(BalanceEffectHandlers.MainPlayerWinEffect);
        });
        it("should call updateMainPlayerWinEffect with the given status", async () => {
            // Arrange
            const status = true;
            // Act
            await handler.handle(status);
            // Assert
            expect(balanceEffectStoreMock.updateMainPlayerWinEffect).toHaveBeenCalledWith(status);
        });
    });

    describe("AroundTablePlayersWinEffect", () => {
        let handler: BalanceEffectHandlers.AroundTablePlayersWinEffect;
        beforeEach(() => {
            container.bind(BalanceEffectHandlers.AroundTablePlayersWinEffect).toSelf();
            handler = container.get(BalanceEffectHandlers.AroundTablePlayersWinEffect);
        });
        it("should call updateAroundTablePlayersWinEffect with the given winningEffects", async () => {
            // Arrange
            const winningEffects: TWinningEffect[] = [
                { effectNode: {} as any, status: true },
                { effectNode: {} as any, status: false },
            ];
            // Act
            await handler.handle(winningEffects);
            // Assert
            expect(balanceEffectStoreMock.updateAroundTablePlayersWinEffect).toHaveBeenCalledWith(winningEffects);
        });
    });

    describe("AroundTablePlayersIncreaseBalance", () => {
        let handler: BalanceEffectHandlers.AroundTablePlayersIncreaseBalance;
        beforeEach(() => {
            container.bind(BalanceEffectHandlers.AroundTablePlayersIncreaseBalance).toSelf();
            handler = container.get(BalanceEffectHandlers.AroundTablePlayersIncreaseBalance);
        });
        it("should call updateAroundTablePlayersIncreaseBalance with the given balanceEffects", async () => {
            // Arrange
            const balanceEffects: TBalanceEffect[] = [
                { effectNode: {} as any, balance: 10 },
                { effectNode: {} as any, balance: 20 },
            ];
            // Act
            await handler.handle(balanceEffects);
            // Assert
            expect(balanceEffectStoreMock.updateAroundTablePlayersIncreaseBalance).toHaveBeenCalledWith(balanceEffects);
        });
    });
});

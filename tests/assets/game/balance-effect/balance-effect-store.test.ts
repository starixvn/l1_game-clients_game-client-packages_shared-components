import { Node } from "cc";
import { Container } from "inversify";
import {
    BalanceEffectStore,
    TBalanceEffect,
    TWinningEffect,
} from "../../../../assets/game/balance-effect/scripts/stores/balance-effect-store";
import { MainPlayerProfileStore } from "../../../../assets/game/main-player-profile/scripts/stores/main-player-profile-store";

// No need to mock cc or mobx, handled by test setup

describe("BalanceEffectStore", () => {
    let container: Container;
    let store: BalanceEffectStore;
    let mainPlayerProfileStore: jest.Mocked<MainPlayerProfileStore>;
    let mockNode: Node;

    beforeEach(() => {
        container = new Container();
        // Create a mock MainPlayerProfileStore
        mockNode = new Node();
        mainPlayerProfileStore = {
            get containerEffectNode() {
                return mockNode;
            },
            set containerEffectNode(node: Node) {
                mockNode = node;
            },
        } as any;
        container.bind(MainPlayerProfileStore).toConstantValue(mainPlayerProfileStore);
        container.bind(BalanceEffectStore).toSelf();
        store = container.get(BalanceEffectStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("updateMainPlayerDecreaseBalance", () => {
        it("should set decreaseBalanceMainPlayer with correct balanceEffect", () => {
            // Arrange
            // (no additional setup needed)
            // Act
            store.updateMainPlayerDecreaseBalance(123);
            // Assert
            expect(store.decreaseBalanceMainPlayer).toEqual({ balanceEffect: { balance: 123, effectNode: mockNode } });
        });
    });

    describe("updateMainPlayerIncreaseBalance", () => {
        it("should set increaseBalanceMainPlayer with correct balanceEffect", () => {
            // Arrange
            // (no additional setup needed)
            // Act
            store.updateMainPlayerIncreaseBalance(456);
            // Assert
            expect(store.increaseBalanceMainPlayer).toEqual({ balanceEffect: { balance: 456, effectNode: mockNode } });
        });
    });

    describe("updateMainPlayerWinEffect", () => {
        it("should set winEffectMainPlayer with correct status and effectNode", () => {
            // Arrange
            // (no additional setup needed)
            // Act
            store.updateMainPlayerWinEffect(true);
            // Assert
            expect(store.winEffectMainPlayer).toEqual({ status: true, effectNode: mockNode });
        });
    });

    describe("updateAroundTablePlayersWinEffect", () => {
        it("should set winEffectAroundTablePlayers with given winningEffects", () => {
            // Arrange
            const winningEffects: TWinningEffect[] = [
                { effectNode: new Node(), status: true },
                { effectNode: new Node(), status: false },
            ];
            // Act
            store.updateAroundTablePlayersWinEffect(winningEffects);
            // Assert
            expect(store.winEffectAroundTablePlayers).toEqual({ winningEffects });
        });
    });

    describe("updateAroundTablePlayersIncreaseBalance", () => {
        it("should set increaseBalanceAroundTablePlayers with given balanceEffects", () => {
            // Arrange
            const balanceEffects: TBalanceEffect[] = [
                { effectNode: new Node(), balance: 10 },
                { effectNode: new Node(), balance: 20 },
            ];
            // Act
            store.updateAroundTablePlayersIncreaseBalance(balanceEffects);
            // Assert
            expect(store.increaseBalanceAroundTablePlayers).toEqual({ balanceEffects });
        });
    });
});

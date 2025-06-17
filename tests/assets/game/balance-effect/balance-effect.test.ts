import { BitmapFont, Label, Node, tween } from "cc";
import { TBalanceEffect } from "db://shared-components/game/balance-effect/scripts/stores/balance-effect-store";
import { Container } from "inversify";
import { BalanceContainer } from "../../../../assets/game/balance-effect/scripts/components/balance-effect";

jest.mock("db://shared-components/shared/common-components/observer-component/scripts/observer-component", () => ({
    ObserverComponent: class MockObserverComponent {
        onLoad() {}
        onDestroy() {}
        start() {}
        update() {}
        node = new Node();
    },
}));

// Mock FormatUtils and tween
jest.mock("@sg/game-client-base", () => ({
    __esModule: true,
    default: {
        FormatUtils: {
            numberWithCommas: jest.fn((num, digits) => `${num},${digits}`),
        },
    },
}));

describe("BalanceContainer", () => {
    let container: Container;
    let balanceContainer: BalanceContainer;
    let mockFontIncrease: BitmapFont;
    let mockFontDecrease: BitmapFont;

    beforeEach(() => {
        container = new Container();

        // Create component instance
        balanceContainer = new BalanceContainer();

        // Bind component to container
        container.bind(BalanceContainer).toSelf();

        // Get component instance from container
        balanceContainer = container.get(BalanceContainer);

        // Patch addComponent to return a Label instance when called with Label

        mockFontIncrease = new BitmapFont();
        mockFontDecrease = new BitmapFont();
        balanceContainer.fontIncreaseBalance = mockFontIncrease;
        balanceContainer.fontDecreaseBalance = mockFontDecrease;
        balanceContainer.startY = 10;
        balanceContainer.destY = 50;
        balanceContainer.duration = 2;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("updateBalanceWhenPlayerBet", () => {
        it("should not call updateBalanceEffect if effectNode is missing", () => {
            // Arrange
            const spy = jest.spyOn(balanceContainer, "updateBalanceEffect");
            const effect: TBalanceEffect = { effectNode: null, balance: 100 };

            // Act
            balanceContainer.updateBalanceWhenPlayerBet(effect);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });
        it("should not call updateBalanceEffect if balance is missing", () => {
            // Arrange
            const spy = jest.spyOn(balanceContainer, "updateBalanceEffect");
            const effect: TBalanceEffect = { effectNode: new Node(), balance: null };

            // Act
            balanceContainer.updateBalanceWhenPlayerBet(effect);

            // Assert
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe("updateBalanceEffect", () => {
        let parent: Node;
        beforeEach(() => {
            parent = new Node();
            jest.clearAllMocks();
        });
        it("should create a node, set up label, add to parent, and call tween chain (isIncrease=true)", () => {
            // Arrange
            balanceContainer.isIncrease = true;
            balanceContainer.fontIncreaseBalance = mockFontIncrease;
            balanceContainer.fontDecreaseBalance = mockFontDecrease;
            balanceContainer.startY = 10;
            balanceContainer.destY = 50;
            balanceContainer.duration = 2;
            balanceContainer["fontSize"] = 30;
            const balance = 123.45;

            // Act
            balanceContainer.updateBalanceEffect(parent, balance);

            // Assert
            const effectNode = parent.children[0];
            const label = effectNode.getComponent(Label);
            expect(label).toBeTruthy();
            expect(label.string).toBe("+123.45,2");
            expect(label.font).toBe(mockFontIncrease);
            expect(label.lineHeight).toBe(130);
            expect(label.fontSize).toBe(30);
            expect(tween).toHaveBeenCalledWith(effectNode);
        });
        it("should use fontDecreaseBalance and '-' when isIncrease=false", () => {
            // Arrange
            balanceContainer.isIncrease = false;
            balanceContainer.fontIncreaseBalance = mockFontIncrease;
            balanceContainer.fontDecreaseBalance = mockFontDecrease;
            const balance = 50;

            // Act
            balanceContainer.updateBalanceEffect(parent, balance);

            // Assert
            const effectNode = parent.children[0];
            const label = effectNode.getComponent(Label);
            expect(label.string).toBe("-50,2");
            expect(label.font).toBe(mockFontDecrease);
        });
    });
});

import gc from "@sg/game-client-base";
import { Node } from "cc";
import { StaticNode } from "db://shared-components/shared/common-components/static-node/scripts/static-node";
import { Container } from "inversify";
import { isEmpty } from "lodash-es";
import BetItem from "../../../../../assets/game/bets/scripts/components/bet-item";
import { BetItems } from "../../../../../assets/game/bets/scripts/components/bet-items";

// Mock external dependencies
jest.mock("@sg/game-client-base", () => ({
    Settlements: {
        SettlementStore: jest.fn().mockImplementation(() => ({
            settlementResult: null,
            currentFinish: null,
        })),
    },
    Rounds: {
        RoundStore: jest.fn().mockImplementation(() => ({
            roundOdds: null,
            ownBets: null,
            totalBets: null,
            highLightAnim: null,
            highlightStatic: null,
            isResetHighlight: false,
            userBetPercentage: null,
            betPercentage: null,
        })),
    },
    RoundHistories: {
        RoundHistoryStore: jest.fn().mockImplementation(() => ({
            firstJoinGameHistory: null,
        })),
    },
    FormatUtils: {
        numberWithCommas: jest.fn((value) => value.toString()),
    },
    GameServiceMessage: {},
}));

jest.mock("observer", () => {
    const actual = jest.requireActual("../../../../../../../tests/cocos-testing/observer");
    return actual;
});

jest.mock("lodash-es", () => ({
    isEmpty: jest.fn(),
}));


jest.mock("db://shared-components/shared/common-components/static-node/scripts/static-node", () => ({
    StaticNode: jest.fn().mockImplementation(() => ({
        groupId: 0,
    })),
}));

jest.mock("db://shared-components/shared/common-components/static-node/scripts/static-node-info", () => ({
    StaticGroupId: {
        TextContainer: 1,
        ChipContainer: 2,
        BetInfoContainer: 3,
    },
}));

jest.mock("../../../../../assets/game/bets/scripts/components/bet-item", () => {
    return jest.fn().mockImplementation(() => ({
        init: jest.fn(),
        node: {
            name: "testChoice",
        },
        betChoice: "testChoice",
        choice: new Node(),
        lblOdds: {
            node: new Node(),
        },
        chipBox: new Node(),
        lblOwnBet: {
            node: new Node(),
        },
        lblTotalBet: {
            node: new Node(),
        },
        renderOdd: jest.fn(),
        renderOwnBet: jest.fn(),
        renderTotalBet: jest.fn(),
        handleHighlightAnim: jest.fn(),
        handleHighlightStatic: jest.fn(),
        renderUserBetPercentage: jest.fn(),
    }));
});

describe("BetItems", () => {
    let container: Container;
    let betItemsInstance: BetItems;
    let mockNode: jest.Mocked<Node>;
    let mockBetItem1: jest.Mocked<BetItem>;
    let mockBetItem2: jest.Mocked<BetItem>;

    beforeEach(() => {
        container = new Container();

        // Create mock components
        mockNode = new Node() as jest.Mocked<Node>;
        mockBetItem1 = new (BetItem as any)() as jest.Mocked<BetItem>;
        mockBetItem2 = new (BetItem as any)() as jest.Mocked<BetItem>;

        mockBetItem1.node.name = "choice1";
        mockBetItem1.betChoice = "choice1";
        mockBetItem2.node.name = "choice2";
        mockBetItem2.betChoice = "choice2";

        mockNode.getComponentsInChildren = jest.fn().mockReturnValue([mockBetItem1, mockBetItem2]);

        // Bind class to container
        container.bind(BetItems).toSelf();

        // Get instance from container
        betItemsInstance = container.get(BetItems);

        // Set up mock properties
        Object.assign(betItemsInstance, {
            node: mockNode,
            betItemComponents: [],
            settlementResult: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("init", () => {
        it("should get bet item components from children and initialize them", () => {
            // Act
            betItemsInstance.init();

            // Assert
            expect(mockNode.getComponentsInChildren).toHaveBeenCalledWith(BetItem);
            expect(betItemsInstance.betItemComponents).toEqual([mockBetItem1, mockBetItem2]);
            expect(mockBetItem1.init).toHaveBeenCalled();
            expect(mockBetItem2.init).toHaveBeenCalled();
        });
    });

    // describe("onLoad", () => {
        // it("should call init, handleStaticNode and super.onLoad", () => {
        //     // Arrange
        //     const initSpy = jest.spyOn(betItemsInstance, "init");
        //     const handleStaticNodeSpy = jest.spyOn(betItemsInstance as any, "handleStaticNode");
        //     const superOnLoadSpy = jest.spyOn(ObserverComponent.prototype, "onLoad");

        //     // Act
        //     betItemsInstance.onLoad();

        //     // Assert
        //     expect(initSpy).toHaveBeenCalled();
        //     expect(handleStaticNodeSpy).toHaveBeenCalled();
        //     expect(superOnLoadSpy).toHaveBeenCalled();
        // });
    // });

    describe("handleStaticNode", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should add StaticNode components to bet item nodes", () => {
            // Arrange
            const mockAddComponent = jest.fn().mockReturnValue({ groupId: 0 });
            mockBetItem1.choice.addComponent = mockAddComponent;
            mockBetItem1.lblOdds.node.addComponent = mockAddComponent;
            mockBetItem1.chipBox.addComponent = mockAddComponent;
            mockBetItem1.lblOwnBet.node.addComponent = mockAddComponent;
            mockBetItem1.lblTotalBet.node.addComponent = mockAddComponent;

            // Act
            (betItemsInstance as any).handleStaticNode();

            // Assert
            expect(mockAddComponent).toHaveBeenCalledWith(StaticNode);
        });
    });

    describe("updateSettlementResult", () => {
        it("should update settlement result when provided", () => {
            // Arrange
            const settlementResult = { choice1: true, choice2: false };

            // Act
            betItemsInstance.updateSettlementResult(settlementResult);

            // Assert
            expect(betItemsInstance.settlementResult).toBe(settlementResult);
        });

        it("should not update settlement result when null", () => {
            // Arrange
            const originalResult = { choice1: true };
            betItemsInstance.settlementResult = originalResult;

            // Act
            betItemsInstance.updateSettlementResult(null);

            // Assert
            expect(betItemsInstance.settlementResult).toBe(originalResult);
        });
    });

    describe("lostBetItems getter", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should return bet items that lost when settlement result exists", () => {
            // Arrange
            betItemsInstance.settlementResult = { choice1: false, choice2: true };
            // Act
            const result = betItemsInstance.lostBetItems;

            // Assert
            expect(result[0].node.name).toEqual("choice1");
        });

        it("should return all bet items when settlement result is null", () => {
            // Arrange
            betItemsInstance.settlementResult = null;

            // Act
            const result = betItemsInstance.lostBetItems;

            // Assert
            expect(result).toEqual([mockBetItem1, mockBetItem2]);
        });
    });

    describe("winBetItems getter", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should return bet items that won when settlement result exists", () => {
            // Arrange
            betItemsInstance.settlementResult = { choice1: true, choice2: false };

            // Act
            const result = betItemsInstance.winBetItems;

            // Assert
            expect(result[0].node.name).toEqual("choice1");
        });

        it("should return empty array when settlement result is null", () => {
            // Arrange
            betItemsInstance.settlementResult = null;

            // Act
            const result = betItemsInstance.winBetItems;

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe("filterBetItem", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should return bet item with matching choice", () => {
            // Act
            const result = betItemsInstance.filterBetItem("choice1");

            // Assert
            expect(result).toBe(mockBetItem1);
        });

        it("should return undefined when no matching choice", () => {
            // Act
            const result = betItemsInstance.filterBetItem("nonexistent");

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe("renderOdds", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should render odds for all bet items", () => {
            // Arrange
            const roundOdds = {
                odds: { choice1: 2.5, choice2: 1.8 },
                fractional: true,
            };

            // Act
            betItemsInstance.renderOdds(roundOdds);

            // Assert
            expect(mockBetItem1.renderOdd).toHaveBeenCalledWith(2.5, true);
            expect(mockBetItem2.renderOdd).toHaveBeenCalledWith(1.8, true);
        });
    });

    describe("renderOwnBets", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should render own bets for items with bets", () => {
            // Arrange
            const ownBets = { choice1: 100, choice2: 200 };
            (gc.FormatUtils.numberWithCommas as jest.Mock).mockReturnValueOnce("100").mockReturnValueOnce("200");

            // Act
            betItemsInstance.renderOwnBets(ownBets);

            // Assert
            expect(mockBetItem1.renderOwnBet).toHaveBeenCalledWith("100");
            expect(mockBetItem2.renderOwnBet).toHaveBeenCalledWith("200");
        });

        it("should render empty string for items without bets", () => {
            // Arrange
            const ownBets = { choice1: 100 };
            (gc.FormatUtils.numberWithCommas as jest.Mock).mockReturnValue("100");

            // Act
            betItemsInstance.renderOwnBets(ownBets);

            // Assert
            expect(mockBetItem1.renderOwnBet).toHaveBeenCalledWith("100");
            expect(mockBetItem2.renderOwnBet).toHaveBeenCalledWith("");
        });
    });

    describe("renderTotalBets", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should render total bets for items with bets", () => {
            // Arrange
            const totalBets = { choice1: 1000, choice2: 2000 };
            (gc.FormatUtils.numberWithCommas as jest.Mock).mockReturnValueOnce("1,000").mockReturnValueOnce("2,000");

            // Act
            betItemsInstance.renderTotalBets(totalBets);

            // Assert
            expect(mockBetItem1.renderTotalBet).toHaveBeenCalledWith("1,000");
            expect(mockBetItem2.renderTotalBet).toHaveBeenCalledWith("2,000");
        });

        it("should render empty string for items without bets", () => {
            // Arrange
            const totalBets = { choice1: 1000 };
            (gc.FormatUtils.numberWithCommas as jest.Mock).mockReturnValue("1,000");

            // Act
            betItemsInstance.renderTotalBets(totalBets);

            // Assert
            expect(mockBetItem1.renderTotalBet).toHaveBeenCalledWith("1,000");
            expect(mockBetItem2.renderTotalBet).toHaveBeenCalledWith("");
        });
    });

    describe("renderCurrentFinish", () => {
        it("should clear highlights when currentFinish is provided", () => {
            // Arrange
            const currentFinish = { result: { choice1: true, choice2: false } };
            const clearHighlightStaticSpy = jest.spyOn(betItemsInstance, "clearHighlightStatic");
            const clearHighlightAnimSpy = jest.spyOn(betItemsInstance, "clearHighlightAnim");

            // Act
            betItemsInstance.renderCurrentFinish(currentFinish);

            // Assert
            expect(clearHighlightStaticSpy).toHaveBeenCalled();
            expect(clearHighlightAnimSpy).toHaveBeenCalled();
        });

        it("should not clear highlights when currentFinish is null", () => {
            // Arrange
            const clearHighlightStaticSpy = jest.spyOn(betItemsInstance, "clearHighlightStatic");
            const clearHighlightAnimSpy = jest.spyOn(betItemsInstance, "clearHighlightAnim");

            // Act
            betItemsInstance.renderCurrentFinish(null);

            // Assert
            expect(clearHighlightStaticSpy).not.toHaveBeenCalled();
            expect(clearHighlightAnimSpy).not.toHaveBeenCalled();
        });
    });

    describe("renderStaticResult", () => {
        it("should set highlight static when firstJoinGameHistory is provided", () => {
            // Arrange
            const firstJoinGameHistory = {
                roundTime: 1,
                roundHistory: { roundId: 1, result: { choice1: true }, settlementResult: { choice1: true } },
                staticHighlight: true,
                animationHighlight: false,
            };
            const setHighlightStaticSpy = jest.spyOn(betItemsInstance, "setHighlightStatic");

            // Act
            betItemsInstance.renderStaticResult(firstJoinGameHistory);

            // Assert
            expect(setHighlightStaticSpy).toHaveBeenCalledWith(true, false, firstJoinGameHistory.roundHistory);
        });

        it("should not set highlight when firstJoinGameHistory is null", () => {
            // Arrange
            const setHighlightStaticSpy = jest.spyOn(betItemsInstance, "setHighlightStatic");

            // Act
            betItemsInstance.renderStaticResult(null);

            // Assert
            expect(setHighlightStaticSpy).not.toHaveBeenCalled();
        });
    });

    describe("setHighlightStatic", () => {
        it("should show highlight static when staticHighlight is true", () => {
            // Arrange
            const roundHistory = { roundId: 1, result: { choice1: true }, settlementResult: { choice1: true } };
            const showHighlightStaticSpy = jest.spyOn(betItemsInstance as any, "showHighlightStatic");

            // Act
            betItemsInstance.setHighlightStatic(true, false, roundHistory);

            // Assert
            expect(showHighlightStaticSpy).toHaveBeenCalledWith(roundHistory.settlementResult);
        });

        it("should show highlight static when animationHighlight is true", () => {
            // Arrange
            const roundHistory = { roundId: 1, result: { choice1: true }, settlementResult: { choice1: true } };
            const showHighlightStaticSpy = jest.spyOn(betItemsInstance as any, "showHighlightStatic");

            // Act
            betItemsInstance.setHighlightStatic(false, true, roundHistory);

            // Assert
            expect(showHighlightStaticSpy).toHaveBeenCalledWith(roundHistory.settlementResult);
        });

        it("should not show highlight when both flags are false", () => {
            // Arrange
            const roundHistory = { roundId: 1, result: { choice1: true }, settlementResult: { choice1: true } };
            const showHighlightStaticSpy = jest.spyOn(betItemsInstance as any, "showHighlightStatic");

            // Act
            betItemsInstance.setHighlightStatic(false, false, roundHistory);

            // Assert
            expect(showHighlightStaticSpy).not.toHaveBeenCalled();
        });
    });

    describe("handleHighlightAnim", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should handle highlight animation when settlement result is provided", () => {
            // Arrange
            const highLightInfo = {
                settlementResult: { choice1: true, choice2: false },
                isAnim: true,
            };

            // Act
            betItemsInstance.handleHighlightAnim(highLightInfo);

            // Assert
            expect(mockBetItem1.handleHighlightAnim).toHaveBeenCalledWith(true);
            expect(mockBetItem2.handleHighlightAnim).toHaveBeenCalledWith(false);
        });

        it("should clear highlight animation when no settlement result", () => {
            // Arrange
            const highLightInfo = {
                settlementResult: null,
                isAnim: true,
            };
            const clearHighlightAnimSpy = jest.spyOn(betItemsInstance, "clearHighlightAnim");

            // Act
            betItemsInstance.handleHighlightAnim(highLightInfo);

            // Assert
            expect(clearHighlightAnimSpy).toHaveBeenCalled();
        });
    });

    describe("handleHighlightStatic", () => {
        it("should show highlight static when settlement result is not empty", () => {
            // Arrange
            const highlightStatic = {
                result: { choice1: true, choice2: false },
                settlementResult: { choice1: true, choice2: false },
            };
            (isEmpty as unknown as jest.Mock).mockReturnValue(false);
            const showHighlightStaticSpy = jest.spyOn(betItemsInstance as any, "showHighlightStatic");

            // Act
            betItemsInstance.handleHighlightStatic(highlightStatic);

            // Assert
            expect(showHighlightStaticSpy).toHaveBeenCalledWith(highlightStatic.settlementResult);
        });

        it("should clear highlight static when settlement result is empty", () => {
            // Arrange
            const highlightStatic = {
                result: { choice1: true, choice2: false },
                settlementResult: { choice1: true, choice2: false },
            };
            (isEmpty as unknown as jest.Mock).mockReturnValue(true);
            const clearHighlightStaticSpy = jest.spyOn(betItemsInstance, "clearHighlightStatic");

            // Act
            betItemsInstance.handleHighlightStatic(highlightStatic);

            // Assert
            expect(clearHighlightStaticSpy).toHaveBeenCalled();
        });
    });

    describe("showHighlightStatic", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should set highlight static for each bet item based on winning status", () => {
            // Arrange
            const settlementResult = { choice1: 1, choice2: 0 };

            // Act
            (betItemsInstance as any).showHighlightStatic(settlementResult);

            // Assert
            expect(mockBetItem1.handleHighlightStatic).toHaveBeenCalledWith(true);
            expect(mockBetItem2.handleHighlightStatic).toHaveBeenCalledWith(false);
        });
    });

    describe("showAnimationHighlight", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should set highlight animation for each bet item based on winning status", () => {
            // Arrange
            const settlementResult = { choice1: 1, choice2: 0 };

            // Act
            (betItemsInstance as any).showAnimationHighlight(settlementResult);

            // Assert
            expect(mockBetItem1.handleHighlightAnim).toHaveBeenCalledWith(true);
            expect(mockBetItem2.handleHighlightAnim).toHaveBeenCalledWith(false);
        });
    });

    describe("handleResetHighlight", () => {
        it("should clear highlight static when isResetHighlight is true", () => {
            // Arrange
            const clearHighlightStaticSpy = jest.spyOn(betItemsInstance, "clearHighlightStatic");

            // Act
            betItemsInstance.handleResetHighlight(true);

            // Assert
            expect(clearHighlightStaticSpy).toHaveBeenCalled();
        });

        it("should not clear highlight static when isResetHighlight is false", () => {
            // Arrange
            const clearHighlightStaticSpy = jest.spyOn(betItemsInstance, "clearHighlightStatic");

            // Act
            betItemsInstance.handleResetHighlight(false);

            // Assert
            expect(clearHighlightStaticSpy).not.toHaveBeenCalled();
        });
    });

    describe("clearHighlightStatic", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should set highlight static to false for all bet items", () => {
            // Act
            betItemsInstance.clearHighlightStatic();

            // Assert
            expect(mockBetItem1.handleHighlightStatic).toHaveBeenCalledWith(false);
            expect(mockBetItem2.handleHighlightStatic).toHaveBeenCalledWith(false);
        });
    });

    describe("clearHighlightAnim", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should set highlight animation to false for all bet items", () => {
            // Act
            betItemsInstance.clearHighlightAnim();

            // Assert
            expect(mockBetItem1.handleHighlightAnim).toHaveBeenCalledWith(false);
            expect(mockBetItem2.handleHighlightAnim).toHaveBeenCalledWith(false);
        });
    });

    describe("isWinning", () => {
        it("should return true when value equals target (default 1)", () => {
            // Act
            const result = betItemsInstance.isWinning(1);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when value does not equal target", () => {
            // Act
            const result = betItemsInstance.isWinning(0);

            // Assert
            expect(result).toBe(false);
        });

        it("should return true when value equals custom target", () => {
            // Act
            const result = betItemsInstance.isWinning(5, 5);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when value does not equal custom target", () => {
            // Act
            const result = betItemsInstance.isWinning(3, 5);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("handleUserBetPercentage", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should render user bet percentage for each bet item", () => {
            // Arrange
            const userBetPercentage = { choice1: 25, choice2: 75 };

            // Act
            betItemsInstance.handleUserBetPercentage(userBetPercentage);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).toHaveBeenCalledWith(25);
            expect(mockBetItem2.renderUserBetPercentage).toHaveBeenCalledWith(75);
        });

        it("should render 0 for choices without percentage data", () => {
            // Arrange
            const userBetPercentage = { choice1: 100, choice2: 0 };

            // Act
            betItemsInstance.handleUserBetPercentage(userBetPercentage);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).toHaveBeenCalledWith(100);
            expect(mockBetItem2.renderUserBetPercentage).toHaveBeenCalledWith(0);
        });

        it("should not render when userBetPercentage is null", () => {
            // Act
            betItemsInstance.handleUserBetPercentage(null);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).not.toHaveBeenCalled();
            expect(mockBetItem2.renderUserBetPercentage).not.toHaveBeenCalled();
        });
    });

    describe("handleBetPercentage", () => {
        beforeEach(() => {
            betItemsInstance.betItemComponents = [mockBetItem1, mockBetItem2];
        });

        it("should render bet percentage for each bet item", () => {
            // Arrange
            const betPercentage = { choice1: 30, choice2: 70 };

            // Act
            betItemsInstance.handleBetPercentage(betPercentage);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).toHaveBeenCalledWith(30);
            expect(mockBetItem2.renderUserBetPercentage).toHaveBeenCalledWith(70);
        });

        it("should render 0 for choices without percentage data", () => {
            // Arrange
            const betPercentage = { choice1: 30 };

            // Act
            betItemsInstance.handleBetPercentage(betPercentage);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).toHaveBeenCalledWith(30);
            expect(mockBetItem2.renderUserBetPercentage).toHaveBeenCalledWith(0);
        });

        it("should not render when betPercentage is null", () => {
            // Act
            betItemsInstance.handleBetPercentage(null);

            // Assert
            expect(mockBetItem1.renderUserBetPercentage).not.toHaveBeenCalled();
            expect(mockBetItem2.renderUserBetPercentage).not.toHaveBeenCalled();
        });
    });
});

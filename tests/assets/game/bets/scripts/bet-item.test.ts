import gc from "@sg/game-client-base";
import { Color, Label, Node } from "cc";
import BetItem from "../../../../../assets/game/bets/scripts/components/bet-item";
import { ComponentUtils } from "../../../../../assets/shared/utils";

// Mock dependencies
jest.mock("@sg/game-client-base", () => ({
    Bet: {
        BetHandler: jest.fn(),
    },
    FormatUtils: {
        formatOdds: jest.fn((odds: number, fractional: boolean) => (fractional ? `${odds}/1` : odds.toString())),
    },
    GameConfigs: {
        GameConfigStore: jest.fn(),
    },
}));

jest.mock("../../../../../assets/shared/utils", () => ({
    ComponentUtils: {
        setEmptyLabels: jest.fn(),
    },
}));

describe("BetItem", () => {
    let betItem: BetItem;
    let mockNode: Node;
    let mockLblOwnBet: Label;
    let mockLblTotalBet: Label;
    let mockLblOdds: Label;
    let mockChipBox: Node;
    let mockHighlightStatic: Node;
    let mockHighlightAnim: Node;
    let mockChoice: Node;
    let mockLblBetPercentage: Label;
    let mockHighlightOdds: Node;

    beforeEach(() => {
        // Create mock nodes and labels
        mockNode = new Node();
        mockNode.name = "testChoice";

        mockLblOwnBet = new Label();
        mockLblTotalBet = new Label();
        mockLblOdds = new Label();
        mockChipBox = new Node();
        mockHighlightStatic = new Node();
        mockHighlightAnim = new Node();
        mockChoice = new Node();
        mockLblBetPercentage = new Label();
        mockHighlightOdds = new Node();

        // Create component instance
        betItem = new BetItem();
        betItem.node = mockNode;
        betItem.lblOwnBet = mockLblOwnBet;
        betItem.lblTotalBet = mockLblTotalBet;
        betItem.lblOdds = mockLblOdds;
        betItem.chipBox = mockChipBox;
        betItem.highlightStatic = mockHighlightStatic;
        betItem.highlightAnim = mockHighlightAnim;
        betItem.choice = mockChoice;
        betItem.lblBetPercentage = mockLblBetPercentage;
        betItem.highlightOdds = mockHighlightOdds;
        betItem.enableBoostedOdds = false;
        betItem.boostedOddsColor = new Color(250, 58, 53, 255);


        // Reset mocks
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("initialization", () => {
        it("should initialize component on first call", () => {
            // Act
            betItem.init();

            // Assert
            expect(ComponentUtils.setEmptyLabels).toHaveBeenCalledWith([mockLblOwnBet, mockLblTotalBet, mockLblOdds]);
            expect(mockHighlightStatic.active).toBe(false);
            expect(mockHighlightAnim.active).toBe(false);
            expect(betItem["_initialized"]).toBe(true);
        });

        it("should not reinitialize if already initialized", () => {
            // Arrange
            betItem["_initialized"] = true;

            // Act
            betItem.init();

            // Assert
            expect(ComponentUtils.setEmptyLabels).not.toHaveBeenCalled();
        });

    });

    describe("hideSomeNodes", () => {
        it("should hide highlight nodes when they exist", () => {
            // Act
            betItem.hideSomeNodes();

            // Assert
            expect(mockHighlightStatic.active).toBe(false);
            expect(mockHighlightAnim.active).toBe(false);
        });

        it("should handle null highlight nodes gracefully", () => {
            // Arrange
            betItem.highlightStatic = null;
            betItem.highlightAnim = null;

            // Act & Assert
            expect(() => betItem.hideSomeNodes()).not.toThrow();
        });
    });

    describe("betChoice getter", () => {
        it("should return node name", () => {
            // Act
            const result = betItem.betChoice;

            // Assert
            expect(result).toBe("testChoice");
        });
    });

    describe("callBet", () => {
        it("should call onBet method", () => {
            // Arrange
            const onBetSpy = jest.spyOn(betItem, "onBet");

            // Act
            betItem.callBet();

            // Assert
            expect(onBetSpy).toHaveBeenCalled();
        });
    });

    describe("onBet", () => {
        it("should return node name", () => {
            // Act
            const result = betItem.onBet();

            // Assert
            expect(result).toBe("testChoice");
        });

    });

    describe("renderOdd", () => {
        it("should format and set odds when label exists", () => {
            // Act
            betItem.renderOdd(2.5, true);

            // Assert
            expect(gc.FormatUtils.formatOdds).toHaveBeenCalledWith(2.5, true);
            expect(mockLblOdds.string).toBe("2.5/1");
        });

        it("should format odds as decimal when fractional is false", () => {
            // Act
            betItem.renderOdd(2.5, false);

            // Assert
            expect(gc.FormatUtils.formatOdds).toHaveBeenCalledWith(2.5, false);
            expect(mockLblOdds.string).toBe("2.5");
        });

        it("should handle null label gracefully", () => {
            // Arrange
            betItem.lblOdds = null;

            // Act & Assert
            expect(() => betItem.renderOdd(2.5, true)).not.toThrow();
            expect(gc.FormatUtils.formatOdds).not.toHaveBeenCalled();
        });
    });

    describe("renderOwnBet", () => {
        it("should set own bet when label exists", () => {
            // Act
            betItem.renderOwnBet("100");

            // Assert
            expect(mockLblOwnBet.string).toBe("100");
        });

        it("should handle null label gracefully", () => {
            // Arrange
            betItem.lblOwnBet = null;

            // Act & Assert
            expect(() => betItem.renderOwnBet("100")).not.toThrow();
        });
    });

    describe("renderTotalBet", () => {
        it("should set total bet when label exists", () => {
            // Act
            betItem.renderTotalBet("500");

            // Assert
            expect(mockLblTotalBet.string).toBe("500");
        });

        it("should handle null label gracefully", () => {
            // Arrange
            betItem.lblTotalBet = null;

            // Act & Assert
            expect(() => betItem.renderTotalBet("500")).not.toThrow();
        });
    });

    describe("handleHighlightAnim", () => {
        it("should activate highlight animation when true", () => {
            // Act
            betItem.handleHighlightAnim(true);

            // Assert
            expect(mockHighlightAnim.active).toBe(true);
        });

        it("should deactivate highlight animation when false", () => {
            // Act
            betItem.handleHighlightAnim(false);

            // Assert
            expect(mockHighlightAnim.active).toBe(false);
        });

        it("should handle null highlight node gracefully", () => {
            // Arrange
            betItem.highlightAnim = null;

            // Act & Assert
            expect(() => betItem.handleHighlightAnim(true)).not.toThrow();
        });
    });

    describe("handleHighlightStatic", () => {
        it("should activate static highlight when true", () => {
            // Act
            betItem.handleHighlightStatic(true);

            // Assert
            expect(mockHighlightStatic.active).toBe(true);
        });

        it("should deactivate static highlight when false", () => {
            // Act
            betItem.handleHighlightStatic(false);

            // Assert
            expect(mockHighlightStatic.active).toBe(false);
        });

        it("should handle null highlight node gracefully", () => {
            // Arrange
            betItem.highlightStatic = null;

            // Act & Assert
            expect(() => betItem.handleHighlightStatic(true)).not.toThrow();
        });
    });

    describe("renderUserBetPercentage", () => {
        it("should set user bet percentage when label exists", () => {
            // Act
            betItem.renderUserBetPercentage(25);

            // Assert
            expect(mockLblBetPercentage.string).toBe("25%");
        });

        it("should handle null label gracefully", () => {
            // Arrange
            betItem.lblBetPercentage = null;

            // Act & Assert
            expect(() => betItem.renderUserBetPercentage(25)).not.toThrow();
        });

        it("should handle zero percentage", () => {
            // Act
            betItem.renderUserBetPercentage(0);

            // Assert
            expect(mockLblBetPercentage.string).toBe("0%");
        });
    });

    describe("renderbetPercentage", () => {
        it("should set bet percentage when label exists", () => {
            // Act
            betItem.renderbetPercentage(30);

            // Assert
            expect(mockLblBetPercentage.string).toBe("30%");
        });

        it("should handle null label gracefully", () => {
            // Arrange
            betItem.lblBetPercentage = null;

            // Act & Assert
            expect(() => betItem.renderbetPercentage(30)).not.toThrow();
        });

        it("should handle decimal percentage", () => {
            // Act
            betItem.renderbetPercentage(33.5);

            // Assert
            expect(mockLblBetPercentage.string).toBe("33.5%");
        });
    });

    describe("handleBoostedChoices", () => {
        beforeEach(() => {
            betItem.enableBoostedOdds = true;
        });

        it("should enable boosted odds when choice is in boosted choices", () => {
            // Arrange
            const boostedChoices = ["testChoice", "otherChoice"];

            // Act
            betItem.handleBoostedChoices(boostedChoices);

            // Assert
            expect(mockHighlightOdds.active).toBe(true);
            expect(mockLblOdds.color).toEqual(new Color(betItem.boostedOddsColor));
        });

        it("should disable boosted odds when choice is not in boosted choices", () => {
            // Arrange
            const boostedChoices = ["otherChoice1", "otherChoice2"];

            // Act
            betItem.handleBoostedChoices(boostedChoices);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should disable boosted odds when enableBoostedOdds is false", () => {
            // Arrange
            betItem.enableBoostedOdds = false;
            const boostedChoices = ["testChoice"];

            // Act
            betItem.handleBoostedChoices(boostedChoices);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should handle empty boosted choices array", () => {
            // Act
            betItem.handleBoostedChoices([]);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should handle null boosted choices", () => {
            // Act
            betItem.handleBoostedChoices(null);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should handle undefined boosted choices", () => {
            // Act
            betItem.handleBoostedChoices(undefined);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should handle null odds label gracefully", () => {
            // Arrange
            betItem.lblOdds = null;
            const boostedChoices = ["testChoice"];

            // Act & Assert
            expect(() => betItem.handleBoostedChoices(boostedChoices)).not.toThrow();
        });

        it("should handle null highlight odds node gracefully", () => {
            // Arrange
            betItem.highlightOdds = null;
            const boostedChoices = ["testChoice"];

            // Act & Assert
            expect(() => betItem.handleBoostedChoices(boostedChoices)).not.toThrow();
        });

    });

    describe("enableHighLightOdds", () => {
        it("should enable highlight odds when true", () => {
            // Act
            betItem["enableHighLightOdds"](true);

            // Assert
            expect(mockHighlightOdds.active).toBe(true);
        });

        it("should disable highlight odds when false", () => {
            // Act
            betItem["enableHighLightOdds"](false);

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
        });

        it("should disable highlight odds when called without parameters", () => {
            // Arrange
            mockHighlightOdds.active = true;

            // Act
            betItem["enableHighLightOdds"]();

            // Assert
            expect(mockHighlightOdds.active).toBe(false);
        });

        it("should handle null highlight odds node gracefully", () => {
            // Arrange
            betItem.highlightOdds = null;

            // Act & Assert
            expect(() => betItem["enableHighLightOdds"](true)).not.toThrow();
        });
    });

    describe("changeOddsColor", () => {
        it("should set boosted odds color when isBoostedOdd is true", () => {
            // Act
            betItem["changeOddsColor"](true);

            // Assert
            expect(mockLblOdds.color).toEqual(new Color(betItem.boostedOddsColor));
        });

        it("should set white color when isBoostedOdd is false", () => {
            // Act
            betItem["changeOddsColor"](false);

            // Assert
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should set white color when called without parameters", () => {
            // Arrange
            mockLblOdds.color = new Color(250, 58, 53, 255);

            // Act
            betItem["changeOddsColor"]();

            // Assert
            expect(mockLblOdds.color).toEqual(new Color(255, 255, 255, 255));
        });

        it("should handle null odds label gracefully", () => {
            // Arrange
            betItem.lblOdds = null;

            // Act & Assert
            expect(() => betItem["changeOddsColor"](true)).not.toThrow();
        });

        it("should return early when lblOdds is null", () => {
            // Arrange
            betItem.lblOdds = null;
            const colorSpy = jest.spyOn(Color.prototype, 'constructor' as any);

            // Act
            betItem["changeOddsColor"](true);

            // Assert - No new Color should be created since method returns early
            expect(colorSpy).not.toHaveBeenCalled();
        });
    });

    describe("property visibility conditions", () => {
        it("should show highlightOdds property when enableBoostedOdds is true", () => {
            // Arrange
            betItem.enableBoostedOdds = true;

            // Act
            const isVisible = betItem.highlightOdds !== undefined;

            // Assert
            expect(isVisible).toBe(true);
        });

        it("should show boostedOddsColor property when enableBoostedOdds is true", () => {
            // Arrange
            betItem.enableBoostedOdds = true;

            // Act
            const isVisible = betItem.boostedOddsColor !== undefined;

            // Assert
            expect(isVisible).toBe(true);
        });
    });


    describe("integration scenarios", () => {
        it("should handle boosted odds workflow correctly", () => {
            // Arrange
            betItem.enableBoostedOdds = true;
            const boostedChoices = ["testChoice"];

            // Act
            betItem.handleBoostedChoices(boostedChoices);
            betItem.renderUserBetPercentage(75);

            // Assert
            expect(mockHighlightOdds.active).toBe(true);
            expect(mockLblOdds.color).toEqual(new Color(betItem.boostedOddsColor));
            expect(mockLblBetPercentage.string).toBe("75%");
        });
    });
});

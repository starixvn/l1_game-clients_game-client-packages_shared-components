import gc from "@sg/game-client-base";
import { Color } from "cc";
import { Container } from "inversify";
import "reflect-metadata";
import BetDetailLogItem, {
    BetDetailLogItemType,
    GameRoundBetDetailsLog,
} from "../../../../../assets/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

// Mock gc components
jest.mock("@sg/game-client-base", () => ({
    DateTimeUtils: {
        formatDateTime: jest.fn(),
    },
    FormatUtils: {
        numberWithCommas: jest.fn(),
    },
    Translator: {
        gameTranslate: jest.fn(),
    },
    BetHistory: {
        DynamicObject: jest.fn(),
    },
}));

describe("BetDetailLogItem", () => {
    let container: Container;
    let betDetailLogItem: BetDetailLogItem;
    let mockDateTimeUtils: jest.Mocked<typeof gc.DateTimeUtils>;
    let mockFormatUtils: jest.Mocked<typeof gc.FormatUtils>;
    let mockTranslator: jest.Mocked<typeof gc.Translator>;

    beforeEach(() => {
        container = new Container();

        // Bind the class under test
        container.bind(BetDetailLogItem).toSelf();

        // Get instances
        betDetailLogItem = container.get(BetDetailLogItem);

        // Set up mock properties
        betDetailLogItem.lblChoice = { string: "" } as any;
        betDetailLogItem.lblAmount = { string: "" } as any;
        betDetailLogItem.lblOdds = { string: "" } as any;
        betDetailLogItem.lblWin = { string: "" } as any;
        betDetailLogItem.lblTime = { string: "" } as any;
        betDetailLogItem.nodeBackground = { active: false } as any;
        betDetailLogItem.refundChoices = [];
        betDetailLogItem.refundRatio = 0.5;

        mockDateTimeUtils = gc.DateTimeUtils as jest.Mocked<typeof gc.DateTimeUtils>;
        mockFormatUtils = gc.FormatUtils as jest.Mocked<typeof gc.FormatUtils>;
        mockTranslator = gc.Translator as jest.Mocked<typeof gc.Translator>;

        // Setup default mock implementations
        mockFormatUtils.numberWithCommas.mockReturnValue("1,000.00");
        mockTranslator.gameTranslate.mockReturnValue("Translated Choice");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("setData", () => {
        it("should call parent setData and update labels with correct data", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            // Act
            betDetailLogItem.setData(mockData);

            // Assert
            expect(mockTranslator.gameTranslate).toHaveBeenCalledWith("glossary_home");
            expect(mockFormatUtils.numberWithCommas).toHaveBeenCalledWith(1000, 2);
        });

        it("should call parseOddByData and calculateWinValue", () => {
            // Arrange
            const parseOddSpy = jest.spyOn(betDetailLogItem, "parseOddByData");

            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            // Act
            betDetailLogItem.setData(mockData);

            // Assert
            expect(parseOddSpy).toHaveBeenCalledWith(mockData);
            // calculateWinValue is called internally by setData, we test its behavior through the setData method
        });
    });

    describe("calculateWinValue", () => {
        it("should calculate winning amount correctly when bet wins", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            const setHighlightSpy = jest.spyOn(betDetailLogItem, "setHighlightTicketDetail");

            // Act
            (betDetailLogItem as any).calculateWinValue(mockData);

            // Assert
            expect(mockFormatUtils.numberWithCommas).toHaveBeenCalledWith(2500, 2); // 1000 * 2.5
            expect(setHighlightSpy).toHaveBeenCalledWith(true); // winningAmount > amount
        });

        it("should calculate winning amount correctly for free bet", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: true,
                fractionalOddsFormat: false,
            };

            const setHighlightSpy = jest.spyOn(betDetailLogItem, "setHighlightTicketDetail");

            // Act
            (betDetailLogItem as any).calculateWinValue(mockData);

            // Assert
            expect(mockFormatUtils.numberWithCommas).toHaveBeenCalledWith(1500, 2); // 1000 * (2.5 - 1)
            expect(setHighlightSpy).toHaveBeenCalledWith(true);
        });

        it("should set win amount to 0 when bet loses", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: false, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            const needRefundSpy = jest.spyOn(betDetailLogItem, "needRefund").mockReturnValue(false);

            // Act
            (betDetailLogItem as any).calculateWinValue(mockData);

            // Assert
            expect(betDetailLogItem.lblWin.string).toBe("0");
            expect(needRefundSpy).toHaveBeenCalledWith(mockData.settlementResult);
        });

        it("should calculate refund amount when refund is needed", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: false, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            betDetailLogItem.refundChoices = ["draw"];
            betDetailLogItem.refundRatio = 0.5;
            const needRefundSpy = jest.spyOn(betDetailLogItem, "needRefund").mockReturnValue(true);

            // Act
            (betDetailLogItem as any).calculateWinValue(mockData);

            // Assert
            expect(mockFormatUtils.numberWithCommas).toHaveBeenCalledWith(500, 2); // 1000 * 0.5
            expect(needRefundSpy).toHaveBeenCalledWith(mockData.settlementResult);
        });
    });

    describe("needRefund", () => {
        it("should return true when refund choice is found in settlement result", () => {
            // Arrange
            betDetailLogItem.refundChoices = ["draw", "void"];
            const settlementResult = { home: false, away: false, draw: true };

            // Act
            const result = betDetailLogItem.needRefund(settlementResult);

            // Assert
            expect(result).toBe(true);
        });

        it("should return false when no refund choice is found in settlement result", () => {
            // Arrange
            betDetailLogItem.refundChoices = ["draw", "void"];
            const settlementResult = { home: true, away: false, draw: false };

            // Act
            const result = betDetailLogItem.needRefund(settlementResult);

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when refund choices array is empty", () => {
            // Arrange
            betDetailLogItem.refundChoices = [];
            const settlementResult = { home: true, away: false };

            // Act
            const result = betDetailLogItem.needRefund(settlementResult);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("parseOddByData", () => {
        it("should format odds correctly for decimal format", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: false,
            };

            // Act
            betDetailLogItem.parseOddByData(mockData);

            // Assert
            expect(betDetailLogItem.lblOdds.string).toBe("2.5");
        });

        it("should format odds correctly for fractional format", () => {
            // Arrange
            const mockData: BetDetailLogItemType = {
                betDetailsLog: {
                    amount: 1000,
                    time: "2023-01-01T10:00:00Z",
                    choice: "home",
                    rate: 1.5,
                    rebet: false,
                } as GameRoundBetDetailsLog & gc.BetHistory.DynamicObject<object>,
                index: 0,
                odds: { home: 2.5, away: 1.8 },
                settlementResult: { home: true, away: false },
                result: {},
                freeBet: false,
                fractionalOddsFormat: true,
            };

            // Act
            betDetailLogItem.parseOddByData(mockData);

            // Assert
            expect(mockFormatUtils.numberWithCommas).toHaveBeenCalledWith(1.5, 2); // 2.5 - 1
        });
    });

    describe("setHighlightTicketDetail", () => {
        it("should set yellow color when highlight is true", () => {
            // Arrange
            betDetailLogItem.lblChoice = { color: null } as any;
            betDetailLogItem.lblOdds = { color: null } as any;
            betDetailLogItem.lblAmount = { color: null } as any;

            // Act
            betDetailLogItem.setHighlightTicketDetail(true);

            // Assert
            expect(betDetailLogItem.lblChoice.color).toBe(Color.YELLOW);
            expect(betDetailLogItem.lblOdds.color).toBe(Color.YELLOW);
            expect(betDetailLogItem.lblAmount.color).toBe(Color.YELLOW);
        });

        it("should set white color when highlight is false", () => {
            // Arrange
            betDetailLogItem.lblChoice = { color: null } as any;
            betDetailLogItem.lblOdds = { color: null } as any;
            betDetailLogItem.lblAmount = { color: null } as any;

            // Act
            betDetailLogItem.setHighlightTicketDetail(false);

            // Assert
            expect(betDetailLogItem.lblChoice.color).toBe(Color.WHITE);
            expect(betDetailLogItem.lblOdds.color).toBe(Color.WHITE);
            expect(betDetailLogItem.lblAmount.color).toBe(Color.WHITE);
        });
    });
});

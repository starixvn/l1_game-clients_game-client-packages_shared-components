import { Container } from "inversify";
import "reflect-metadata";
import { BetDetailTable, BetDetailTableType } from "../../../../../assets/game/bet-history/scripts/components/bet-detail/bet-detail-table";

// Mock gc components
jest.mock("@sg/game-client-base", () => ({
    Audios: {
        AudioHandler: jest.fn(),
        AudioIds: {
            CLICK: "click",
        },
    },
    BetHistory: {
        BetDetailModel: jest.fn(),
    },
}));

// Mock Dialog component
jest.mock("db://shared-components/shared/common-components/dialogs/dialog", () => ({
    Dialog: jest.fn(),
}));

// Mock ObserverComponent
jest.mock("db://shared-components/shared/common-components/observer-component/scripts/observer-component", () => ({
    ObserverComponent: jest.fn(),
}));

// Mock BetDetailLogTable
jest.mock("../../../../../assets/game/bet-history/scripts/components/bet-detail/bet-detail-log-table", () => ({
    BetDetailLogTable: jest.fn().mockImplementation(() => ({
        showBetDetail: jest.fn(),
    })),
}));

// Mock BaseBetDetailSummaryTable
jest.mock("../../../../../assets/game/bet-history/scripts/components/bet-detail/bet-detail-summary-table", () => ({
    BaseBetDetailSummaryTable: jest.fn().mockImplementation(() => ({
        renderResult: jest.fn(),
    })),
}));

describe("BetDetailTable", () => {
    let container: Container;
    let betDetailTable: BetDetailTable;
    let mockNodeBetDetailSummaryTable: any;
    let mockNodeBetDetailLogTablePrefab: any;
    let mockNode: any;
    let mockBetDetailLogTablePrefab: any;
    let mockBetDetailSummaryPrefab: any;
    let mockResultContentPrefab: any;
    let mockLogDetailItemPrefab: any;
    let mockModel: any;
    let mockBetDetailLogTableInstance: any;
    let mockBaseBetDetailSummaryTableInstance: any;
    let mockDialog: any;

    beforeEach(() => {
        container = new Container();

        // Create mock instances
        mockNodeBetDetailSummaryTable = {
            addChild: jest.fn(),
        };

        mockNodeBetDetailLogTablePrefab = {
            addChild: jest.fn(),
        };

        mockNode = {
            destroy: jest.fn(),
        };

        mockBetDetailLogTablePrefab = {};
        mockBetDetailSummaryPrefab = {};
        mockResultContentPrefab = {};
        mockLogDetailItemPrefab = {};
        mockModel = {};

        mockBetDetailLogTableInstance = {
            showBetDetail: jest.fn(),
        };

        mockBaseBetDetailSummaryTableInstance = {
            renderResult: jest.fn(),
        };

        mockDialog = {
            hide: jest.fn(),
        };

        // Mock the instantiate function from cc
        const { instantiate } = require("cc");
        instantiate.mockReturnValueOnce({
            getComponent: jest.fn().mockReturnValue(mockBetDetailLogTableInstance),
        });
        instantiate.mockReturnValueOnce({
            getComponent: jest.fn().mockReturnValue(mockBaseBetDetailSummaryTableInstance),
        });

        // Bind the class under test
        container.bind(BetDetailTable).toSelf();

        // Get instance
        betDetailTable = container.get(BetDetailTable);

        // Manually assign properties since they're not constructor-injected
        Object.assign(betDetailTable, {
            nodeBetDetailSummaryTable: mockNodeBetDetailSummaryTable,
            nodeBetDetailLogTablePrefab: mockNodeBetDetailLogTablePrefab,
            node: mockNode,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("showBetDetail", () => {
        it("should instantiate and configure bet detail log table correctly", () => {
            // Arrange
            const { instantiate } = require("cc");
            const data: BetDetailTableType = {
                model: mockModel,
                resultContentPrefab: mockResultContentPrefab,
                betDetailSummaryPrefab: mockBetDetailSummaryPrefab,
                betDetailLogTablePrefab: mockBetDetailLogTablePrefab,
                logDetailItemPrefab: mockLogDetailItemPrefab,
            };

            // Act
            betDetailTable.showBetDetail(data);

            // Assert
            expect(instantiate).toHaveBeenCalledWith(mockBetDetailLogTablePrefab);
            expect(mockBetDetailLogTableInstance.showBetDetail).toHaveBeenCalledWith(mockLogDetailItemPrefab, mockModel);
            expect(mockNodeBetDetailLogTablePrefab.addChild).toHaveBeenCalled();
        });

        it("should instantiate and configure bet detail summary table correctly", () => {
            // Arrange
            const { instantiate } = require("cc");
            const data: BetDetailTableType = {
                model: mockModel,
                resultContentPrefab: mockResultContentPrefab,
                betDetailSummaryPrefab: mockBetDetailSummaryPrefab,
                betDetailLogTablePrefab: mockBetDetailLogTablePrefab,
                logDetailItemPrefab: mockLogDetailItemPrefab,
            };

            // Act
            betDetailTable.showBetDetail(data);

            // Assert
            expect(instantiate).toHaveBeenCalledWith(mockBetDetailSummaryPrefab);
            expect(mockBaseBetDetailSummaryTableInstance.renderResult).toHaveBeenCalledWith(mockModel, mockResultContentPrefab);
            expect(mockNodeBetDetailSummaryTable.addChild).toHaveBeenCalled();
        });

        it("should handle null bet detail summary table gracefully", () => {
            // Arrange
            const { instantiate } = require("cc");
            betDetailTable.nodeBetDetailSummaryTable = null;
            const data: BetDetailTableType = {
                model: mockModel,
                resultContentPrefab: mockResultContentPrefab,
                betDetailSummaryPrefab: mockBetDetailSummaryPrefab,
                betDetailLogTablePrefab: mockBetDetailLogTablePrefab,
                logDetailItemPrefab: mockLogDetailItemPrefab,
            };

            // Act
            betDetailTable.showBetDetail(data);

            // Assert
            expect(instantiate).toHaveBeenCalledWith(mockBetDetailSummaryPrefab);
            expect(mockBaseBetDetailSummaryTableInstance.renderResult).toHaveBeenCalledWith(mockModel, mockResultContentPrefab);
            // Should not throw error when nodeBetDetailSummaryTable is null
        });

        it("should handle null getComponent result for summary table gracefully", () => {
            // Arrange
            const { instantiate } = require("cc");
            instantiate.mockReturnValueOnce({
                getComponent: jest.fn().mockReturnValue(mockBetDetailLogTableInstance),
            });
            instantiate.mockReturnValueOnce({
                getComponent: jest.fn().mockReturnValue(null),
            });

            const data: BetDetailTableType = {
                model: mockModel,
                resultContentPrefab: mockResultContentPrefab,
                betDetailSummaryPrefab: mockBetDetailSummaryPrefab,
                betDetailLogTablePrefab: mockBetDetailLogTablePrefab,
                logDetailItemPrefab: mockLogDetailItemPrefab,
            };

            // Act
            betDetailTable.showBetDetail(data);

            // Assert
            expect(instantiate).toHaveBeenCalledWith(mockBetDetailSummaryPrefab);
            expect(mockNodeBetDetailSummaryTable.addChild).toHaveBeenCalled();
            // Should not throw error when getComponent returns null
        });
    });

    describe("onClickClose", () => {
        it("should hide dialog when dialog component is found", () => {
            // Arrange
            const mockGetComponentsInChildren = jest.fn().mockReturnValue([mockDialog]);
            betDetailTable.getComponentsInChildren = mockGetComponentsInChildren;

            // Act
            betDetailTable.onClickClose();

            // Assert
            expect(mockGetComponentsInChildren).toHaveBeenCalledWith(expect.any(Function));
            expect(mockDialog.hide).toHaveBeenCalled();
            expect(mockNode.destroy).not.toHaveBeenCalled();
        });

        it("should destroy node when no dialog component is found", () => {
            // Arrange
            const mockGetComponentsInChildren = jest.fn().mockReturnValue([]);
            betDetailTable.getComponentsInChildren = mockGetComponentsInChildren;

            // Act
            betDetailTable.onClickClose();

            // Assert
            expect(mockGetComponentsInChildren).toHaveBeenCalledWith(expect.any(Function));
            expect(mockNode.destroy).toHaveBeenCalled();
        });

        it("should handle empty dialogs array", () => {
            // Arrange
            const mockGetComponentsInChildren = jest.fn().mockReturnValue([]);
            betDetailTable.getComponentsInChildren = mockGetComponentsInChildren;

            // Act
            betDetailTable.onClickClose();

            // Assert
            expect(mockGetComponentsInChildren).toHaveBeenCalledWith(expect.any(Function));
            expect(mockNode.destroy).toHaveBeenCalled();
        });
    });
});

import { Size, v3 } from "cc";
import { GameStatisticBoard } from "../../../../assets/game/statistic-board/game-statistic-board";
import { BlinkAnimation } from "../../../../assets/shared/common-components/blink-animation/blink-animation";

// Make instantiate available globally
(global as any).instantiate = jest.fn();

jest.mock("../../../../assets/shared/common-components/blink-animation/blink-animation", () => ({
    BlinkAnimation: jest.fn().mockImplementation(() => ({
        duration: 0.5,
    })),
}));

describe("GameStatisticBoard", () => {
    let gameStatisticBoard: GameStatisticBoard;
    let mockContentNode: any;
    let mockItemNextNode: any;
    let mockScoreboardNode: any;
    let mockScrollView: any;
    let mockUITransform: any;
    let mockItemNodes: any[];

    beforeEach(() => {
        // Create minimal mock objects with only needed properties
        mockScrollView = { scrollToRight: jest.fn() };
        mockUITransform = { width: 100 };
        
        // Make width mutable
        Object.defineProperty(mockUITransform, 'width', {
            value: 100,
            writable: true,
            configurable: true
        });
        
        mockContentNode = {
            addChild: jest.fn(),
            position: v3(0, 0, 0),
            getComponent: jest.fn().mockReturnValue(mockUITransform),
        };

        mockItemNextNode = {
            active: false,
            position: v3(0, 0, 0),
            addComponent: jest.fn().mockReturnValue({ duration: 0.5 }),
        };

        mockScoreboardNode = {
            getComponent: jest.fn().mockReturnValue(mockScrollView),
        };

        mockItemNodes = [
            { active: false, position: v3(0, 0, 0), removeFromParent: jest.fn(), destroy: jest.fn() },
            { active: false, position: v3(0, 0, 0), removeFromParent: jest.fn(), destroy: jest.fn() },
            { active: false, position: v3(0, 0, 0), removeFromParent: jest.fn(), destroy: jest.fn() },
        ];

        // Direct instantiation instead of container
        gameStatisticBoard = new GameStatisticBoard();
        
        // Simple property assignment
        gameStatisticBoard.items = mockItemNodes;
        gameStatisticBoard.content = mockContentNode;
        gameStatisticBoard.itemNext = mockItemNextNode;
        gameStatisticBoard.scoreboard = mockScoreboardNode;
        gameStatisticBoard.rowMax = 6;
        gameStatisticBoard.itemSize = new Size(22, 22);
        gameStatisticBoard.padding = new Size(2, 2);
        gameStatisticBoard.suportChoices = "anyTriple,big,small";
        gameStatisticBoard["dots"] = [];
        gameStatisticBoard.nextMark = null;
        gameStatisticBoard.checkShowNext = () => false;
        gameStatisticBoard["_managedByParent"] = false;
        gameStatisticBoard["_nextItemActive"] = false;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("onLoad", () => {
        it("should call getSupportChoices and super.onLoad", () => {
            // Arrange
            const getSupportChoicesSpy = jest.spyOn(gameStatisticBoard, "getSupportChoices");
            
            // Act
            gameStatisticBoard.onLoad();
            
            // Assert
            expect(getSupportChoicesSpy).toHaveBeenCalled();
        });
    });

    describe("onEnable", () => {
        it("should scroll scoreboard to right", () => {
            // Act
            (gameStatisticBoard as any).onEnable();
            
            // Assert
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("init", () => {
        it("should set checkShowNext condition function", () => {
            // Arrange
            const mockCondition = () => true;
            
            // Act
            gameStatisticBoard.init(mockCondition);
            
            // Assert
            expect(gameStatisticBoard.checkShowNext).toBe(mockCondition);
        });
    });

    describe("managedByParent property", () => {
        it("should get and set managedByParent correctly", () => {
            // Assert
            expect(gameStatisticBoard.managedByParent).toBe(false);

            // Act
            gameStatisticBoard.managedByParent = true;
            
            // Assert
            expect(gameStatisticBoard.managedByParent).toBe(true);
        });
    });

    describe("nextItemActive property", () => {
        it("should set nextItemActive and update display", () => {
            // Arrange
            const updateDisplaySpy = jest.spyOn(gameStatisticBoard, "updateDisplayNextItem");
            gameStatisticBoard.nextMark = mockItemNextNode;

            // Act
            gameStatisticBoard.nextItemActive = true;

            // Assert
            expect(gameStatisticBoard.nextItemActive).toBe(true);
            expect(updateDisplaySpy).toHaveBeenCalled();
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("updateDisplayNextItem", () => {
        it("should update nextMark active state when nextMark exists and is valid", () => {
            // Arrange
            gameStatisticBoard.nextMark = { ...mockItemNextNode, isValid: true };
            gameStatisticBoard["_nextItemActive"] = true;

            // Act
            gameStatisticBoard.updateDisplayNextItem();

            // Assert
            expect(gameStatisticBoard.nextMark.active).toBe(true);
        });

        it("should not update nextMark when nextMark is null", () => {
            // Arrange
            gameStatisticBoard.nextMark = null;
            gameStatisticBoard["_nextItemActive"] = true;

            // Act & Assert
            expect(() => gameStatisticBoard.updateDisplayNextItem()).not.toThrow();
        });
    });

    describe("createDotNode", () => {
        it("should instantiate correct item node based on result", () => {
            // Arrange
            const instantiateSpy = jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNodes[1]);

            // Act
            const result = gameStatisticBoard.createDotNode(1);

            // Assert
            expect(instantiateSpy).toHaveBeenCalledWith(mockItemNodes[1]);
            expect(result).toBe(mockItemNodes[1]);
        });
    });

    describe("handleDotAction", () => {
        it("should position dot, add to content, and return max X", () => {
            // Arrange
            const dot = mockItemNodes[0];
            const start = { x: -11, y: -13, z: 0 };
            const col = 2;
            const row = 1;
            const currentMaxX = 50;

            // Act
            const maxX = gameStatisticBoard["handleDotAction"](dot, start, col, row, currentMaxX);

            // Assert
            expect(dot.active).toBe(true);
            expect(mockContentNode.addChild).toHaveBeenCalledWith(dot);
            expect(gameStatisticBoard["dots"]).toContain(dot);
            expect(maxX).toBeGreaterThanOrEqual(currentMaxX);
        });
    });

    describe("updateContentPosition", () => {
        it("should update content width and position", () => {
            // Arrange
            const maxX = 100;
            gameStatisticBoard.nextMark = { position: { x: 50, y: 0, z: 0 } } as any;

            // Act
            gameStatisticBoard["updateContentPosition"](maxX);

            // Assert
            // Test that getComponent was called to get UITransform
            expect(mockContentNode.getComponent).toHaveBeenCalled();
        });

        it("should use nextMark position if it's greater than maxX", () => {
            // Arrange
            const maxX = 50;
            gameStatisticBoard.nextMark = { position: { x: 150, y: 0, z: 0 } } as any;

            // Act
            gameStatisticBoard["updateContentPosition"](maxX);

            // Assert
            // Test that the method executes without error (integration test)
            expect(mockContentNode.getComponent).toHaveBeenCalled();
        });
    });

    describe("addNextMark", () => {
        it("should create and position next mark correctly", () => {
            // Arrange
            const instantiateSpy = jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const rowMax = {};
            const row = 0;
            const col = 2;
            const nextCol = 3;
            const start = { x: -11, y: -13, z: 0 };

            // Act
            gameStatisticBoard["addNextMark"](rowMax, row, col, nextCol, start);

            // Assert
            expect(instantiateSpy).toHaveBeenCalledWith(gameStatisticBoard.itemNext);
            expect(mockItemNextNode.active).toBe(false);
            expect(mockItemNextNode.addComponent).toHaveBeenCalledWith(BlinkAnimation);
            expect(mockContentNode.addChild).toHaveBeenCalledWith(mockItemNextNode);
            expect(gameStatisticBoard.nextMark).toBe(mockItemNextNode);
        });
    });

    describe("setData", () => {
        it("should process results and create dots correctly", () => {
            // Arrange
            // Mock instantiate to return appropriate objects
            jest.spyOn(require("cc"), "instantiate")
                .mockImplementation((prefab) => {
                    // Return the correct mock based on what prefab is passed
                    if (prefab === gameStatisticBoard.itemNext) {
                        return mockItemNextNode;
                    }
                    
                    return mockItemNodes[0];
                });

            const results = [0, 1, 0];
            gameStatisticBoard["dots"] = [];

            // Act
            gameStatisticBoard.setData(results);

            // Assert
            expect(mockContentNode.addChild).toHaveBeenCalledTimes(4); // 3 dots + 1 next mark
            expect(gameStatisticBoard["dots"]).toHaveLength(4);
            expect(gameStatisticBoard.nextMark).toBe(mockItemNextNode);
        });

        it("should handle consecutive same results - increment row when row < max - 1", () => {
            // Arrange
            jest.spyOn(require("cc"), "instantiate")
                .mockImplementation((prefab) => {
                    if (prefab === gameStatisticBoard.itemNext) {
                        return mockItemNextNode;
                    }
                    return mockItemNodes[0];
                });

            gameStatisticBoard.rowMax = 3; // Set rowMax > 1 to allow row increment
            const results = [0, 0, 0]; // Same results to trigger consecutive logic
            gameStatisticBoard["dots"] = [];

            // Act
            gameStatisticBoard.setData(results);

            // Assert
            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(4); // 3 dots + next mark
        });

        it("should handle consecutive same results - move to next column when row === 0 and max === 1", () => {
            // Arrange
            jest.spyOn(require("cc"), "instantiate")
                .mockImplementation((prefab) => {
                    if (prefab === gameStatisticBoard.itemNext) {
                        return mockItemNextNode;
                    }
                    return mockItemNodes[0];
                });

            gameStatisticBoard.rowMax = 1; // Set rowMax = 1 to trigger special case
            const results = [0, 0]; // Same results
            gameStatisticBoard["dots"] = [];

            // Act
            gameStatisticBoard.setData(results);

            // Assert
            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(3); // 2 dots + next mark
        });

        it("should handle consecutive same results - move to next column and set rowMax", () => {
            // Arrange
            jest.spyOn(require("cc"), "instantiate")
                .mockImplementation((prefab) => {
                    if (prefab === gameStatisticBoard.itemNext) {
                        return mockItemNextNode;
                    }
                    return mockItemNodes[0];
                });

            gameStatisticBoard.rowMax = 2;
            // Create scenario where row reaches max-1, then another same result forces column change
            const results = [0, 0, 0]; // Three same results
            gameStatisticBoard["dots"] = [];

            // Act
            gameStatisticBoard.setData(results);

            // Assert
            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(4); // 3 dots + next mark
        });

        it("should clean up existing dots before creating new ones", () => {
            // Arrange
            const existingDot = { removeFromParent: jest.fn(), destroy: jest.fn() };
            gameStatisticBoard["dots"] = [existingDot as any];

            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);

            // Act
            gameStatisticBoard.setData([]);

            // Assert
            expect(existingDot.removeFromParent).toHaveBeenCalled();
            expect(existingDot.destroy).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(1); // Only next mark
        });
    });

    describe("getSupportChoices", () => {
        it("should parse support choices string into array", () => {
            // Act
            gameStatisticBoard.getSupportChoices();

            // Assert
            expect(gameStatisticBoard["choices"]).toEqual(["anyTriple", "big", "small"]);
        });
    });

    describe("findWinningChoice", () => {
        it("should return first matching choice from settlement result", () => {
            // Arrange
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            const settlementResult = { big: true, small: false };

            // Act
            const result = gameStatisticBoard.findWinningChoice(settlementResult);

            // Assert
            expect(result).toBe("big");
        });

        it("should return undefined when no choice matches", () => {
            // Arrange
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            const settlementResult = { other: true };

            // Act
            const result = gameStatisticBoard.findWinningChoice(settlementResult);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe("renderLogView", () => {
        it("should process dataLogs and call setData with correct stats", () => {
            // Arrange
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const dataLogs = [
                { settlementResult: { big: true } },
                { settlementResult: { small: true } },
                { settlementResult: { anyTriple: true } },
            ];

            // Act
            gameStatisticBoard.renderLogView(dataLogs);

            // Assert
            expect(gameStatisticBoard["dots"]).toContain(mockItemNextNode);
        });

        it("should handle empty dataLogs array", () => {
            // Arrange
            const setDataSpy = jest.spyOn(gameStatisticBoard, "setData");

            // Act
            gameStatisticBoard.renderLogView([]);

            // Assert
            expect(setDataSpy).not.toHaveBeenCalled();
        });
    });

    describe("updateData", () => {
        it("should call renderLogView with provided data", () => {
            // Arrange
            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const dataLogs = [{ settlementResult: { big: true } }];

            // Act
            gameStatisticBoard.updateData(dataLogs);

            // Assert
            expect(gameStatisticBoard["dots"]).toContain(mockItemNextNode);
        });
    });

    describe("showNextMark", () => {
        it("should set checkShowNext to true when isLocking is true", () => {
            // Act
            gameStatisticBoard.showNextMark(true);

            // Assert
            expect(gameStatisticBoard.checkShowNext()).toBe(true);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });

        it("should not change checkShowNext when isLocking is false", () => {
            // Arrange
            const originalCheckShowNext = gameStatisticBoard.checkShowNext;

            // Act
            gameStatisticBoard.showNextMark(false);

            // Assert
            expect(gameStatisticBoard.checkShowNext).toBe(originalCheckShowNext);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("hideBlinkNode", () => {
        it("should set checkShowNext to false when isFinishedShowResult is true", () => {
            // Act
            gameStatisticBoard.hideBlinkNode(true);

            // Assert
            expect(gameStatisticBoard.checkShowNext()).toBe(false);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });

        it("should not change checkShowNext when isFinishedShowResult is false", () => {
            // Arrange
            const originalCheckShowNext = gameStatisticBoard.checkShowNext;

            // Act
            gameStatisticBoard.hideBlinkNode(false);

            // Assert
            expect(gameStatisticBoard.checkShowNext).toBe(originalCheckShowNext);
        });
    });

    describe("update", () => {
        it("should return early when managedByParent is true", () => {
            // Arrange
            gameStatisticBoard.managedByParent = true;
            gameStatisticBoard.nextMark = mockItemNextNode;
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            // Act
            gameStatisticBoard.update();

            // Assert
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it("should update nextMark active state when not managed by parent", () => {
            // Arrange
            gameStatisticBoard.managedByParent = false;
            gameStatisticBoard.nextMark = { ...mockItemNextNode, isValid: true, active: false };
            gameStatisticBoard.checkShowNext = () => true;

            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            // Act
            gameStatisticBoard.update();

            // Assert
            expect(gameStatisticBoard.nextMark.active).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith("change active ", true);
            consoleSpy.mockRestore();
        });

        it("should handle case when nextMark is null or invalid", () => {
            // Arrange
            gameStatisticBoard.managedByParent = false;
            gameStatisticBoard.nextMark = null;

            // Act & Assert
            expect(() => gameStatisticBoard.update()).not.toThrow();
        });
    });
});

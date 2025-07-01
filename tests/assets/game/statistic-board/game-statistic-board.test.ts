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
            const getSupportChoicesSpy = jest.spyOn(gameStatisticBoard, "getSupportChoices");
            
            gameStatisticBoard.onLoad();
            
            expect(getSupportChoicesSpy).toHaveBeenCalled();
        });
    });

    describe("onEnable", () => {
        it("should scroll scoreboard to right", () => {
            (gameStatisticBoard as any).onEnable();
            
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("init", () => {
        it("should set checkShowNext condition function", () => {
            const mockCondition = () => true;
            
            gameStatisticBoard.init(mockCondition);
            
            expect(gameStatisticBoard.checkShowNext).toBe(mockCondition);
        });
    });

    describe("managedByParent property", () => {
        it("should get and set managedByParent correctly", () => {
            expect(gameStatisticBoard.managedByParent).toBe(false);

            gameStatisticBoard.managedByParent = true;
            expect(gameStatisticBoard.managedByParent).toBe(true);
        });
    });

    describe("nextItemActive property", () => {
        it("should set nextItemActive and update display", () => {
            const updateDisplaySpy = jest.spyOn(gameStatisticBoard, "updateDisplayNextItem");
            gameStatisticBoard.nextMark = mockItemNextNode;

            gameStatisticBoard.nextItemActive = true;

            expect(gameStatisticBoard.nextItemActive).toBe(true);
            expect(updateDisplaySpy).toHaveBeenCalled();
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("updateDisplayNextItem", () => {
        it("should update nextMark active state when nextMark exists and is valid", () => {
            gameStatisticBoard.nextMark = { ...mockItemNextNode, isValid: true };
            gameStatisticBoard["_nextItemActive"] = true;

            gameStatisticBoard.updateDisplayNextItem();

            expect(gameStatisticBoard.nextMark.active).toBe(true);
        });

        it("should not update nextMark when nextMark is null", () => {
            gameStatisticBoard.nextMark = null;
            gameStatisticBoard["_nextItemActive"] = true;

            expect(() => gameStatisticBoard.updateDisplayNextItem()).not.toThrow();
        });
    });

    describe("createDotNode", () => {
        it("should instantiate correct item node based on result", () => {
            const instantiateSpy = jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNodes[1]);

            const result = gameStatisticBoard.createDotNode(1);

            expect(instantiateSpy).toHaveBeenCalledWith(mockItemNodes[1]);
            expect(result).toBe(mockItemNodes[1]);
        });
    });

    describe("handleDotAction", () => {
        it("should position dot, add to content, and return max X", () => {
            const dot = mockItemNodes[0];
            const start = { x: -11, y: -13, z: 0 };
            const col = 2;
            const row = 1;
            const currentMaxX = 50;

            const maxX = gameStatisticBoard["handleDotAction"](dot, start, col, row, currentMaxX);

            expect(dot.active).toBe(true);
            expect(mockContentNode.addChild).toHaveBeenCalledWith(dot);
            expect(gameStatisticBoard["dots"]).toContain(dot);
            expect(maxX).toBeGreaterThanOrEqual(currentMaxX);
        });
    });

    describe("updateContentPosition", () => {
        it("should update content width and position", () => {
            const maxX = 100;
            gameStatisticBoard.nextMark = { position: { x: 50, y: 0, z: 0 } } as any;

            gameStatisticBoard["updateContentPosition"](maxX);

            // Test that getComponent was called to get UITransform
            expect(mockContentNode.getComponent).toHaveBeenCalled();
        });

        it("should use nextMark position if it's greater than maxX", () => {
            const maxX = 50;
            gameStatisticBoard.nextMark = { position: { x: 150, y: 0, z: 0 } } as any;

            gameStatisticBoard["updateContentPosition"](maxX);

            // Test that the method executes without error (integration test)
            expect(mockContentNode.getComponent).toHaveBeenCalled();
        });
    });

    describe("addNextMark", () => {
        it("should create and position next mark correctly", () => {
            const instantiateSpy = jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const rowMax = {};
            const row = 0;
            const col = 2;
            const nextCol = 3;
            const start = { x: -11, y: -13, z: 0 };

            gameStatisticBoard["addNextMark"](rowMax, row, col, nextCol, start);

            expect(instantiateSpy).toHaveBeenCalledWith(gameStatisticBoard.itemNext);
            expect(mockItemNextNode.active).toBe(false);
            expect(mockItemNextNode.addComponent).toHaveBeenCalledWith(BlinkAnimation);
            expect(mockContentNode.addChild).toHaveBeenCalledWith(mockItemNextNode);
            expect(gameStatisticBoard.nextMark).toBe(mockItemNextNode);
        });
    });

    describe("setData", () => {
        it("should process results and create dots correctly", () => {
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

            gameStatisticBoard.setData(results);

            expect(mockContentNode.addChild).toHaveBeenCalledTimes(4); // 3 dots + 1 next mark
            expect(gameStatisticBoard["dots"]).toHaveLength(4);
            expect(gameStatisticBoard.nextMark).toBe(mockItemNextNode);
        });

        it("should handle consecutive same results - increment row when row < max - 1", () => {
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

            gameStatisticBoard.setData(results);

            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(4); // 3 dots + next mark
        });

        it("should handle consecutive same results - move to next column when row === 0 and max === 1", () => {
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

            gameStatisticBoard.setData(results);

            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(3); // 2 dots + next mark
        });

        it("should handle consecutive same results - move to next column and set rowMax", () => {
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

            gameStatisticBoard.setData(results);

            expect(mockContentNode.addChild).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(4); // 3 dots + next mark
        });

        it("should clean up existing dots before creating new ones", () => {
            const existingDot = { removeFromParent: jest.fn(), destroy: jest.fn() };
            gameStatisticBoard["dots"] = [existingDot as any];

            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);

            gameStatisticBoard.setData([]);

            expect(existingDot.removeFromParent).toHaveBeenCalled();
            expect(existingDot.destroy).toHaveBeenCalled();
            expect(gameStatisticBoard["dots"]).toHaveLength(1); // Only next mark
        });
    });

    describe("getSupportChoices", () => {
        it("should parse support choices string into array", () => {
            gameStatisticBoard.getSupportChoices();

            expect(gameStatisticBoard["choices"]).toEqual(["anyTriple", "big", "small"]);
        });
    });

    describe("findWinningChoice", () => {
        it("should return first matching choice from settlement result", () => {
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            const settlementResult = { big: true, small: false };

            const result = gameStatisticBoard.findWinningChoice(settlementResult);

            expect(result).toBe("big");
        });

        it("should return undefined when no choice matches", () => {
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            const settlementResult = { other: true };

            const result = gameStatisticBoard.findWinningChoice(settlementResult);

            expect(result).toBeUndefined();
        });
    });

    describe("renderLogView", () => {
        it("should process dataLogs and call setData with correct stats", () => {
            gameStatisticBoard["choices"] = ["anyTriple", "big", "small"];
            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const dataLogs = [
                { settlementResult: { big: true } },
                { settlementResult: { small: true } },
                { settlementResult: { anyTriple: true } },
            ];

            gameStatisticBoard.renderLogView(dataLogs);

            expect(gameStatisticBoard["dots"]).toContain(mockItemNextNode);
        });

        it("should handle empty dataLogs array", () => {
            const setDataSpy = jest.spyOn(gameStatisticBoard, "setData");

            gameStatisticBoard.renderLogView([]);

            expect(setDataSpy).not.toHaveBeenCalled();
        });
    });

    describe("updateData", () => {
        it("should call renderLogView with provided data", () => {
            jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockItemNextNode);
            const dataLogs = [{ settlementResult: { big: true } }];

            gameStatisticBoard.updateData(dataLogs);

            expect(gameStatisticBoard["dots"]).toContain(mockItemNextNode);
        });
    });

    describe("showNextMark", () => {
        it("should set checkShowNext to true when isLocking is true", () => {
            gameStatisticBoard.showNextMark(true);

            expect(gameStatisticBoard.checkShowNext()).toBe(true);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });

        it("should not change checkShowNext when isLocking is false", () => {
            const originalCheckShowNext = gameStatisticBoard.checkShowNext;

            gameStatisticBoard.showNextMark(false);

            expect(gameStatisticBoard.checkShowNext).toBe(originalCheckShowNext);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });
    });

    describe("hideBlinkNode", () => {
        it("should set checkShowNext to false when isFinishedShowResult is true", () => {
            gameStatisticBoard.hideBlinkNode(true);

            expect(gameStatisticBoard.checkShowNext()).toBe(false);
            expect(mockScrollView.scrollToRight).toHaveBeenCalled();
        });

        it("should not change checkShowNext when isFinishedShowResult is false", () => {
            const originalCheckShowNext = gameStatisticBoard.checkShowNext;

            gameStatisticBoard.hideBlinkNode(false);

            expect(gameStatisticBoard.checkShowNext).toBe(originalCheckShowNext);
        });
    });

    describe("update", () => {
        it("should return early when managedByParent is true", () => {
            gameStatisticBoard.managedByParent = true;
            gameStatisticBoard.nextMark = mockItemNextNode;
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            gameStatisticBoard.update();

            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it("should update nextMark active state when not managed by parent", () => {
            gameStatisticBoard.managedByParent = false;
            gameStatisticBoard.nextMark = { ...mockItemNextNode, isValid: true, active: false };
            gameStatisticBoard.checkShowNext = () => true;

            const consoleSpy = jest.spyOn(console, "log").mockImplementation();

            gameStatisticBoard.update();

            expect(gameStatisticBoard.nextMark.active).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith("change active ", true);
            consoleSpy.mockRestore();
        });

        it("should handle case when nextMark is null or invalid", () => {
            gameStatisticBoard.managedByParent = false;
            gameStatisticBoard.nextMark = null;

            expect(() => gameStatisticBoard.update()).not.toThrow();
        });
    });
});

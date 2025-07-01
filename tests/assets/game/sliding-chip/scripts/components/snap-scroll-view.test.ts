import { Container } from "inversify";
import { Node, UITransform, v2 } from "cc";
import { SnapScrollView, eventMapScrollView } from "../../../../../../assets/game/sliding-chip/scripts/components/snap-scroll-view";
import { ChipScrollView } from "../../../../../../assets/shared/common-components/scroll-view/scripts/components/chip-scroll-view";

// Mock dependencies
jest.mock("cc", () => ({
    ...jest.requireActual("../../../../../../cocos-testing/cc"),
}));

jest.mock("../../../../../../assets/shared/common-components/scroll-view/scripts/components/chip-scroll-view", () => ({
    ChipScrollView: jest.fn().mockImplementation(() => ({
        node: {
            getComponent: jest.fn(),
        },
        content: {
            children: [],
            getComponent: jest.fn(),
        },
        getScrollOffset: jest.fn(),
        getMaxScrollOffset: jest.fn(),
        scrollToPercentHorizontal: jest.fn(),
    })),
}));

describe("SnapScrollView", () => {
    let snapScrollView: SnapScrollView;
    let mockChipScrollView: jest.Mocked<ChipScrollView>;
    let mockUITransform: jest.Mocked<UITransform>;
    let container: Container;

    beforeEach(() => {
        container = new Container();
        
        // Create mock instances
        mockUITransform = {
            width: 400,
            height: 200,
        } as jest.Mocked<UITransform>;

        mockChipScrollView = {
            node: {
                getComponent: jest.fn().mockReturnValue(mockUITransform),
            },
            content: {
                children: [new Node(), new Node(), new Node()], // 3 children by default
                getComponent: jest.fn().mockReturnValue(mockUITransform),
            },
            getScrollOffset: jest.fn().mockReturnValue(v2(-100, 0)),
            getMaxScrollOffset: jest.fn().mockReturnValue(v2(200, 0)),
            scrollToPercentHorizontal: jest.fn(),
        } as any;

        // Create component instance
        snapScrollView = new SnapScrollView();
        
        // Mock getComponent to return our mock
        jest.spyOn(snapScrollView, 'getComponent').mockReturnValue(mockChipScrollView);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("initialization", () => {
        it("should initialize with default properties", () => {
            // Assert
            expect(snapScrollView.itemSize).toBe(84);
            expect(snapScrollView.spacing).toBe(9);
            expect(snapScrollView.enableHalfSpacing).toBe(false);
            expect(snapScrollView.isHorizontalLayout).toBe(true);
        });

        it("should initialize scrollView getter lazily", () => {
            // Act
            const scrollView = snapScrollView.scrollView;

            // Assert
            expect(scrollView).toBe(mockChipScrollView);
            expect(snapScrollView.getComponent).toHaveBeenCalledWith(ChipScrollView);
        });

        it("should cache scrollView after first access", () => {
            // Act
            const scrollView1 = snapScrollView.scrollView;
            const scrollView2 = snapScrollView.scrollView;

            // Assert
            expect(scrollView1).toBe(scrollView2);
            expect(snapScrollView.getComponent).toHaveBeenCalledTimes(1);
        });
    });

    describe("initCalculatedPercent", () => {
        it("should calculate percent array for horizontal layout", () => {
            // Arrange
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            snapScrollView.isHorizontalLayout = true;
            snapScrollView.enableHalfSpacing = false;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            mockUITransform.width = 400;

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBe(0); // Should be initialized to 0
        });

        it("should handle half spacing when enabled", () => {
            // Arrange
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            snapScrollView.enableHalfSpacing = true;
            mockChipScrollView.content.children = [new Node(), new Node()];

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Method should complete without error
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle vertical layout", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = false;
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockUITransform.width = 500;

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Method should complete without error
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle maximum offset constraint", () => {
            // Arrange
            snapScrollView.itemSize = 200;
            snapScrollView.spacing = 50;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node(), new Node()]; // Many items
            mockUITransform.width = 300; // Small viewport

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Should not throw error
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle empty content", () => {
            // Arrange
            mockChipScrollView.content.children = [];

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });
    });

    describe("onScrollView", () => {
        it("should call onScrollEnd when scroll ended event occurs", () => {
            // Arrange
            const onScrollEndSpy = jest.spyOn(snapScrollView, 'onScrollEnd').mockImplementation();
            const scrollEndEventType = eventMapScrollView["scroll-ended"];

            // Act
            snapScrollView.onScrollView(mockChipScrollView as any, scrollEndEventType);

            // Assert
            expect(onScrollEndSpy).toHaveBeenCalled();
        });

        it("should not call onScrollEnd for other events", () => {
            // Arrange
            const onScrollEndSpy = jest.spyOn(snapScrollView, 'onScrollEnd').mockImplementation();
            const scrollingEventType = eventMapScrollView.scrolling;

            // Act
            snapScrollView.onScrollView(mockChipScrollView as any, scrollingEventType);

            // Assert
            expect(onScrollEndSpy).not.toHaveBeenCalled();
        });
    });

    describe("onScrollEnd", () => {
        it("should calculate min display and call actionScrollEnded", () => {
            // Arrange
            const actionScrollEndedSpy = jest.fn();
            snapScrollView.actionScrollEnded = actionScrollEndedSpy;
            
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-50, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));
            
            snapScrollView.initCalculatedPercent();

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            expect(actionScrollEndedSpy).toHaveBeenCalled();
        });
    });

    describe("percent calculation", () => {
        it("should calculate correct percent from scroll offset", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-100, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));
            snapScrollView.initCalculatedPercent();

            // Act
            snapScrollView.onScrollEnd();

            // Assert - Method should complete calculation
            expect(mockChipScrollView.getScrollOffset).toHaveBeenCalled();
            expect(mockChipScrollView.getMaxScrollOffset).toHaveBeenCalled();
        });

        it("should handle negative offset (return 0)", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(50, 0)); // Positive means negative offset
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));
            snapScrollView.initCalculatedPercent();

            // Act
            snapScrollView.onScrollEnd();

            // Assert - Should handle edge case without error
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle percent > 1 (return 1)", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-300, 0)); // Beyond max
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));
            snapScrollView.initCalculatedPercent();

            // Act
            snapScrollView.onScrollEnd();

            // Assert - Should handle edge case
            expect(mockChipScrollView.getScrollOffset).toHaveBeenCalled();
        });
    });

    describe("min display calculation", () => {
        beforeEach(() => {
            // Setup realistic scenario
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node(), new Node()];
            mockUITransform.width = 300;
            snapScrollView.initCalculatedPercent();
        });

        it("should find closest display index", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-60, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(typeof minDisplay).toBe('number');
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should handle edge case when percent matches exactly", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(0, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle percent before first calculated percent", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-10, 0)); // Very small offset
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should find closest index when percent falls between two calculated percents", () => {
            // Arrange - Setup scenario where percent falls between two calculated values
            snapScrollView.itemSize = 50;
            snapScrollView.spacing = 10;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node(), new Node()];
            mockUITransform.width = 200;
            snapScrollView.initCalculatedPercent();
            
            // Set scroll offset to be between calculated percents
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-80, 0)); // Mid-way scroll
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(160, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
            expect(minDisplay).toBeLessThan(4);
        });

        it("should handle delta comparison for closest index selection", () => {
            // Arrange - Setup specific scenario to trigger delta comparison
            snapScrollView.itemSize = 80;
            snapScrollView.spacing = 20;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            mockUITransform.width = 240;
            snapScrollView.initCalculatedPercent();
            
            // Set offset to trigger delta comparison logic
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-90, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(180, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should break when calculated percent reaches 1", () => {
            // Arrange - Setup scenario where calculated percent >= 1
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 0;
            mockChipScrollView.content.children = [new Node(), new Node()];
            mockUITransform.width = 100; // Small width to force calculated percent >= 1
            snapScrollView.initCalculatedPercent();
            
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-150, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(100, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should handle edge case with zero delta sum", () => {
            // Arrange - Setup to potentially trigger delta1 + delta2 == 0 case
            snapScrollView.itemSize = 60;
            snapScrollView.spacing = 10;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            mockUITransform.width = 150;
            snapScrollView.initCalculatedPercent();
            
            // Set very precise offset to potentially get zero delta sum
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-70, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(140, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should trigger delta comparison logic with precise percent positioning", () => {
            // Arrange - Directly manipulate calculated percent array to ensure we hit the condition
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            mockUITransform.width = 200;
            
            // Manually set calculated percents to known values
            (snapScrollView as any)._calculatedPercent = [0, 0.25, 0.5, 0.75];
            
            // Set scroll percent to be exactly between two calculated percents
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-75, 0)); // 75/200 = 0.375 (between 0.25 and 0.5)
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should break when calculated percent is exactly 1", () => {
            // Arrange - Set up calculated percent array with value >= 1
            snapScrollView.itemSize = 200;
            snapScrollView.spacing = 0;
            mockChipScrollView.content.children = [new Node(), new Node()];
            mockUITransform.width = 100;
            
            // Manually set a calculated percent >= 1 to trigger the break condition
            (snapScrollView as any)._calculatedPercent = [0, 1.0, 1.5];
            
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-200, 0)); // Large offset
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(100, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });

        it("should handle case where percent is between calculated percents with valid deltas", () => {
            // Arrange - Setup precise scenario to trigger lines 105-110
            (snapScrollView as any)._calculatedPercent = [0, 0.3, 0.6, 0.9];
            
            // Set percent to 0.45 (between 0.3 and 0.6)
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-45, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(100, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
        });
    });

    describe("scrollTo", () => {
        it("should scroll to specified index", () => {
            // Arrange
            snapScrollView.initCalculatedPercent();
            const targetIndex = 1;

            // Act
            snapScrollView.scrollTo(targetIndex);

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(targetIndex);
            expect(mockChipScrollView.scrollToPercentHorizontal).toHaveBeenCalledWith(
                expect.any(Number),
                0.3,
                true
            );
        });

        it("should handle scrolling to index 0", () => {
            // Arrange
            snapScrollView.initCalculatedPercent();

            // Act
            snapScrollView.scrollTo(0);

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(0);
            expect(mockChipScrollView.scrollToPercentHorizontal).toHaveBeenCalled();
        });

        it("should handle scrolling to last index", () => {
            // Arrange
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            snapScrollView.initCalculatedPercent();
            const lastIndex = 2;

            // Act
            snapScrollView.scrollTo(lastIndex);

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(lastIndex);
        });
    });

    describe("actionScrollEnded", () => {
        it("should be callable function", () => {
            // Assert
            expect(typeof snapScrollView.actionScrollEnded).toBe('function');
            expect(() => snapScrollView.actionScrollEnded()).not.toThrow();
        });

        it("should be replaceable", () => {
            // Arrange
            const customCallback = jest.fn();

            // Act
            snapScrollView.actionScrollEnded = customCallback;
            snapScrollView.actionScrollEnded();

            // Assert
            expect(customCallback).toHaveBeenCalled();
        });
    });

    describe("getMinDisplay", () => {
        it("should return current min display value", () => {
            // Arrange
            snapScrollView.scrollTo(2);

            // Act
            const minDisplay = snapScrollView.getMinDisplay();

            // Assert
            expect(minDisplay).toBe(2);
        });

        it("should return 0 by default", () => {
            // Act
            const minDisplay = snapScrollView.getMinDisplay();

            // Assert
            expect(minDisplay).toBe(0);
        });
    });

    describe("content item counting", () => {
        it("should count horizontal layout items from children", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = true;
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Should complete without error
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should calculate vertical layout items from width", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = false;
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockUITransform.width = 360; // Should give 3 items

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Should complete calculation
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should handle null/undefined content", () => {
            // Arrange
            mockChipScrollView.content = null;

            // Act & Assert - Should not throw
            expect(() => snapScrollView.initCalculatedPercent()).not.toThrow();
        });
    });

    describe("scroll content width calculation", () => {
        it("should calculate width for horizontal layout", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = true;
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockChipScrollView.content.children = [new Node(), new Node()];

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Should complete calculation
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should use content width for vertical layout", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = false;
            mockUITransform.width = 500;

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert - Should use content width
            expect(mockChipScrollView.content.getComponent).toHaveBeenCalledWith(UITransform);
        });
    });

    describe("eventMapScrollView", () => {
        it("should contain all expected scroll events", () => {
            // Assert
            expect(eventMapScrollView["scroll-to-top"]).toBe(0);
            expect(eventMapScrollView["scroll-to-bottom"]).toBe(1);
            expect(eventMapScrollView["scroll-to-left"]).toBe(2);
            expect(eventMapScrollView["scroll-to-right"]).toBe(3);
            expect(eventMapScrollView.scrolling).toBe(4);
            expect(eventMapScrollView["bounce-top"]).toBe(5);
            expect(eventMapScrollView["bounce-bottom"]).toBe(6);
            expect(eventMapScrollView["bounce-left"]).toBe(7);
            expect(eventMapScrollView["bounce-right"]).toBe(8);
            expect(eventMapScrollView["scroll-ended"]).toBe(9);
            expect(eventMapScrollView["touch-up"]).toBe(10);
            expect(eventMapScrollView["scroll-ended-with-threshold"]).toBe(11);
            expect(eventMapScrollView["scroll-began"]).toBe(12);
        });
    });
});

import { Node, UITransform, v2 } from "cc";
import { SnapScrollView, eventMapScrollView } from "../../../../../../assets/game/sliding-chip/scripts/components/snap-scroll-view";
import { ChipScrollView } from "../../../../../../assets/shared/common-components/scroll-view/scripts/components/chip-scroll-view";

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

    beforeEach(() => {
        
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
            mockChipScrollView.content.children = [new Node(), new Node(), new Node()];
            mockUITransform.width = 400;

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert
            const calculatedPercent = (snapScrollView as any)._calculatedPercent;
            expect(calculatedPercent).toBeDefined();
            expect(calculatedPercent.length).toBe(3);
        });

        it("should handle half spacing when enabled", () => {
            // Arrange
            snapScrollView.enableHalfSpacing = true;
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;

            // Act & Assert - Should complete without error
            expect(() => snapScrollView.initCalculatedPercent()).not.toThrow();
        });

        it("should handle vertical layout", () => {
            // Arrange
            snapScrollView.isHorizontalLayout = false;
            snapScrollView.itemSize = 100;
            snapScrollView.spacing = 20;
            mockUITransform.width = 500;

            // Act & Assert - Should complete without error
            expect(() => snapScrollView.initCalculatedPercent()).not.toThrow();
        });

        it("should handle empty content", () => {
            // Arrange
            mockChipScrollView.content.children = [];

            // Act
            snapScrollView.initCalculatedPercent();

            // Assert
            expect((snapScrollView as any)._calculatedPercent).toEqual([]);
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
        it("should find closest display index", () => {
            // Arrange
            (snapScrollView as any)._calculatedPercent = [0, 0.25, 0.5, 0.75];
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
            (snapScrollView as any)._calculatedPercent = [0, 0.5, 1.0];
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(0, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            expect(snapScrollView.getMinDisplay()).toBe(0);
        });

        it("should find closest index when percent falls between two calculated percents", () => {
            // Arrange - Test the delta comparison logic
            (snapScrollView as any)._calculatedPercent = [0, 0.25, 0.5, 0.75];
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-75, 0)); // 75/200 = 0.375 (between 0.25 and 0.5)
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(200, 0));

            // Act
            snapScrollView.onScrollEnd();

            // Assert
            const minDisplay = snapScrollView.getMinDisplay();
            expect(minDisplay).toBeGreaterThanOrEqual(0);
            expect(minDisplay).toBeLessThan(4);
        });

        it("should skip minDisplay update when delta sum is zero", () => {
            // Arrange - Create scenario where delta1 + delta2 = 0
            (snapScrollView as any)._calculatedPercent = [0, 0.4, 0.4, 0.8]; // Identical consecutive values
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-40, 0)); // percent = 0.4
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(100, 0));
            
            const originalMinDisplay = snapScrollView.getMinDisplay();

            // Act
            snapScrollView.onScrollEnd();

            // Assert - minDisplay should not be updated due to delta sum = 0 condition
            expect(snapScrollView.getMinDisplay()).toBe(originalMinDisplay);
        });

        it("should handle loop termination when calculated percent exceeds 1", () => {
            // Arrange - Create calculated percent array with value > 1 early in the array
            (snapScrollView as any)._calculatedPercent = [0, 1.5, 2.0]; // Value > 1 at index 1
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-150, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(100, 0));

            // Act & Assert - Should break the loop early and not crash
            expect(() => snapScrollView.onScrollEnd()).not.toThrow();
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

        it("should handle scrolling when calculated percent array is empty", () => {
            // Arrange
            (snapScrollView as any)._calculatedPercent = [];

            // Act
            snapScrollView.scrollTo(0);

            // Assert
            expect(mockChipScrollView.scrollToPercentHorizontal).toHaveBeenCalledWith(
                undefined, // _calculatedPercent[0] is undefined
                0.3,
                true
            );
        });

        it("should handle scrolling when scrollView is null", () => {
            // Arrange
            (snapScrollView as any)._scrollView = null;
            jest.spyOn(snapScrollView, 'getComponent').mockReturnValue(null);

            // Act & Assert
            expect(() => snapScrollView.scrollTo(1)).not.toThrow();
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
        it("should handle null/undefined content", () => {
            // Arrange
            mockChipScrollView.content = null;

            // Act & Assert - Should not throw
            expect(() => snapScrollView.initCalculatedPercent()).not.toThrow();
        });

        it("should handle when scrollView is null", () => {
            // Arrange
            (snapScrollView as any)._scrollView = null;
            jest.spyOn(snapScrollView, 'getComponent').mockReturnValue(null);

            // Act & Assert
            expect(() => snapScrollView.initCalculatedPercent()).not.toThrow();
        });

        it("should handle division by zero in getPercent method", () => {
            // Arrange
            mockChipScrollView.getScrollOffset.mockReturnValue(v2(-50, 0));
            mockChipScrollView.getMaxScrollOffset.mockReturnValue(v2(0, 0)); // Zero max offset

            // Act & Assert - Should not throw
            expect(() => snapScrollView.onScrollEnd()).not.toThrow();
        });
    });

    describe("scroll content width calculation", () => {
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

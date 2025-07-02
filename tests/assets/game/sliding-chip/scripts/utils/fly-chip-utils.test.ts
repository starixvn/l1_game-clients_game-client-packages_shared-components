import { Node, UITransform, tween, v3 } from "cc";
import { FlyChipUtils } from "../../../../../../assets/game/sliding-chip/scripts/utils/fly-chip-utils";

// Mock external dependencies
jest.mock("lodash-es", () => ({
    random: jest.fn(),
}));

jest.mock("mobx");
jest.mock("observer");
jest.mock("observer-component");
jest.mock("reflect-metadata");

describe("FlyChipUtils", () => {
    let mockRandom: jest.MockedFunction<typeof import("lodash-es").random>;
    let mockChip: Node;
    let mockBox: Node;
    let mockChipUITransform: UITransform;
    let mockBoxUITransform: UITransform;
    let mockTweenInstance: any;

    beforeEach(() => {
        mockRandom = jest.requireMock("lodash-es").random;

        // Create mock nodes and components
        mockChip = new Node();
        mockBox = new Node();
        mockChipUITransform = new UITransform();
        mockBoxUITransform = new UITransform();

        // Setup default properties
        mockChipUITransform.width = 50;
        mockChipUITransform.height = 50;
        mockBoxUITransform.width = 200;
        mockBoxUITransform.height = 200;
        
        // Setup getBoundingBox mock
        mockChipUITransform.getBoundingBox = jest.fn().mockReturnValue({
            width: 50,
            height: 50,
        });

        // Setup getComponent mock to return appropriate transforms
        mockChip.getComponent = jest.fn().mockReturnValue(mockChipUITransform);
        mockBox.getComponent = jest.fn().mockReturnValue(mockBoxUITransform);

        // Setup tween mock with chainable methods
        mockTweenInstance = {
            to: jest.fn().mockReturnThis(),
            then: jest.fn().mockReturnThis(),
            delay: jest.fn().mockReturnThis(),
            call: jest.fn().mockReturnThis(),
            start: jest.fn().mockReturnThis(),
        };

        jest.mocked(tween).mockReturnValue(mockTweenInstance);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getRandomPositionChip", () => {
        it("should return random position when chip and box are valid", () => {
            // Arrange
            const expectedX = 75;
            const expectedY = 100;
            mockRandom.mockReturnValueOnce(expectedX).mockReturnValueOnce(expectedY);

            // Act
            const result = FlyChipUtils.getRandomPositionChip(mockChip, mockBox);

            // Assert
            expect(mockChip.getComponent).toHaveBeenCalledWith(UITransform);
            expect(mockBox.getComponent).toHaveBeenCalledWith(UITransform);
            expect(mockChipUITransform.getBoundingBox).toHaveBeenCalled();
            expect(mockRandom).toHaveBeenCalledTimes(2);
            expect(mockRandom).toHaveBeenNthCalledWith(1, 12, 176); // Math.floor(50/4), Math.floor(200-50/2)+1
            expect(mockRandom).toHaveBeenNthCalledWith(2, 12, 176);
            expect(result.x).toBe(expectedX);
            expect(result.y).toBe(expectedY);
            expect(result.z).toBe(0);
        });

        it("should return zero vector when chip is null", () => {
            // Act
            const result = FlyChipUtils.getRandomPositionChip(null, mockBox);

            // Assert
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.z).toBe(0);
            expect(mockRandom).not.toHaveBeenCalled();
        });

        it("should return zero vector when box is null", () => {
            // Act
            const result = FlyChipUtils.getRandomPositionChip(mockChip, null);

            // Assert
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.z).toBe(0);
            expect(mockRandom).not.toHaveBeenCalled();
        });

        it("should return zero vector when both chip and box are null", () => {
            // Act
            const result = FlyChipUtils.getRandomPositionChip(null, null);

            // Assert
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.z).toBe(0);
            expect(mockRandom).not.toHaveBeenCalled();
        });

        it("should handle edge case with small dimensions", () => {
            // Arrange
            mockChipUITransform.width = 4;
            mockChipUITransform.height = 4;
            mockBoxUITransform.width = 10;
            mockBoxUITransform.height = 10;
            mockChipUITransform.getBoundingBox.mockReturnValue({ width: 4, height: 4 });
            
            const expectedX = 5;
            const expectedY = 6;
            mockRandom.mockReturnValueOnce(expectedX).mockReturnValueOnce(expectedY);

            // Act
            const result = FlyChipUtils.getRandomPositionChip(mockChip, mockBox);

            // Assert
            expect(mockRandom).toHaveBeenNthCalledWith(1, 1, 9); // Math.floor(4/4), Math.floor(10-4/2)+1
            expect(mockRandom).toHaveBeenNthCalledWith(2, 1, 9);
            expect(result.x).toBe(expectedX);
            expect(result.y).toBe(expectedY);
            expect(result.z).toBe(0);
        });
    });

    describe("moveChipThenDestroy", () => {
        it("should create tween chain and destroy chip after delay", () => {
            // Arrange
            const destPosition = v3(100, 150);
            const flyingTime = 2.0;

            // Act
            FlyChipUtils.moveChipThenDestroy(mockChip, destPosition, flyingTime);

            // Assert
            expect(tween).toHaveBeenCalledWith(mockChip);
            expect(mockTweenInstance.then).toHaveBeenCalled();
            expect(mockTweenInstance.delay).toHaveBeenCalledWith(1.0); // 0.5 * flyingTime
            expect(mockTweenInstance.call).toHaveBeenCalled();
            expect(mockTweenInstance.start).toHaveBeenCalled();

            // Test the destroy callback (should be the last call in the chain)
            expect(mockTweenInstance.call).toHaveBeenCalled();
            const callCallbacks = mockTweenInstance.call.mock.calls;
            const destroyCallback = callCallbacks[callCallbacks.length - 1][0];
            destroyCallback();
            expect(mockChip.destroy).toHaveBeenCalled();
        });

        it("should not create tween when chip is null", () => {
            // Arrange
            const destPosition = v3(100, 150);
            const flyingTime = 2.0;

            // Act
            FlyChipUtils.moveChipThenDestroy(null, destPosition, flyingTime);

            // Assert
            expect(tween).not.toHaveBeenCalled();
        });

        it("should handle zero flying time", () => {
            // Arrange
            const destPosition = v3(50, 75);
            const flyingTime = 0;

            // Act
            FlyChipUtils.moveChipThenDestroy(mockChip, destPosition, flyingTime);

            // Assert
            expect(mockTweenInstance.delay).toHaveBeenCalledWith(0); // 0.5 * 0
        });
    });

    describe("moveChipTo", () => {
        it("should create tween animation to move chip to position", () => {
            // Arrange
            const randomPosition = v3(120, 80);
            const flyingDuration = 1.5;
            const onComplete = jest.fn();

            // Act
            const result = FlyChipUtils.moveChipTo(mockChip, randomPosition, flyingDuration, onComplete);

            // Assert
            expect(tween).toHaveBeenCalledWith(mockChip);
            const toCall = mockTweenInstance.to.mock.calls[0];
            expect(toCall[0]).toBe(flyingDuration);
            expect(toCall[1].position.x).toBe(randomPosition.x);
            expect(toCall[1].position.y).toBe(randomPosition.y);
            expect(toCall[1].position.z).toBe(0);
            expect(toCall[2]).toEqual({ easing: "sineOut" });
            expect(mockTweenInstance.call).toHaveBeenCalled();
            expect(mockTweenInstance.start).toHaveBeenCalled();
            expect(result).toBe(mockTweenInstance);

            // Test the onComplete callback
            const callCallback = mockTweenInstance.call.mock.calls[0][0];
            callCallback();
            expect(onComplete).toHaveBeenCalled();
        });

        it("should work without onComplete callback", () => {
            // Arrange
            const randomPosition = v3(75, 125);
            const flyingDuration = 0.8;

            // Act
            const result = FlyChipUtils.moveChipTo(mockChip, randomPosition, flyingDuration);

            // Assert
            expect(tween).toHaveBeenCalledWith(mockChip);
            const toCall = mockTweenInstance.to.mock.calls[0];
            expect(toCall[0]).toBe(flyingDuration);
            expect(toCall[1].position.x).toBe(randomPosition.x);
            expect(toCall[1].position.y).toBe(randomPosition.y);
            expect(toCall[1].position.z).toBe(0);
            expect(toCall[2]).toEqual({ easing: "sineOut" });
            expect(mockTweenInstance.call).toHaveBeenCalled();
            expect(mockTweenInstance.start).toHaveBeenCalled();
            expect(result).toBe(mockTweenInstance);

            // Test that callback doesn't throw when onComplete is undefined
            const callCallback = mockTweenInstance.call.mock.calls[0][0];
            expect(() => callCallback()).not.toThrow();
        });

        it("should handle zero duration", () => {
            // Arrange
            const randomPosition = v3(0, 0);
            const flyingDuration = 0;

            // Act
            FlyChipUtils.moveChipTo(mockChip, randomPosition, flyingDuration);

            // Assert
            const toCall = mockTweenInstance.to.mock.calls[0];
            expect(toCall[0]).toBe(0);
            expect(toCall[1].position.x).toBe(0);
            expect(toCall[1].position.y).toBe(0);
            expect(toCall[1].position.z).toBe(0);
            expect(toCall[2]).toEqual({ easing: "sineOut" });
        });

        it("should set z-coordinate to 0 regardless of input", () => {
            // Arrange
            const randomPosition = v3(100, 200, 300); // z=300 should be ignored
            const flyingDuration = 1.0;

            // Act
            FlyChipUtils.moveChipTo(mockChip, randomPosition, flyingDuration);

            // Assert
            const toCall = mockTweenInstance.to.mock.calls[0];
            expect(toCall[0]).toBe(flyingDuration);
            expect(toCall[1].position.x).toBe(100);
            expect(toCall[1].position.y).toBe(200);
            expect(toCall[1].position.z).toBe(0); // z should be 0
            expect(toCall[2]).toEqual({ easing: "sineOut" });
        });
    });

    describe("namespace export", () => {
        it("should export all functions", () => {
            // Assert
            expect(typeof FlyChipUtils.getRandomPositionChip).toBe("function");
            expect(typeof FlyChipUtils.moveChipThenDestroy).toBe("function");
            expect(typeof FlyChipUtils.moveChipTo).toBe("function");
        });
    });
});

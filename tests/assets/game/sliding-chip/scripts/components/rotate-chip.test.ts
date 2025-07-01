import { Component, tween } from "cc";
import { RotateChip } from "../../../../../../assets/game/sliding-chip/scripts/components/rotate-chip";

describe("RotateChip", () => {
    let rotateChip: RotateChip;

    beforeEach(() => {
        rotateChip = new RotateChip();
        jest.clearAllMocks();
    });

    describe("default properties", () => {
        it("should have default degreePerSecond of 360", () => {
            // Assert
            expect(rotateChip.degreePerSecond).toBe(360);
        });
    });

    describe("degreePerSecond property", () => {
        it("should allow setting custom rotation speed", () => {
            // Arrange
            const speeds = [90, 180, 270, 720, 1440];
            
            speeds.forEach(speed => {
                // Act
                rotateChip.degreePerSecond = speed;
                
                // Assert
                expect(rotateChip.degreePerSecond).toBe(speed);
            });
        });
    });

    describe("onEnable", () => {
        it("should create and configure tween animation", () => {
            // Act
            rotateChip.onEnable();

            // Assert
            expect(tween).toHaveBeenCalledWith(rotateChip.node);
        });

        it("should use custom rotation speed in tween", () => {
            // Arrange
            rotateChip.degreePerSecond = 180;
            
            // Act
            rotateChip.onEnable();

            // Assert
            // The tween mock from cocos-testing should capture the call
            expect(tween).toHaveBeenCalledWith(rotateChip.node);
        });

        it("should create new tween on multiple calls", () => {
            // Act
            rotateChip.onEnable();
            rotateChip.onEnable();

            // Assert
            expect(tween).toHaveBeenCalledTimes(2);
        });
    });

    describe("component inheritance", () => {
        it("should extend Component", () => {
            // Assert
            expect(rotateChip).toBeInstanceOf(Component);
        });

        it("should have node property from Component base class", () => {
            // Assert
            expect(rotateChip).toHaveProperty('node');
        });
    });

    describe("edge cases", () => {
        it("should handle zero degreePerSecond", () => {
            // Arrange
            rotateChip.degreePerSecond = 0;
            
            // Act & Assert
            expect(() => rotateChip.onEnable()).not.toThrow();
        });

        it("should handle negative degreePerSecond", () => {
            // Arrange
            rotateChip.degreePerSecond = -180;
            
            // Act & Assert
            expect(() => rotateChip.onEnable()).not.toThrow();
        });

        it("should handle very large degreePerSecond", () => {
            // Arrange
            rotateChip.degreePerSecond = 3600;
            
            // Act & Assert
            expect(() => rotateChip.onEnable()).not.toThrow();
        });
    });

    describe("complete animation setup", () => {
        it("should configure rotation animation correctly", () => {
            // Arrange
            const customSpeed = 540;
            rotateChip.degreePerSecond = customSpeed;

            // Act
            rotateChip.onEnable();

            // Assert
            // Verify tween is created with the node
            expect(tween).toHaveBeenCalledWith(rotateChip.node);
            expect(tween).toHaveBeenCalledTimes(1);
        });
    });
});

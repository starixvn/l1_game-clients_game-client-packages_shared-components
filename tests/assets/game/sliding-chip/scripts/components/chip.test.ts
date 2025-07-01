import { Button, Color, Label, Node, Sprite, SpriteFrame } from "cc";
import Chip, { ChipDisplayType } from "../../../../../../assets/game/sliding-chip/scripts/components/chip";

// Mock NumberUtils
jest.mock("../../../../../../assets/shared/utils", () => ({
    NumberUtils: {
        getChipFormatter: jest.fn((value: number) => {
            if (value >= 1000) return `${value / 1000}K`;
            return value.toString();
        })
    }
}));

import { NumberUtils } from "../../../../../../assets/shared/utils";

describe("Chip", () => {
    let chip: Chip;
    let mockBackground: Node;
    let mockCenter: Sprite;
    let mockBorder: Sprite;
    let mockLblValue: Label;
    let mockButton: Button;
    let mockBgOverlay: Node;
    let mockBgCircle: Node;

    beforeEach(() => {
        chip = new Chip();

        // Create and assign mock components
        mockBackground = new Node();
        mockCenter = new Sprite();
        mockBorder = new Sprite();
        mockLblValue = new Label();
        mockButton = new Button();

        const mockBackgroundSprite = new Sprite();
        jest.spyOn(mockBackground, "getComponent").mockReturnValue(mockBackgroundSprite);

        mockLblValue.node = new Node();
        chip.node = new Node();
        jest.spyOn(chip, "getComponent").mockReturnValue(mockButton);

        // Set up chip properties
        chip.background = mockBackground;
        chip.center = mockCenter;
        chip.border = mockBorder;
        chip.centerFrames = [new SpriteFrame(), new SpriteFrame()];
        chip.borderFrames = [new SpriteFrame(), new SpriteFrame()];
        chip.typeNodes = [new Node(), new Node()];
        chip.lblValue = mockLblValue;

        // Mock child nodes for hideSomeSprites test
        mockBgOverlay = new Node();
        mockBgCircle = new Node();
        mockBgOverlay.name = "bg-overlay";
        mockBgCircle.name = "bg-circle";
        
        jest.spyOn(chip.typeNodes[ChipDisplayType.Normal], "getChildByName")
            .mockImplementation((name: string) => {
                if (name === "bg-overlay") return mockBgOverlay;
                if (name === "bg-circle") return mockBgCircle;
                return null;
            });

        jest.clearAllMocks();
    });

    describe("setColor", () => {
        it("should set color and update chip appearance", () => {
            // Arrange
            const testColor = new Color(255, 0, 0, 255);
            jest.spyOn(chip, "updateChip" as any);

            // Act
            chip.setColor(testColor);

            // Assert
            expect(chip["_color"]).toEqual(testColor);
            expect(mockBackground.getComponent(Sprite).color).toEqual(testColor);
            expect(chip["updateChip"]).toHaveBeenCalled();
        });
    });

    describe("setType", () => {
        it("should configure Normal type correctly", () => {
            // Arrange
            jest.spyOn(chip, "updateChip" as any);

            // Act
            chip.setType(ChipDisplayType.Normal);

            // Assert
            expect(chip["_type"]).toBe(ChipDisplayType.Normal);
            expect(mockCenter.spriteFrame).toBe(chip.centerFrames[ChipDisplayType.Normal]);
            expect(mockBorder.spriteFrame).toBe(chip.borderFrames[ChipDisplayType.Normal]);
            expect(chip.typeNodes[ChipDisplayType.Normal].active).toBe(true);
            expect(chip.typeNodes[ChipDisplayType.VIP].active).toBe(false);
            expect(chip["updateChip"]).toHaveBeenCalled();
        });

        it("should configure VIP type correctly", () => {
            // Act
            chip.setType(ChipDisplayType.VIP);

            // Assert
            expect(chip["_type"]).toBe(ChipDisplayType.VIP);
            expect(chip.typeNodes[ChipDisplayType.VIP].active).toBe(true);
            expect(chip.typeNodes[ChipDisplayType.Normal].active).toBe(false);
        });
    });

    describe("updateChip", () => {
        it("should set Normal type colors correctly", () => {
            // Arrange
            chip["_type"] = ChipDisplayType.Normal;
            chip["_color"] = new Color(255, 0, 0, 255);

            // Act
            chip["updateChip"]();

            // Assert
            expect(mockCenter.color).toEqual(Color.WHITE);
            expect(mockLblValue.color).toEqual(Color.WHITE);
        });

        it("should set VIP type colors correctly", () => {
            // Arrange
            chip["_type"] = ChipDisplayType.VIP;
            chip["_color"] = new Color(255, 0, 0, 255);

            // Act
            chip["updateChip"]();

            // Assert
            expect(mockCenter.color).toEqual(chip["_color"]);
            expect(mockLblValue.color).toEqual(Color.YELLOW);
        });
    });

    describe("setValue", () => {
        it("should format and set value correctly", () => {
            // Arrange
            const testValues = [
                { input: 1500, expected: "1.5K" },
                { input: 500, expected: "500" }
            ];

            testValues.forEach(({ input, expected }) => {
                // Arrange
                (NumberUtils.getChipFormatter as jest.Mock).mockReturnValue(expected);
                
                // Act
                chip.setValue(input);

                // Assert
                expect(NumberUtils.getChipFormatter).toHaveBeenCalledWith(input, 0);
                expect(mockLblValue.string).toBe(expected);
                expect(chip.node.name).toBe(input.toString());
            });
        });
    });

    describe("handleSmallChip", () => {
        it("should handle small chip mode correctly", () => {
            // Arrange
            jest.spyOn(chip, "hideSomeSprites");

            // Act
            chip.handleSmallChip(true);

            // Assert
            expect(mockLblValue.node.active).toBe(true);
            expect(mockButton.enabled).toBe(false);
            expect(chip.hideSomeSprites).toHaveBeenCalled();
        });

        it("should handle normal chip mode correctly", () => {
            // Act
            chip.handleSmallChip(false);

            // Assert
            expect(mockLblValue.node.active).toBe(false);
            expect(mockButton.enabled).toBe(false);
        });

        it("should use default value when no parameter provided", () => {
            // Act
            chip.handleSmallChip();

            // Assert
            expect(mockLblValue.node.active).toBe(false);
        });

        it("should handle missing button component gracefully", () => {
            // Arrange
            jest.spyOn(chip, "getComponent").mockReturnValue(null);

            // Act & Assert
            expect(() => chip.handleSmallChip(true)).not.toThrow();
        });
    });

    describe("hideSomeSprites", () => {
        it("should hide specified child nodes", () => {
            // Act
            chip.hideSomeSprites();

            // Assert
            expect(mockBgOverlay.active).toBe(false);
            expect(mockBgCircle.active).toBe(false);
        });

        it("should handle missing child nodes gracefully", () => {
            // Arrange
            jest.spyOn(chip.typeNodes[ChipDisplayType.Normal], "getChildByName").mockReturnValue(null);

            // Act & Assert
            expect(() => chip.hideSomeSprites()).not.toThrow();
        });
    });

    describe("ChipDisplayType enum", () => {
        it("should have correct values", () => {
            // Assert
            expect(ChipDisplayType.Normal).toBe(0);
            expect(ChipDisplayType.VIP).toBe(1);
        });
    });

    describe("complete chip configuration", () => {
        it("should configure Normal chip completely", () => {
            // Arrange
            const testColor = new Color(0, 255, 0, 255);

            // Act
            chip.setColor(testColor);
            chip.setType(ChipDisplayType.Normal);
            chip.setValue(2500);

            // Assert
            expect(chip["_color"]).toEqual(testColor);
            expect(chip["_type"]).toBe(ChipDisplayType.Normal);
            expect(mockCenter.color).toEqual(Color.WHITE);
            expect(mockLblValue.color).toEqual(Color.WHITE);
            expect(chip.typeNodes[ChipDisplayType.Normal].active).toBe(true);
        });

        it("should configure VIP chip completely", () => {
            // Arrange
            const testColor = new Color(255, 215, 0, 255);

            // Act
            chip.setColor(testColor);
            chip.setType(ChipDisplayType.VIP);
            chip.setValue(5000);

            // Assert
            expect(chip["_color"]).toEqual(testColor);
            expect(chip["_type"]).toBe(ChipDisplayType.VIP);
            expect(mockCenter.color).toEqual(testColor);
            expect(mockLblValue.color).toEqual(Color.YELLOW);
            expect(chip.typeNodes[ChipDisplayType.VIP].active).toBe(true);
        });
    });
});

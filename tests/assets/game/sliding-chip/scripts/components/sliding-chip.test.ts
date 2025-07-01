import { Color, Component, Layers, Node, Prefab, Sprite, SpriteAtlas, SpriteFrame, v3 } from "cc";
import SlidingChip from "../../../../../../assets/game/sliding-chip/scripts/components/sliding-chip";
import { ChipDisplayType } from "../../../../../../assets/game/sliding-chip/scripts/components/chip";

// Mock external dependencies
jest.mock("@sg/game-client-base", () => ({
    __esModule: true,
    default: {
        Bet: { BetStore: jest.fn() },
        Chips: { ChipStore: jest.fn() },
        ChipSetting: { ChipSettingStore: jest.fn() },
        Audios: { AudioHandler: jest.fn(), AudioIds: { CLICK: "click-sound" } },
        PlayerSelections: { PlayerSelectionHandlers: { ChipHandlers: jest.fn() } },
        Shared: { IHandler: jest.fn() },
    },
}));

jest.mock("lodash-es", () => ({
    random: jest.fn(() => 45),
}));

describe("SlidingChip", () => {
    let slidingChip: SlidingChip;
    let mockChips: Node;
    let mockSnappedScrollView: any;

    beforeEach(() => {
        slidingChip = new SlidingChip();
        
        mockChips = new Node();
        mockSnappedScrollView = {
            actionScrollEnded: null,
            getMinDisplay: jest.fn(() => 0),
            scrollTo: jest.fn(),
            initCalculatedPercent: jest.fn(),
            scrollView: { scrollToPercentHorizontal: jest.fn() },
        };

        // Set up basic properties
        slidingChip.chips = mockChips;
        slidingChip.chipAltas = new SpriteAtlas();
        slidingChip.snappedScrollView = mockSnappedScrollView;
        slidingChip.leftButton = new Node();
        slidingChip.rightButton = new Node();
        slidingChip.displaySize = 6;
        slidingChip.movingStep = 1;
        slidingChip.chipPrefab = new Prefab();
        slidingChip.lowValueChipSprite = new SpriteFrame();
        slidingChip.chipValues = [10, 50, 100];
        slidingChip["chipSetting"] = { 0: "#FFFFFF", 10: "#FF0000", 50: "#00FF00", 100: "#0000FF", 500: "#FF00FF" };

        jest.clearAllMocks();
    });

    describe("initialization", () => {
        describe("onLoad", () => {
            it("should call handleFirstLoad", () => {
                // Arrange
                const handleFirstLoadSpy = jest.spyOn(slidingChip, "handleFirstLoad");
                
                // Act
                slidingChip.onLoad();
                
                // Assert
                expect(handleFirstLoadSpy).toHaveBeenCalled();
            });
        });

        describe("handleFirstLoad", () => {
            it("should configure initial state", () => {
                // Arrange
                const setLeftButtonStatusSpy = jest.spyOn(slidingChip, "setLeftButtonStatus" as any);
                
                // Act
                slidingChip.handleFirstLoad();
                
                // Assert
                expect(setLeftButtonStatusSpy).toHaveBeenCalledWith(false);
                expect(mockSnappedScrollView.actionScrollEnded).toBeDefined();
            });
        });
    });

    describe("getReady", () => {
        it("should return true when ready", () => {
            // Arrange
            slidingChip["chipSetting"] = { 100: "#FF0000" };
            slidingChip["isCreatedChips"] = true;
            
            // Act
            const result = slidingChip.getReady();
            
            // Assert
            expect(result).toBe(true);
        });

        it("should return false when not ready", () => {
            // Arrange
            slidingChip["chipSetting"] = null;
            slidingChip["isCreatedChips"] = false;
            
            // Act
            const result = slidingChip.getReady();
            
            // Assert
            expect(result).toBeFalsy();
        });
    });

    describe("setDisabledBetChips", () => {
        it("should update disabled status", () => {
            // Act
            slidingChip.setDisabledBetChips(true);
            
            // Assert
            expect(slidingChip["disabledBetChips"]).toBe(true);
        });
    });

    describe("button management", () => {
        describe("setLeftButtonStatus", () => {
            it("should show button when enabled and not disabled", () => {
                // Arrange
                slidingChip["disabledBetChips"] = false;
                
                // Act
                slidingChip["setLeftButtonStatus"](true);
                
                // Assert
                expect(slidingChip.leftButton.active).toBe(true);
            });

            it("should hide button when disabled", () => {
                // Arrange
                slidingChip["disabledBetChips"] = true;
                
                // Act
                slidingChip["setLeftButtonStatus"](true);
                
                // Assert
                expect(slidingChip.leftButton.active).toBe(false);
            });
        });

        describe("setRightButtonStatus", () => {
            it("should show button when enabled and not disabled", () => {
                // Arrange
                slidingChip["disabledBetChips"] = false;
                
                // Act
                slidingChip["setRightButtonStatus"](true);
                
                // Assert
                expect(slidingChip.rightButton.active).toBe(true);
            });
        });
    });

    describe("getChipColor", () => {
        it("should return correct color for valid chip", () => {
            // Arrange
            slidingChip["chipSetting"] = { 100: "#FF0000" };
            
            // Act
            const result = slidingChip.getChipColor(100);
            
            // Assert
            expect(result).toBeInstanceOf(Color);
        });

        it("should handle missing chip with error", () => {
            // Arrange
            slidingChip["chipSetting"] = { 0: "#FFFFFF" };
            const consoleSpy = jest.spyOn(console, "error").mockImplementation();
            
            // Act
            const result = slidingChip.getChipColor(999);
            
            // Assert
            expect(result).toBeInstanceOf(Color);
            expect(consoleSpy).toHaveBeenCalledWith("Missing color for chip 999");
            consoleSpy.mockRestore();
        });
    });

    describe("chip creation", () => {
        describe("createChips", () => {
            it("should create chips from values", () => {
                // Arrange
                const destroyChipsSpy = jest.spyOn(slidingChip, "destroyChips" as any);
                const restoreChipStateSpy = jest.spyOn(slidingChip, "restoreChipState" as any);
                
                // Mock instantiate to return a proper chip node
                const mockChipNode = new Node();
                const mockChipComponent = { setColor: jest.fn(), setValue: jest.fn(), setType: jest.fn() } as any;
                jest.spyOn(mockChipNode, "getComponent").mockReturnValue(mockChipComponent);
                jest.spyOn(mockChipNode, "on").mockImplementation();
                jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockChipNode);
                
                const mockLayout = { enabled: true, updateLayout: jest.fn() } as any;
                jest.spyOn(mockChips, "getComponent").mockReturnValue(mockLayout);
                
                // Act
                const result = slidingChip.createChips();
                
                // Assert
                expect(destroyChipsSpy).toHaveBeenCalled();
                expect(restoreChipStateSpy).toHaveBeenCalled();
                expect(result.chipsLength).toBe(3);
            });

            it("should handle instantiate failure", () => {
                // Arrange
                jest.spyOn(require("cc"), "instantiate").mockReturnValue(null);
                
                // Act
                const result = slidingChip.createChips();
                
                // Assert
                expect(result.chipsLength).toBe(0);
            });
        });

        describe("createSmallChip", () => {
            it("should create low value chip for zero bet", () => {
                // Arrange
                const createLowValueChipSpy = jest.spyOn(slidingChip, "createLowValueChip" as any);
                const mockNode = new Node();
                createLowValueChipSpy.mockReturnValue(mockNode);
                
                // Act
                const result = slidingChip.createSmallChip(0);
                
                // Assert
                expect(createLowValueChipSpy).toHaveBeenCalled();
                expect(result.angle).toBe(45); // mocked random value
            });

            it("should create regular chip for non-zero bet", () => {
                // Arrange
                const mockChipNode = new Node();
                const mockChipComponent = { 
                    setColor: jest.fn(), 
                    setValue: jest.fn(), 
                    setType: jest.fn(),
                    handleSmallChip: jest.fn()
                } as any;
                jest.spyOn(mockChipNode, "getComponent").mockReturnValue(mockChipComponent);
                jest.spyOn(require("cc"), "instantiate").mockReturnValue(mockChipNode);
                
                // Act
                const result = slidingChip.createSmallChip(100, 0.5, true);
                
                // Assert
                expect(mockChipComponent.handleSmallChip).toHaveBeenCalledWith(true);
                expect(result.scale.x).toBe(0.5);
                expect(result.scale.y).toBe(0.5);
                expect(result.scale.z).toBe(0.5);
            });

            it("should handle null chip creation", () => {
                // Arrange
                jest.spyOn(require("cc"), "instantiate").mockReturnValue(null);
                
                // Act
                const result = slidingChip.createSmallChip(100);
                
                // Assert
                expect(result).toBeNull();
            });
        });

        describe("createLowValueChip", () => {
            it("should create low value chip node with sprite component", () => {
                // Act
                const result = slidingChip["createLowValueChip"]();
                
                // Assert
                expect(result).toBeInstanceOf(Node);
                expect(result.layer).toBe(Layers.Enum.UI_2D);
                
                // Check that sprite component was added and configured
                const sprite = result.getComponent(Sprite);
                expect(sprite).toBeDefined();
                expect(sprite.trim).toBe(false);
                expect(sprite.spriteFrame).toBe(slidingChip.lowValueChipSprite);
            });
        });

        describe("updateSelectedBet", () => {
            it("should update chip highlighting for all chips", () => {
                // Arrange
                const mockChip1 = new Node();
                mockChip1.name = "100";
                const mockChip2 = new Node();
                mockChip2.name = "200";
                slidingChip["chipList"] = [mockChip1, mockChip2];
                
                const highlightChipSpy = jest.spyOn(slidingChip, "highlightChip" as any);
                jest.spyOn(require("cc").Tween, "stopAllByTarget").mockImplementation();
                
                // Act
                slidingChip["updateSelectedBet"]("100");
                
                // Assert
                expect(require("cc").Tween.stopAllByTarget).toHaveBeenCalledWith(mockChip1);
                expect(require("cc").Tween.stopAllByTarget).toHaveBeenCalledWith(mockChip2);
                expect(highlightChipSpy).toHaveBeenCalledWith(mockChip1, true);
                expect(highlightChipSpy).toHaveBeenCalledWith(mockChip2, false);
            });
        });

        describe("updateSelectChip", () => {
            it("should return display information", () => {
                // Arrange
                mockSnappedScrollView.getMinDisplay.mockReturnValue(2);
                slidingChip.displaySize = 6;
                
                // Act
                const result = slidingChip.updateSelectChip();
                
                // Assert
                expect(result.displayMin).toBe(2);
                expect(result.displaySize).toBe(6);
            });
        });
    });

    describe("highlightChip", () => {
        it("should highlight chip with proper scaling and positioning", () => {
            // Arrange
            const mockChip = new Node();
            const mockActiveNode = new Node();
            mockActiveNode.active = false;
            jest.spyOn(mockChip, "getChildByName").mockReturnValue(mockActiveNode);
            jest.spyOn(mockChip, "setSiblingIndex").mockImplementation();
            
            slidingChip["chipList"] = [mockChip];
            
            // Mock tween
            const mockTween = { to: jest.fn().mockReturnThis(), start: jest.fn() };
            jest.spyOn(require("cc"), "tween").mockReturnValue(mockTween);
            
            // Act
            slidingChip["highlightChip"](mockChip, true);
            
            // Assert
            expect(mockActiveNode.active).toBe(true);
            expect(mockChip.setSiblingIndex).toHaveBeenCalledWith(2); // chipList.length + 1
            expect(require("cc").tween).toHaveBeenCalledWith(mockChip);
            expect(mockTween.start).toHaveBeenCalled();
        });

        it("should unhighlight chip with normal scaling", () => {
            // Arrange
            const mockChip = new Node();
            const mockActiveNode = new Node();
            mockActiveNode.active = true;
            jest.spyOn(mockChip, "getChildByName").mockReturnValue(mockActiveNode);
            jest.spyOn(mockChip, "setSiblingIndex").mockImplementation();
            
            const mockTween = { to: jest.fn().mockReturnThis(), start: jest.fn() };
            jest.spyOn(require("cc"), "tween").mockReturnValue(mockTween);
            
            // Act
            slidingChip["highlightChip"](mockChip, false);
            
            // Assert
            expect(mockActiveNode.active).toBe(false);
            expect(mockChip.setSiblingIndex).toHaveBeenCalledWith(0);
            expect(mockTween.start).toHaveBeenCalled();
        });
    });

    describe("navigation", () => {
        describe("onPrevious", () => {
            it("should play sound and return moving step", () => {
                // Arrange
                const playSoundSpy = jest.spyOn(slidingChip, "playSoundClick");
                
                // Act
                const result = slidingChip.onPrevious();
                
                // Assert
                expect(playSoundSpy).toHaveBeenCalled();
                expect(result.chipMovingStep).toBe(1);
            });
        });

        describe("onNext", () => {
            it("should play sound and return moving step", () => {
                // Arrange
                const playSoundSpy = jest.spyOn(slidingChip, "playSoundClick");
                
                // Act
                const result = slidingChip.onNext();
                
                // Assert
                expect(playSoundSpy).toHaveBeenCalled();
                expect(result.chipMovingStep).toBe(1);
            });
        });

        describe("scrollToSelectedIndex", () => {
            it("should scroll to chip at minimum display", () => {
                // Arrange
                const updateArrowSpy = jest.spyOn(slidingChip, "updateArrowVisibility" as any);
                const handleBetSpy = jest.spyOn(slidingChip, "handleBet" as any);
                
                // Act
                slidingChip.scrollToSelectedIndex(0);
                
                // Assert
                expect(updateArrowSpy).toHaveBeenCalledWith(0);
                expect(mockSnappedScrollView.scrollTo).toHaveBeenCalledWith(0);
                expect(handleBetSpy).toHaveBeenCalledWith(0);
            });

            it("should scroll when selectChip exceeds display range", () => {
                // Arrange
                mockSnappedScrollView.getMinDisplay.mockReturnValue(2);
                slidingChip.displaySize = 3;
                
                // Act
                slidingChip.scrollToSelectedIndex(5);
                
                // Assert
                expect(mockSnappedScrollView.scrollTo).toHaveBeenCalledWith(4); // 5 - 3 + 2
            });
        });

        describe("handleBet", () => {
            it("should handle empty chip list", () => {
                // Arrange
                slidingChip["chipList"] = [];
                const updateCurrentBetSpy = jest.spyOn(slidingChip, "updateCurrentBet");
                
                // Act
                slidingChip["handleBet"](0);
                
                // Assert
                expect(updateCurrentBetSpy).not.toHaveBeenCalled();
            });

            it("should handle valid chip selection", () => {
                // Arrange
                const mockChip = new Node();
                mockChip.name = "100";
                slidingChip["chipList"] = [mockChip];
                const updateCurrentBetSpy = jest.spyOn(slidingChip, "updateCurrentBet");
                
                // Act
                slidingChip["handleBet"](0);
                
                // Assert
                expect(updateCurrentBetSpy).toHaveBeenCalledWith("100");
            });
        });
    });

    describe("chip interaction", () => {
        describe("onClickChip", () => {
            it("should handle chip click", () => {
                // Arrange
                const playSoundSpy = jest.spyOn(slidingChip, "playSoundClick");
                const setSelectChipSpy = jest.spyOn(slidingChip, "setSelectChip" as any);
                const mockTarget = { node: { name: "100" } } as Component;
                
                // Act
                slidingChip.onClickChip(mockTarget);
                
                // Assert
                expect(playSoundSpy).toHaveBeenCalled();
                expect(setSelectChipSpy).toHaveBeenCalledWith("100");
            });
        });

        describe("setSelectChip", () => {
            it("should find and select chip", () => {
                // Arrange
                const mockChip = new Node();
                mockChip.name = "100";
                slidingChip["chipList"] = [mockChip];
                const updatePlayerSpy = jest.spyOn(slidingChip, "updatePlayerSelectionChip");
                
                // Act
                const result = slidingChip["setSelectChip"]("100");
                
                // Assert
                expect(updatePlayerSpy).toHaveBeenCalledWith(0);
                expect(result.selectedChip).toBe(0);
            });
        });
    });

    describe("helper methods", () => {
        describe("getChipDisplayType", () => {
            it("should return VIP for high-value chips", () => {
                // Arrange
                slidingChip.chipValues = [10, 50, 100, 500, 1000];
                
                // Act
                const result = slidingChip["getChipDisplayType"](4);
                
                // Assert
                expect(result).toBe(ChipDisplayType.VIP);
            });

            it("should return Normal for regular chips", () => {
                // Arrange
                slidingChip.chipValues = [10, 50, 100];
                
                // Act
                const result = slidingChip["getChipDisplayType"](0);
                
                // Assert
                expect(result).toBe(ChipDisplayType.Normal);
            });
        });

        describe("createStartNodeInfo", () => {
            it("should use provided start node", () => {
                // Arrange
                const mockStartNode = new Node();
                const mockParent = new Node();
                const mockUITransform = { convertToWorldSpaceAR: jest.fn(() => v3(100, 200, 0)) };
                mockStartNode.parent = mockParent;
                jest.spyOn(mockParent, "getComponent").mockReturnValue(mockUITransform);
                
                // Act
                const result = slidingChip.createStartNodeInfo(mockStartNode, 100);
                
                // Assert
                expect(result.node).toBe(mockStartNode);
                expect(result.worldPos.x).toBe(100);
                expect(result.worldPos.y).toBe(200);
                expect(result.worldPos.z).toBe(0);
            });

            it("should create node info without start node", () => {
                // Arrange
                const mockChip = new Node();
                mockChip.name = "50";
                const mockUITransform = { 
                    height: 40, 
                    convertToWorldSpaceAR: jest.fn(() => v3(150, 250, 0)) 
                };
                const mockParent = new Node();
                mockChip.parent = mockParent;
                jest.spyOn(mockChip, "getComponent").mockReturnValue(mockUITransform);
                jest.spyOn(mockParent, "getComponent").mockReturnValue(mockUITransform);
                
                slidingChip.chips.children = [mockChip];
                slidingChip["node"] = new Node();
                
                // Act
                const result = slidingChip.createStartNodeInfo(null, 100);
                
                // Assert
                expect(result.node).toBe(slidingChip["node"]);
                expect(result.worldPos.x).toBe(150);
                expect(result.worldPos.y).toBe(250);
                expect(result.worldPos.z).toBe(0);
            });

            it("should handle fallback chip selection", () => {
                // Arrange
                const mockChip1 = new Node();
                mockChip1.name = "10";
                const mockChip2 = new Node();
                mockChip2.name = "50";
                const mockUITransform = { 
                    height: 40, 
                    convertToWorldSpaceAR: jest.fn(() => v3(75, 125, 0)) 
                };
                const mockParent = new Node();
                
                // Set up proper parent-child relationships
                mockChip1.parent = mockParent;
                mockChip2.parent = mockParent;
                jest.spyOn(mockChip1, "getComponent").mockReturnValue(mockUITransform);
                jest.spyOn(mockChip2, "getComponent").mockReturnValue(mockUITransform);
                jest.spyOn(mockParent, "getComponent").mockReturnValue(mockUITransform);
                
                slidingChip.chips.children = [mockChip1, mockChip2];
                slidingChip["node"] = new Node();
                
                // Act
                const result = slidingChip.createStartNodeInfo(null, 100);
                
                // Assert
                expect(result.node).toBe(slidingChip["node"]);
                expect(result.worldPos.x).toBe(75);
                expect(result.worldPos.y).toBe(125);
                expect(result.worldPos.z).toBe(0);
            });
        });

        describe("getChipNode", () => {
            it("should find chip by bet value", () => {
                // Arrange
                const mockChip = new Node();
                mockChip.name = "100";
                slidingChip.chips.children = [mockChip];
                
                // Act
                const result = slidingChip["getChipNode"](100);
                
                // Assert
                expect(result).toBe(mockChip);
            });

            it("should handle missing chip", () => {
                // Arrange
                slidingChip.chips.children = [];
                
                // Act
                const result = slidingChip["getChipNode"](999);
                
                // Assert
                expect(result).toBeUndefined();
            });
        });
    });

    describe("store integration", () => {
        describe("updateChipValues", () => {
            it("should update values and create chips", () => {
                // Arrange
                const createChipsSpy = jest.spyOn(slidingChip, "createChips");
                const updateChipsSpy = jest.spyOn(slidingChip, "updateChips");
                
                // Act
                slidingChip.updateChipValues([100, 500]);
                
                // Assert
                expect(slidingChip.chipValues).toEqual([100, 500]);
                expect(createChipsSpy).toHaveBeenCalled();
                expect(updateChipsSpy).toHaveBeenCalled();
                expect(slidingChip["isCreatedChips"]).toBe(true);
            });
        });

        describe("updateChips", () => {
            it("should initialize and scroll", () => {
                // Act
                slidingChip.updateChips();
                
                // Assert
                expect(mockSnappedScrollView.initCalculatedPercent).toHaveBeenCalled();
                expect(mockSnappedScrollView.scrollTo).toHaveBeenCalledWith(0);
            });
        });

        describe("needResetScrollViewOffset", () => {
            it("should reset scroll view offset", () => {
                // Arrange
                const scrollToPercentSpy = jest.fn();
                mockSnappedScrollView.scrollView = { scrollToPercentHorizontal: scrollToPercentSpy };
                
                // Act
                slidingChip.needResetScrollViewOffset();
                
                // Assert
                expect(scrollToPercentSpy).toHaveBeenCalledWith(0, 0.1, true);
            });
        });

        describe("playSoundClick", () => {
            it("should return click sound ID", () => {
                // Act
                const result = slidingChip.playSoundClick();
                
                // Assert
                expect(result).toBe("click-sound");
            });
        });
    });

    describe("updateChipSetting", () => {
        it("should update chip setting", () => {
            // Arrange
            const mockChipSetting = { 100: "#FF0000", 200: "#00FF00" };
            
            // Act
            slidingChip.updateChipSetting(mockChipSetting);
            
            // Assert
            expect(slidingChip["chipSetting"]).toBe(mockChipSetting);
        });
    });

    describe("setCurrentBet", () => {
        it("should update selected bet", () => {
            // Arrange
            const updateSelectedBetSpy = jest.spyOn(slidingChip, "updateSelectedBet" as any);
            
            // Act
            slidingChip.setCurrentBet("100");
            
            // Assert
            expect(updateSelectedBetSpy).toHaveBeenCalledWith("100");
        });
    });
});

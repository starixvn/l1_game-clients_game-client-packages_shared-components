import { Container } from "inversify";
import { SlidingChipHandler } from "../../../../../../assets/game/sliding-chip/scripts/handlers/sliding-chip-handler";
import { SlidingChipStore } from "../../../../../../assets/game/sliding-chip/scripts/stores/sliding-chip-store";

// Mock external dependencies
jest.mock("@sg/game-client-base", () => ({
    __esModule: true,
    default: {
        Bet: {
            BetStore: jest.fn().mockImplementation(() => ({
                amount: 0,
            })),
        },
        Chips: {
            ChipStore: jest.fn().mockImplementation(() => ({
                chipValuesByStakeLevel: [10, 50, 100, 500, 1000],
                resetChips: jest.fn(),
            })),
        },
        Shared: {
            IHandler: jest.fn(),
        },
    },
}));

jest.mock("../../../../../../assets/game/sliding-chip/scripts/stores/sliding-chip-store", () => ({
    SlidingChipStore: jest.fn().mockImplementation(() => ({
        chipsLength: 0,
        isResetScrollViewOffset: false,
        selectChip: 0,
        currentChip: "0",
        handleClickNext: jest.fn(),
        handleClickPrev: jest.fn(),
        handleSelectChip: jest.fn(),
    })),
}));

jest.mock("mobx");
jest.mock("observer");
jest.mock("observer-component");
jest.mock("reflect-metadata");

describe("SlidingChipHandler", () => {
    let container: Container;
    let mockSlidingChipStore: jest.Mocked<SlidingChipStore>;
    let mockBetStore: any;
    let mockChipStore: any;

    beforeEach(() => {
        container = new Container();
        
        // Create mocked instances
        mockSlidingChipStore = new (jest.requireMock("../../../../../../assets/game/sliding-chip/scripts/stores/sliding-chip-store").SlidingChipStore)();
        mockBetStore = new (jest.requireMock("@sg/game-client-base").default.Bet.BetStore)();
        mockChipStore = new (jest.requireMock("@sg/game-client-base").default.Chips.ChipStore)();
        
        // Bind to container
        container.bind(SlidingChipStore).toConstantValue(mockSlidingChipStore);
        container.bind(jest.requireMock("@sg/game-client-base").default.Bet.BetStore).toConstantValue(mockBetStore);
        container.bind(jest.requireMock("@sg/game-client-base").default.Chips.ChipStore).toConstantValue(mockChipStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("ClickArrow", () => {
        let clickArrowHandler: SlidingChipHandler.ClickArrow;

        beforeEach(() => {
            container.bind(SlidingChipHandler.ClickArrow).toSelf();
            clickArrowHandler = container.get(SlidingChipHandler.ClickArrow);
        });

        describe("handleNext", () => {
            it("should call handleClickNext on store with correct step", async () => {
                // Arrange
                const chipMovingStep = 2;

                // Act
                await clickArrowHandler.handleNext({ chipMovingStep });

                // Assert
                expect(mockSlidingChipStore.handleClickNext).toHaveBeenCalledWith(chipMovingStep);
                expect(mockSlidingChipStore.handleClickNext).toHaveBeenCalledTimes(1);
            });

            it("should handle zero step", async () => {
                // Arrange
                const chipMovingStep = 0;

                // Act
                await clickArrowHandler.handleNext({ chipMovingStep });

                // Assert
                expect(mockSlidingChipStore.handleClickNext).toHaveBeenCalledWith(0);
            });

            it("should handle negative step", async () => {
                // Arrange
                const chipMovingStep = -1;

                // Act
                await clickArrowHandler.handleNext({ chipMovingStep });

                // Assert
                expect(mockSlidingChipStore.handleClickNext).toHaveBeenCalledWith(-1);
            });
        });

        describe("handlePrev", () => {
            it("should call handleClickPrev on store with correct step", async () => {
                // Arrange
                const chipMovingStep = 2;

                // Act
                await clickArrowHandler.handlePrev({ chipMovingStep });

                // Assert
                expect(mockSlidingChipStore.handleClickPrev).toHaveBeenCalledWith(chipMovingStep);
                expect(mockSlidingChipStore.handleClickPrev).toHaveBeenCalledTimes(1);
            });

            it("should handle zero step", async () => {
                // Arrange
                const chipMovingStep = 0;

                // Act
                await clickArrowHandler.handlePrev({ chipMovingStep });

                // Assert
                expect(mockSlidingChipStore.handleClickPrev).toHaveBeenCalledWith(0);
            });


        });
    });

    describe("CreateChips", () => {
        let createChipsHandler: SlidingChipHandler.CreateChips;

        beforeEach(() => {
            container.bind(SlidingChipHandler.CreateChips).toSelf();
            createChipsHandler = container.get(SlidingChipHandler.CreateChips);
        });

        describe("handle", () => {
            it("should set chipsLength on store", async () => {
                // Arrange
                const chipsLength = 5;

                // Act
                await createChipsHandler.handle({ chipsLength });

                // Assert
                expect(mockSlidingChipStore.chipsLength).toBe(chipsLength);
            });

            it("should handle zero chips", async () => {
                // Arrange
                const chipsLength = 0;

                // Act
                await createChipsHandler.handle({ chipsLength });

                // Assert
                expect(mockSlidingChipStore.chipsLength).toBe(0);
            });


        });
    });

    describe("UpdateChips", () => {
        let updateChipsHandler: SlidingChipHandler.UpdateChips;

        beforeEach(() => {
            container.bind(SlidingChipHandler.UpdateChips).toSelf();
            updateChipsHandler = container.get(SlidingChipHandler.UpdateChips);
        });

        describe("handle", () => {
            it("should update bet store amount when current chip exists in chip values", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [10, 50, 100, 500, 1000];
                mockSlidingChipStore.currentChip = "100";

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockBetStore.amount).toBe(100);
                expect(mockSlidingChipStore.isResetScrollViewOffset).toBe(false);
            });

            it("should use first chip value when current chip not in chip values", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [10, 50, 100, 500, 1000];
                mockSlidingChipStore.currentChip = "75";

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockBetStore.amount).toBe(10);
                expect(mockSlidingChipStore.isResetScrollViewOffset).toBe(true);
            });

            it("should return early when no chip values available", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [];
                mockSlidingChipStore.currentChip = "100";

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockBetStore.amount).toBe(0); // Should remain unchanged
            });

            it("should throw error when chip values is null", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = null;
                mockSlidingChipStore.currentChip = "100";

                // Act & Assert
                await expect(updateChipsHandler.handle()).rejects.toThrow(TypeError);
            });

            it("should throw error when chip values is undefined", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = undefined;
                mockSlidingChipStore.currentChip = "100";

                // Act & Assert
                await expect(updateChipsHandler.handle()).rejects.toThrow(TypeError);
            });

            it("should handle string chip values", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = ["10", "50", "100"];
                mockSlidingChipStore.currentChip = "50";

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockBetStore.amount).toBe(50);
            });

            it("should handle mixed number and string chip values", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [10, "50", 100];
                mockSlidingChipStore.currentChip = "50";

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockBetStore.amount).toBe(50);
            });

            it("should set isResetScrollViewOffset to true when chip changed", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [10, 50, 100];
                mockSlidingChipStore.currentChip = "75"; // Not in chip values

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockSlidingChipStore.isResetScrollViewOffset).toBe(true);
            });

            it("should set isResetScrollViewOffset to false when chip unchanged", async () => {
                // Arrange
                mockChipStore.chipValuesByStakeLevel = [10, 50, 100];
                mockSlidingChipStore.currentChip = "50"; // Exists in chip values

                // Act
                await updateChipsHandler.handle();

                // Assert
                expect(mockSlidingChipStore.isResetScrollViewOffset).toBe(false);
            });
        });
    });

    describe("UpdateSelectChip", () => {
        let updateSelectChipHandler: SlidingChipHandler.UpdateSelectChip;

        beforeEach(() => {
            container.bind(SlidingChipHandler.UpdateSelectChip).toSelf();
            updateSelectChipHandler = container.get(SlidingChipHandler.UpdateSelectChip);
        });

        describe("handle", () => {
            it("should call handleSelectChip on store with correct parameters", async () => {
                // Arrange
                const displayMin = 2;
                const displaySize = 5;

                // Act
                await updateSelectChipHandler.handle({ displayMin, displaySize });

                // Assert
                expect(mockSlidingChipStore.handleSelectChip).toHaveBeenCalledWith(displayMin, displaySize);
                expect(mockSlidingChipStore.handleSelectChip).toHaveBeenCalledTimes(1);
            });

            it("should handle zero values", async () => {
                // Arrange
                const displayMin = 0;
                const displaySize = 0;

                // Act
                await updateSelectChipHandler.handle({ displayMin, displaySize });

                // Assert
                expect(mockSlidingChipStore.handleSelectChip).toHaveBeenCalledWith(0, 0);
            });


        });
    });

    describe("SetSelectChip", () => {
        let setSelectChipHandler: SlidingChipHandler.SetSelectChip;

        beforeEach(() => {
            container.bind(SlidingChipHandler.SetSelectChip).toSelf();
            setSelectChipHandler = container.get(SlidingChipHandler.SetSelectChip);
        });

        describe("handle", () => {
            it("should set selectChip on store", async () => {
                // Arrange
                const selectedChip = 3;

                // Act
                await setSelectChipHandler.handle({ selectedChip });

                // Assert
                expect(mockSlidingChipStore.selectChip).toBe(selectedChip);
            });

            it("should handle zero selection", async () => {
                // Arrange
                const selectedChip = 0;

                // Act
                await setSelectChipHandler.handle({ selectedChip });

                // Assert
                expect(mockSlidingChipStore.selectChip).toBe(0);
            });


        });
    });

    describe("UpdateCurrentBet", () => {
        let updateCurrentBetHandler: SlidingChipHandler.UpdateCurrentBet;

        beforeEach(() => {
            container.bind(SlidingChipHandler.UpdateCurrentBet).toSelf();
            updateCurrentBetHandler = container.get(SlidingChipHandler.UpdateCurrentBet);
        });

        describe("handle", () => {
            it("should update currentChip on store and amount on bet store", async () => {
                // Arrange
                const bet = "250";

                // Act
                await updateCurrentBetHandler.handle({ bet });

                // Assert
                expect(mockSlidingChipStore.currentChip).toBe("250");
                expect(mockBetStore.amount).toBe(250);
            });

            it("should handle zero bet", async () => {
                // Arrange
                const bet = "0";

                // Act
                await updateCurrentBetHandler.handle({ bet });

                // Assert
                expect(mockSlidingChipStore.currentChip).toBe("0");
                expect(mockBetStore.amount).toBe(0);
            });

            it("should handle string bet with decimals", async () => {
                // Arrange
                const bet = "100.50";

                // Act
                await updateCurrentBetHandler.handle({ bet });

                // Assert
                expect(mockSlidingChipStore.currentChip).toBe("100.50");
                expect(mockBetStore.amount).toBe(100.50);
            });

            it("should handle invalid numeric string", async () => {
                // Arrange
                const bet = "invalid";

                // Act
                await updateCurrentBetHandler.handle({ bet });

                // Assert
                expect(mockSlidingChipStore.currentChip).toBe("invalid");
                expect(mockBetStore.amount).toBeNaN();
            });
        });
    });

    describe("ResetChips", () => {
        let resetChipsHandler: SlidingChipHandler.ResetChips;

        beforeEach(() => {
            container.bind(SlidingChipHandler.ResetChips).toSelf();
            resetChipsHandler = container.get(SlidingChipHandler.ResetChips);
        });

        describe("handle", () => {
            it("should call resetChips on chip store", async () => {
                // Act
                await resetChipsHandler.handle();

                // Assert
                expect(mockChipStore.resetChips).toHaveBeenCalled();
                expect(mockChipStore.resetChips).toHaveBeenCalledTimes(1);
            });


        });
    });
});

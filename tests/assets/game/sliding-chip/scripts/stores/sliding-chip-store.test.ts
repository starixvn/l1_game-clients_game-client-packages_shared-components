import { Container } from "inversify";
import { SlidingChipStore } from "../../../../../../assets/game/sliding-chip/scripts/stores/sliding-chip-store";

// Mock external dependencies
jest.mock("@sg/game-client-base", () => ({
    __esModule: true,
    default: {
        PlayerSelections: {
            PlayerSelectionStore: jest.fn().mockImplementation(() => ({
                chip: 0,
            })),
        },
    },
}));

jest.mock("mobx", () => ({
    makeAutoObservable: jest.fn(),
    when: jest.fn(),
}));

jest.mock("observer");
jest.mock("observer-component");
jest.mock("reflect-metadata");

describe("SlidingChipStore", () => {
    let container: Container;
    let store: SlidingChipStore;
    let mockPlayerSelectionStore: any;
    let mockMobx: any;

    beforeEach(() => {
        container = new Container();
        
        // Create mocked player selection store
        mockPlayerSelectionStore = new (jest.requireMock("@sg/game-client-base").default.PlayerSelections.PlayerSelectionStore)();
        mockMobx = jest.requireMock("mobx");
        
        // Bind to container
        container.bind(jest.requireMock("@sg/game-client-base").default.PlayerSelections.PlayerSelectionStore).toConstantValue(mockPlayerSelectionStore);
        container.bind(SlidingChipStore).toSelf();
        
        store = container.get(SlidingChipStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should call makeAutoObservable", () => {
            // Assert
            expect(mockMobx.makeAutoObservable).toHaveBeenCalledWith(store);
        });

        it("should set up mobx.when reaction for playerSelectionStore.chip", () => {
            // Assert
            expect(mockMobx.when).toHaveBeenCalledWith(
                expect.any(Function),
                expect.any(Function)
            );
        });

        it("should update selectChip when playerSelectionStore.chip changes", () => {
            // Arrange
            mockPlayerSelectionStore.chip = 5;
            const [conditionFn, effectFn] = mockMobx.when.mock.calls[0];
            
            // Act
            const conditionResult = conditionFn();
            if (conditionResult) {
                effectFn();
            }
            
            // Assert
            expect(conditionResult).toBe(true);
            expect(store.selectChip).toBe(5);
        });

        it("should not trigger effect when playerSelectionStore.chip is falsy", () => {
            // Arrange
            mockPlayerSelectionStore.chip = 0;
            const [conditionFn] = mockMobx.when.mock.calls[0];
            
            // Act
            const conditionResult = conditionFn();
            
            // Assert
            expect(conditionResult).toBe(false);
        });

        it("should not trigger effect when playerSelectionStore is undefined", () => {
            // Arrange
            Object.defineProperty(store, 'playerSelectionStore', {
                value: undefined,
                writable: true,
                configurable: true
            });
            const [conditionFn] = mockMobx.when.mock.calls[0];
            
            // Act
            const conditionResult = conditionFn();
            
            // Assert
            expect(conditionResult).toBe(false);
        });
    });

    describe("initial state", () => {
        it("should have correct initial values", () => {
            // Assert
            expect(store.chipsLength).toBe(0);
            expect(store.isResetScrollViewOffset).toBe(false);
            expect(store.currentChip).toBe("0");
            expect(store.selectChip).toBe(0);
        });
    });

    describe("selectChip getter/setter", () => {
        it("should get selectChip value", () => {
            // Arrange
            store["_selectChip"] = 3;
            
            // Act
            const result = store.selectChip;
            
            // Assert
            expect(result).toBe(3);
        });

        it("should set selectChip value", () => {
            // Act
            store.selectChip = 5;
            
            // Assert
            expect(store["_selectChip"]).toBe(5);
            expect(store.selectChip).toBe(5);
        });
    });

    describe("currentChip getter/setter", () => {
        it("should get currentChip value", () => {
            // Arrange
            store["_currentChip"] = "100";
            
            // Act
            const result = store.currentChip;
            
            // Assert
            expect(result).toBe("100");
        });

        it("should set currentChip value", () => {
            // Act
            store.currentChip = "250";
            
            // Assert
            expect(store["_currentChip"]).toBe("250");
            expect(store.currentChip).toBe("250");
        });
    });

    describe("onLoad", () => {
        it("should set selectChip to minChipSelect", () => {
            // Arrange
            const minChipSelect = 2;
            
            // Act
            store.onLoad(minChipSelect);
            
            // Assert
            expect(store.selectChip).toBe(2);
        });

        it("should handle zero minChipSelect", () => {
            // Act
            store.onLoad(0);
            
            // Assert
            expect(store.selectChip).toBe(0);
        });
    });

    describe("handleClickNext", () => {
        it("should increase selectChip by step", () => {
            // Arrange
            store.selectChip = 2;
            const step = 3;
            
            // Act
            store.handleClickNext(step);
            
            // Assert
            expect(store.selectChip).toBe(5);
        });

        it("should handle zero step", () => {
            // Arrange
            store.selectChip = 2;
            
            // Act
            store.handleClickNext(0);
            
            // Assert
            expect(store.selectChip).toBe(2);
        });

        it("should handle negative step", () => {
            // Arrange
            store.selectChip = 5;
            
            // Act
            store.handleClickNext(-2);
            
            // Assert
            expect(store.selectChip).toBe(3);
        });
    });

    describe("handleClickPrev", () => {
        it("should decrease selectChip by step", () => {
            // Arrange
            store.selectChip = 5;
            const step = 2;
            
            // Act
            store.handleClickPrev(step);
            
            // Assert
            expect(store.selectChip).toBe(3);
        });

        it("should handle zero step", () => {
            // Arrange
            store.selectChip = 5;
            
            // Act
            store.handleClickPrev(0);
            
            // Assert
            expect(store.selectChip).toBe(5);
        });

        it("should handle negative step", () => {
            // Arrange
            store.selectChip = 2;
            
            // Act
            store.handleClickPrev(-3);
            
            // Assert
            expect(store.selectChip).toBe(5);
        });
    });

    describe("handleSelectChip", () => {
        describe("when selectChip is less than displayMin", () => {
            it("should set selectChip to displayMin when it fits within constraints", () => {
                // Arrange
                store.selectChip = 1;
                store.chipsLength = 10;
                const displayMin = 3;
                const displaySize = 5;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(3);
            });

            it("should limit selectChip to chipsLength - displaySize when displayMin exceeds limit", () => {
                // Arrange
                store.selectChip = 0;
                store.chipsLength = 8;
                const displayMin = 6;
                const displaySize = 5;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(3); // Math.min(6, 8-5) = 3
            });
        });

        describe("when selectChip is greater than displayMin + displaySize - 1", () => {
            it("should set selectChip to displayMin + displaySize - 1", () => {
                // Arrange
                store.selectChip = 10;
                const displayMin = 2;
                const displaySize = 5;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(6); // 2 + 5 - 1 = 6
            });
        });

        describe("when selectChip is within valid range", () => {
            it("should not change selectChip", () => {
                // Arrange
                store.selectChip = 4;
                const displayMin = 2;
                const displaySize = 5;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(4);
            });
        });

        describe("edge cases", () => {
            it("should handle zero displaySize", () => {
                // Arrange
                store.selectChip = 5;
                const displayMin = 2;
                const displaySize = 0;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(1); // displayMin + displaySize - 1 = 2 + 0 - 1 = 1
            });

            it("should handle negative displayMin", () => {
                // Arrange
                store.selectChip = -5;
                store.chipsLength = 10;
                const displayMin = -2;
                const displaySize = 3;
                
                // Act
                store.handleSelectChip(displayMin, displaySize);
                
                // Assert
                expect(store.selectChip).toBe(-2); // Math.min(-2, 10-3) = Math.min(-2, 7) = -2
            });
        });
    });

    describe("public properties", () => {
        it("should allow setting and getting chipsLength", () => {
            // Act
            store.chipsLength = 8;
            
            // Assert
            expect(store.chipsLength).toBe(8);
        });

        it("should allow setting and getting isResetScrollViewOffset", () => {
            // Act
            store.isResetScrollViewOffset = true;
            
            // Assert
            expect(store.isResetScrollViewOffset).toBe(true);
        });
    });
});

import gc from "@sg/game-client-base";
import { Scoreboard } from "db://shared-components/game/scoreboards/scripts/components/scoreboard";
import { ScoreboardBeadRoad } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-bead-road";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { ScoreboardDataReceiver } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-data-receiver";
import { ScoreboardDerived } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-derived";

jest.mock("sc-scoreboards", () => ({
    __esModule: true,
    default: {
        Converter: jest.fn().mockImplementation(() => ({
            convert: jest.fn(),
            group: jest.fn(),
            positiveKey: jest.fn(),
            specialKey: jest.fn(),
        })),
    },
}));

describe(ScoreboardDataReceiver.name, () => {
    let component: ScoreboardDataReceiver;
    let beadRoad: Scoreboard;
    let bigRoad: Scoreboard;
    let converter: ScoreboardDataConverter;

    const createMockRoundHistory = (id: number): gc.RoundHistories.RoundHistory => ({
        roundId: id,
        result: {},
        settlementResult: {},
    });

    beforeEach(() => {
        component = new ScoreboardDataReceiver();
        converter = new ScoreboardDataConverter();

        converter.properties = [
            { key: "keyOfA", value: "a" },
            { key: "blinkKey", value: "blink" },
            { key: "tieKey", value: "tie" },
        ];

        converter.convert = jest.fn().mockImplementation((rounds) => {
            if (Array.isArray(rounds)) {
                return rounds.map((round) => round.settlementResult);
            }
            return rounds.settlementResult;
        });

        converter.createRound = jest.fn().mockImplementation(() => ({
            settlementResult: {
                a: false,
                blink: false,
                tie: false,
            },
        }));

        bigRoad = {
            render: jest.fn(),
            getComponent: jest.fn().mockImplementation((componentType) => {
                if (componentType === ScoreboardDataConverter) {
                    return converter;
                }
                if (componentType === ScoreboardDerived) {
                    return {
                        render: jest.fn(),
                    };
                }
                return null;
            }),
        } as any;

        beadRoad = {
            render: jest.fn(),
            getComponent: jest.fn().mockImplementation((componentType) => {
                if (componentType === ScoreboardDataConverter) {
                    return converter;
                }
                if (componentType === ScoreboardBeadRoad) {
                    return {
                        render: jest.fn(),
                    };
                }
                return null;
            }),
        } as any;

        component.scoreboards = [bigRoad, beadRoad];
    });

    describe("render", () => {
        describe("when called", () => {
            it("should cache input in memory", () => {
                // Act
                const rounds = [createMockRoundHistory(1), createMockRoundHistory(2), createMockRoundHistory(3)];
                component.render(rounds);

                // Assert
                expect(component["rounds"]).toStrictEqual([rounds[2], rounds[1], rounds[0]]);
            });

            it("should render big road scoreboard", () => {
                // Act
                const rounds = [createMockRoundHistory(1), createMockRoundHistory(2), createMockRoundHistory(3)];
                component.render(rounds);

                // Assert
                expect(bigRoad.render).toBeCalledWith([rounds[2], rounds[1], rounds[0]]);
            });

            it("should render bead road scoreboard", () => {
                // Act
                const rounds = [createMockRoundHistory(1), createMockRoundHistory(2), createMockRoundHistory(3)];
                component.render(rounds);

                // Assert
                expect(beadRoad.render).toBeCalledWith([rounds[2], rounds[1], rounds[0]]);
            });
        });

        describe("and the big road is undefined", () => {
            it("should not render big road scoreboard", () => {
                // Arrange
                component["bigRoad"] = undefined;
                Object.defineProperty(component, "scoreboards", {
                    value: [beadRoad], // Remove bigRoad from scoreboards array
                    writable: true,
                });

                // Act
                const rounds = [createMockRoundHistory(1), createMockRoundHistory(2), createMockRoundHistory(3)];
                component.render(rounds);

                // Assert
                expect(bigRoad.render).toBeCalledTimes(0);
            });
        });

        describe("and the bead road is undefined", () => {
            it("should not render bead road scoreboard", () => {
                // Arrange
                component["beadRoad"] = undefined;
                Object.defineProperty(component, "scoreboards", {
                    value: [bigRoad], // Remove beadRoad from scoreboards array
                    writable: true,
                });

                // Act
                const rounds = [createMockRoundHistory(1), createMockRoundHistory(2), createMockRoundHistory(3)];
                component.render(rounds);

                // Assert
                expect(beadRoad.render).toBeCalledTimes(0);
            });
        });
    });

    describe("setLastRound", () => {
        describe("when called", () => {
            it("should set last round to the property", () => {
                // Act
                const round = createMockRoundHistory(1);
                component.setLastRound(round);

                // Assert
                expect(component["lastRound"]).toBe(round);
            });
        });
    });

    describe("toggleBlinkNode", () => {
        describe("when the active flag is false", () => {
            it("should do nothing", () => {
                // Act
                component.toggleBlinkNode(false);

                // Assert
                expect(bigRoad.getComponent).toBeCalledTimes(0);
            });
        });

        describe("when the active flag is true", () => {
            describe("when beadRoad is null & bigRoad not null", () => {
                beforeEach(() => {
                    component.scoreboards = [bigRoad];
                });
                it("should get converter component", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(bigRoad.getComponent).toBeCalledWith(ScoreboardDataConverter);
                });

                it("should create a new round", () => {
                    // Arrange
                    jest.spyOn(converter, "createRound");

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(converter.createRound).toBeCalled();
                });

                it("should render the big road", () => {
                    // Arrange
                    const round = createMockRoundHistory(1);
                    round.settlementResult = { a: true };
                    component.setLastRound(round);
                    component["rounds"] = [round];

                    const mockDerivedScoreboard = {
                        render: jest.fn(),
                    };
                    (bigRoad.getComponent as jest.Mock).mockImplementation((componentType) => {
                        if (componentType === ScoreboardDataConverter) {
                            return converter;
                        }
                        if (componentType === ScoreboardDerived) {
                            return mockDerivedScoreboard;
                        }
                        return null;
                    });

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(mockDerivedScoreboard.render).toBeCalledWith([round], { hasBlinkNode: true });
                });
            });

            describe("when bigRoad is null & beadRoad not null", () => {
                beforeEach(() => {
                    component.scoreboards = [beadRoad];
                    (beadRoad.getComponent as jest.Mock).mockImplementation((componentType) => {
                        if (componentType === ScoreboardDataConverter) {
                            return converter;
                        }
                        if (componentType === ScoreboardBeadRoad) {
                            return {
                                render: jest.fn(),
                            };
                        }
                        return null;
                    });
                });

                it("should get converter component", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(beadRoad.getComponent).toBeCalledWith(ScoreboardDataConverter);
                });

                it("should create a new round", () => {
                    // Arrange
                    jest.spyOn(converter, "createRound");

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(converter.createRound).toBeCalled();
                });

                it("should render the bead road", () => {
                    // Arrange
                    const round = createMockRoundHistory(1);
                    round.settlementResult = {
                        a: true,
                        blink: false,
                        tie: false,
                    };
                    component["rounds"] = [round];

                    const mockBeadRoadScoreboard = {
                        render: jest.fn(),
                    };
                    (beadRoad.getComponent as jest.Mock).mockImplementation((componentType) => {
                        if (componentType === ScoreboardDataConverter) {
                            return converter;
                        }
                        if (componentType === ScoreboardBeadRoad) {
                            return mockBeadRoadScoreboard;
                        }
                        return null;
                    });

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(mockBeadRoadScoreboard.render).toBeCalledWith([
                        round,
                        {
                            settlementResult: {
                                a: true,
                                blink: true,
                                tie: false,
                            },
                        },
                    ]);
                });
            });

            describe("and the big road is null & bead road is null", () => {
                beforeEach(() => {
                    component["bigRoad"] = null;
                    component["beadRoad"] = null;
                    component.scoreboards = [bigRoad];
                });

                it("should not render the big road", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(bigRoad.render).not.toHaveBeenCalled();
                });

                it("should not render the bead road", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(beadRoad.render).not.toHaveBeenCalled();
                });
            });
        });
    });
});

import { Scoreboard } from "db://shared-components/game/scoreboards/scripts/components/scoreboard";
import { ScoreboardDataConverter } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-converter";
import { ScoreboardDataReceiver } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-data-receiver";

describe(ScoreboardDataReceiver.name, () => {
    let component: ScoreboardDataReceiver;
    let beadRoad: Scoreboard;
    let bigRoad: Scoreboard;
    let converter: ScoreboardDataConverter;

    beforeEach(() => {
        component = new ScoreboardDataReceiver();
        converter = new ScoreboardDataConverter();

        converter.properties = [
            { key: "keyOfA", value: "a" },
            { key: "blinkKey", value: "blink" },
            { key: "tieKey", value: "tie" },
        ];

        bigRoad = {
            render: jest.fn(),
            getComponent: jest.fn().mockReturnValue(converter),
        } as any;

        beadRoad = {
            render: jest.fn(),
            getComponent: jest.fn().mockReturnValue(converter),
        } as any;

        component["bigRoad"] = bigRoad;
        component["beadRoad"] = beadRoad;
    });

    describe("render", () => {
        describe("when called", () => {
            it("should cache input in memory", () => {
                // Act
                component.render([1, 2, 3]);

                // Assert
                expect(component["rounds"]).toStrictEqual([3, 2, 1]);
            });

            it("should render big road scoreboard", () => {
                // Act
                component.render([1, 2, 3]);

                // Assert
                expect(bigRoad.render).toBeCalledWith([3, 2, 1]);
            });

            it("should render bead road scoreboard", () => {
                // Act
                component.render([1, 2, 3]);

                // Assert
                expect(beadRoad.render).toBeCalledWith([3, 2, 1]);
            });
        });

        describe("and the big road is undefined", () => {
            it("should not render big road scoreboard", () => {
                // Arrange
                component["bigRoad"] = undefined;

                // Act
                component.render([1, 2, 3]);

                // Assert
                expect(bigRoad.render).toBeCalledTimes(0);
            });
        });

        describe("and the bead road is undefined", () => {
            it("should not render bead road scoreboard", () => {
                // Arrange
                component["beadRoad"] = undefined;

                // Act
                component.render([1, 2, 3]);

                // Assert
                expect(beadRoad.render).toBeCalledTimes(0);
            });
        });
    });

    describe("setLastRound", () => {
        describe("when called", () => {
            it("should set last round to the property", () => {
                // Act
                component.setLastRound(1);

                // Assert
                expect(component["lastRound"]).toBe(1);
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
                    component["beadRoad"] = null;
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
                    component.setLastRound({ settlementResult: { a: true } });

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(bigRoad.render).toBeCalledWith([
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

            describe("when bigRoad is null & beadRoad not null", () => {
                const gridSetting = { row: 2, column: 2 };
                beforeEach(() => {
                    component["bigRoad"] = null;
                    (beadRoad.getComponent as jest.Mock).mockReturnValueOnce(converter).mockReturnValueOnce({ settings: gridSetting });
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
                    const round = {
                        settlementResult: {
                            a: true,
                            blink: false,
                            tie: false,
                        },
                    };
                    component["rounds"] = [round, round, round, round];

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(beadRoad.render).toBeCalledWith([
                        round,
                        round,
                        round,
                        {
                            settlementResult: {
                                a: false,
                                blink: true,
                                tie: false,
                            },
                        },
                    ]);
                });
            });

            describe("and the big road is null & bead road is null", () => {
                beforeEach(() => {
                    component["bigRoad"] = undefined;
                    component["beadRoad"] = null;
                });
                it("should not render the big road", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(bigRoad.render).toBeCalledTimes(0);
                });
                it("should not render the bead road", () => {
                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(beadRoad.render).toBeCalledTimes(0);
                });
            });
        });
    });
});

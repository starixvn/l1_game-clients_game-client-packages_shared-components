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

            it("should push a round to cache", () => {
                // Act
                component.toggleBlinkNode(true);

                // Assert
                expect(component["rounds"]).toStrictEqual([
                    {
                        settlementResult: {
                            a: undefined,
                            blink: true,
                            tie: false,
                        },
                    },
                ]);
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

            describe("and the big road is undefined", () => {
                it("should not render the big road", () => {
                    // Arrange
                    component["bigRoad"] = undefined;

                    // Act
                    component.toggleBlinkNode(true);

                    // Assert
                    expect(bigRoad.render).toBeCalledTimes(0);
                });
            });
        });
    });
});

import { StatisticContainer } from "../../../../assets/game/statistic/scripts/statistic-container";
import { InGameMenuEvents } from "../../../../assets/game/in-game-menu/scripts/stores/in-game-menu-events";

describe("StatisticContainer", () => {
    let statisticContainer: StatisticContainer;

    beforeEach(() => {
        statisticContainer = new StatisticContainer();
    });

    describe("openGuide", () => {
        it("should call createNode when event is OPEN_STATISTIC", () => {
            // Arrange
            const event = { event: InGameMenuEvents.OPEN_STATISTIC };
            const createNodeSpy = jest.spyOn(statisticContainer, "createNode");

            // Act
            statisticContainer.openGuide(event);

            // Assert
            expect(createNodeSpy).toHaveBeenCalled();
        });

        it("should not call createNode when event is not OPEN_STATISTIC", () => {
            // Arrange
            const event = { event: InGameMenuEvents.OPEN_GUIDE };
            const createNodeSpy = jest.spyOn(statisticContainer, "createNode");

            // Act
            statisticContainer.openGuide(event);

            // Assert
            expect(createNodeSpy).not.toHaveBeenCalled();
        });

        it("should handle null event gracefully", () => {
            // Arrange
            const event = { event: null as any };
            const createNodeSpy = jest.spyOn(statisticContainer, "createNode");

            // Act
            expect(() => statisticContainer.openGuide(event)).not.toThrow();

            // Assert
            expect(createNodeSpy).not.toHaveBeenCalled();
        });
    });
});

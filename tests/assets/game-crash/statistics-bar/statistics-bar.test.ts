import { Node } from "cc";
import { StatisticsBar } from "./../../../../assets/game-crash/statistics-bar/statistics-bar";
describe("StatisticsBar", () => {
    let comp: StatisticsBar;
    beforeEach(() => {
        comp = new StatisticsBar();
        comp.content = new Node();
    });
    describe("setRoundsInfo", () => {
        it("should return rounds have 2 items", () => {
            //Arrange
            const rounds = [
                {
                    roundId: 123,
                    result: [2],
                    md5Result: null,
                    settlementResult: null,
                },
                {
                    roundId: 124,
                    result: [3],
                    md5Result: null,
                    settlementResult: null,
                },
            ];
            comp["updateStatisticsBarInfo"] = jest.fn();

            //Act
            comp.setRoundsInfo(rounds);

            //Assert
            expect(comp["updateStatisticsBarInfo"]).toBeCalledWith(rounds);
        });
    });
});

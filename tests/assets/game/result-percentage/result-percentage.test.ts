import { ResultPercentage } from "../../../../assets/game/result-percentage/scripts/result-percentage";
describe("ResultPercentage", () => {
    let component: ResultPercentage;
    beforeEach(() => {
        component = new ResultPercentage();
        component.supportChoices = "dragon,tiger,tie";
        component.generateOriginalChoices();
    });
    describe("calculateWinPercentage", () => {
        it("should sort ascending value, then round up with first", () => {
            // Arrange
            const roundHistory = [];
            const pushData = (choice, count) => {
                for (let i = 0; i < count; i++) {
                    roundHistory.push({
                        settlementResult: { [choice]: true },
                    });
                }
            };
            pushData("dragon", 51);
            pushData("tiger", 50);
            pushData("tie", 1);

            // Act
            const percentage = component.calculateWinPercentage(component.originalChoices, roundHistory);

            // Assert
            expect(percentage["tie"]).toEqual("1");
            expect(percentage["tiger"]).toEqual("49");
            expect(percentage["dragon"]).toEqual("50");
        });
    });
});

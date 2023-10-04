import { BetAmountItem } from "../../../../assets/game/bet-input/scripts/components/bet-amount-item";

describe("BetAmountItem", () => {
    let component: BetAmountItem;
    beforeEach(() => {
        component = new BetAmountItem();
    });
    describe("onBetAmountItemClick", () => {
        it("should return node name", () => {
            // Arrange
            const event = { target: { name: "100" } };

            // Act
            const onBetAmountItemClick = component.onBetAmountItemClick(event);

            // Assert
            expect(onBetAmountItemClick).toEqual(100);
        });
    });
});

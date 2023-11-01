import { Label } from "cc";

import { BetAmountItem } from "../../../../assets/game-crash/bet-input/scripts/components/bet-amount-item";

describe("BetAmountItem", () => {
    let component: BetAmountItem;
    beforeEach(() => {
        component = new BetAmountItem();
        component.lblBetAmount = new Label();
    });

    describe("setBetAmountItem", () => {
        const amount = "100";
        beforeEach(() => {
            // Act
            component.setBetAmountItem(amount);
        });

        it("should set node name is amount", () => {
            // Assert
            expect(component.node.name).toEqual(amount);
        });

        it("should update bet amount label", () => {
            // Arrange
            const amount = "100";

            // Act
            component.setBetAmountItem(amount);

            // Assert
            expect(component.lblBetAmount.string).toEqual(`+${amount}`);
        });
    });

    describe("onClickBetAmountItem", () => {
        it("should return node name", () => {
            // Arrange
            const event = { target: { name: "100" } };

            // Act
            const onBetAmountItemClick = component["onClickBetAmountItem"](event);

            // Assert
            expect(onBetAmountItemClick).toEqual(100);
        });
    });
});

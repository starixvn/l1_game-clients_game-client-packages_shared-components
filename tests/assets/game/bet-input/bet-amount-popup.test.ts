import { Button, Label, Node, UIOpacity } from "cc";

import { BetAmountItem } from "../../../../assets/game/bet-input/scripts/components/bet-amount-item";
import { BetAmountPopup } from "../../../../assets/game/bet-input/scripts/components/bet-amount-popup";

describe("BetAmountPopup", () => {
    let component: BetAmountPopup;
    beforeEach(() => {
        component = new BetAmountPopup();
        component.nodeBetContainer = new Node();
        component.lblBetAmount = new Label();
        component.btnConfirm = new Button();
    });
    describe("initBetAmount", () => {
        it("should add bet amount item into betContainer node", () => {
            // Arrange
            const chips = ["1", "5", "10", "50", "100", "200", "500", "1000", "2000"];
            const setBetAmountItemSpy = jest.spyOn(BetAmountItem.prototype, "setBetAmountItem").mockImplementation(jest.fn());

            // Act
            component["initBetAmount"](chips);

            // Assert
            expect(setBetAmountItemSpy).toBeCalledTimes(chips.length);
        });
    });

    describe("setBetAmountPopupVisibilty", () => {
        it("should show bet amount popup if set true", () => {
            // Arrange

            // Act
            component["setBetAmountPopupVisibilty"](true);

            // Assert
            expect(component.node.active).toEqual(true);
        });

        it("should hide bet amount popup if set false", () => {
            // Arrange

            // Act
            component["setBetAmountPopupVisibilty"](false);

            // Assert
            expect(component.node.active).toEqual(false);
        });
    });

    describe("updateBetAmount", () => {
        beforeEach(() => {
            // Arrange
            const amount = 100;
            component["checkConfirmBtnStatus"] = jest.fn();

            // Act
            component["updateBetAmount"](amount);
        });

        it("should update bet amount label", () => {
            // Assert
            expect(component.lblBetAmount.string).toMatch("100");
        });

        it("should call checkConfirmBtnStatus()", () => {
            // Assert
            expect(component["checkConfirmBtnStatus"]).toBeCalled();
        });
    });

    describe("checkConfirmBtnStatus", () => {
        describe("when set status=true", () => {
            beforeEach(() => {
                // Act
                component["checkConfirmBtnStatus"](true);
            });

            it("should have click event", () => {
                // Assert
                expect(component.btnConfirm.interactable).toEqual(true);
            });

            it("should set opacitty is 255", () => {
                // Assert
                expect(component.btnConfirm.node.getComponent(UIOpacity).opacity).toEqual(255);
            });
        });

        describe("when set status=false", () => {
            it("should not click", () => {
                // Act
                component["checkConfirmBtnStatus"](false);

                // Assert
                expect(component.btnConfirm.interactable).toEqual(false);
            });

            it("should set opacitty is 100", () => {
                const btnOpacity = component.btnConfirm.node.getComponent(UIOpacity);

                // Act
                component["checkConfirmBtnStatus"](false);

                // Assert
                expect(btnOpacity.opacity).toEqual(100);
            });
        });
    });
});

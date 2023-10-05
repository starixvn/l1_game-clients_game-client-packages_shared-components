import { Node } from "cc";

import { BetAmountPopupContainer } from "../../../../assets/game/bet-input/scripts/bet-amount-popup-container";

describe("BetAmountPopupContainer", () => {
    let component: BetAmountPopupContainer;
    beforeEach(() => {
        component = new BetAmountPopupContainer();
        component.nodeOverlay = new Node();
    });

    describe("renderOpenBetAmountPopup", () => {
        beforeEach(() => {
            // Arrange
            component.createNode = jest.fn();
        });

        describe("when isOpenBetAmountPopup=true", () => {
            it("should show overlay node", () => {
                // Act
                component["renderOpenBetAmountPopup"](true);

                // Assert
                expect(component.nodeOverlay.active).toEqual(true);
            });
        });

        describe("when isOpenBetAmountPopup=false", () => {
            it("should hide overlay node", () => {
                // Act
                component["renderOpenBetAmountPopup"](false);

                // Assert
                expect(component.nodeOverlay.active).toEqual(false);
            });
        });

        it("should call createNode()", () => {
            // Act
            component["renderOpenBetAmountPopup"](true);

            // Assert
            expect(component.createNode).toBeCalled;
        });
    });
});

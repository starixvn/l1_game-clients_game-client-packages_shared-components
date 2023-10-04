import { Button, instantiate, Label, Node, UIOpacity } from "cc";

import { BetInput } from "../../../../assets/game/bet-input/scripts/bet-input";

describe("BetInput", () => {
    let component: BetInput;
    beforeEach(() => {
        component = new BetInput();
        component.nodeBetAmountPopup = new Node();
        component.lblBetAmount = new Label();
        component.nodeOverlay = new Node();
    });
    describe("initBetAmountPopup", () => {
        it("should call instantiate() and addChild()", () => {
            // Arrange
            component.nodeBetAmountPopup.destroyAllChildren();

            // Act
            component.initBetAmountPopup();

            // Assert
            expect(instantiate).toBeCalled();
            expect(component.nodeBetAmountPopup.addChild).toBeCalled();
        });
    });

    describe("updateBetAmount", () => {
        beforeEach(() => {
            component.lblBetAmount.string = "20";
        });
        describe("when amount > 0", () => {
            it("should update bet amount label", () => {
                // Arrange
                const amount = 10;

                // Act
                component.updateBetAmount(amount);

                // Assert
                expect(component.lblBetAmount.string).toEqual("10");
            });
        });

        describe("when amount <= 0", () => {
            it("should not update bet amount label", () => {
                // Arrange
                const amount = 0;

                // Act
                component.updateBetAmount(amount);

                // Assert
                expect(component.lblBetAmount.string).toEqual("20");
            });
        });
    });

    describe("handleBetButtons", () => {
        it("should call handleStakeButtonQuickChange 2 times", () => {
            // Arrange
            const buttonStatus = {
                descreaseStatus: true,
                increaseStatus: true,
            };
            component.handleStakeButtonQuickChange = jest.fn();

            // Act
            component.handleBetButtons(buttonStatus);

            // Assert
            expect(component.handleStakeButtonQuickChange).toBeCalledTimes(2);
        });
    });

    describe("setOverlayVisibility", () => {
        it("should show/hide nodeOverlay node", () => {
            // Arrange

            // Act
            component.setOverlayVisibility(true);

            // Assert
            expect(component.nodeOverlay.active).toEqual(true);
        });
    });

    describe("onStakeQuickChange", () => {
        it("should return true when click on increase button ", () => {
            // Arrange
            const event = { target: { name: "increase" } };

            // Act
            const onStakeQuickChange = component.onStakeQuickChange(event);

            // Assert
            expect(onStakeQuickChange).toEqual(true);
        });

        it("should return false when click on decrease button ", () => {
            // Arrange
            const event = { target: { name: "descrease" } };

            // Act
            const onStakeQuickChange = component.onStakeQuickChange(event);

            // Assert
            expect(onStakeQuickChange).toEqual(false);
        });
    });

    describe("handleStakeButtonQuickChange", () => {
        const button = new Button();

        describe("when status is true", () => {
            beforeEach(() => {
                // Arrange
                const status = true;

                // Act
                component.handleStakeButtonQuickChange(button, status);
            });

            it("should have event click on button", () => {
                // Assert
                expect(button.interactable).toEqual(true);
            });

            it("should show opacity is 255", () => {
                // Assert
                expect(button.node.getComponent(UIOpacity).opacity).toEqual(255);
            });
        });

        describe("when status is false", () => {
            beforeEach(() => {
                // Arrange
                const status = false;

                // Act
                component.handleStakeButtonQuickChange(button, status);
            });
            it("should not have event click on button", () => {
                // Assert
                expect(button.interactable).toEqual(false);
            });

            it("should show opacity is 100", () => {
                // Assert
                expect(button.node.getComponent(UIOpacity).opacity).toEqual(100);
            });
        });
    });
});

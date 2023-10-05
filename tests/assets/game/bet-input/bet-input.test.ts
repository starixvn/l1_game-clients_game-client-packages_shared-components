import { Button, instantiate, Label, Node, UIOpacity } from "cc";

import { BetInput } from "../../../../assets/game/bet-input/scripts/bet-input";

describe("BetInput", () => {
    let component: BetInput;
    beforeEach(() => {
        component = new BetInput();
        component.nodeBetAmountPopupContainer = new Node();
        component.lblBetAmount = new Label();
        component.nodeOverlay = new Node();
    });
    describe("initBetAmountPopup", () => {
        describe("when bet amount popup is added into nodeBetAmountPopupContainer", () => {
            it("should call instantiate() and addChild()", () => {
                // Arrange
                // @ts-ignore
                component.nodeBetAmountPopupContainer.children = [new Node()];

                // Act
                component["initBetAmountPopup"]();

                // Assert
                expect(instantiate).toBeCalledTimes(0);
                expect(component.nodeBetAmountPopupContainer.addChild).toBeCalledTimes(0);
            });
        });
        describe("when bet amount popup is not added into nodeBetAmountPopupContainer", () => {
            it("should call instantiate() and addChild()", () => {
                // Arrange
                component.nodeBetAmountPopupContainer.destroyAllChildren();

                // Act
                component["initBetAmountPopup"]();

                // Assert
                expect(instantiate).toBeCalled();
                expect(component.nodeBetAmountPopupContainer.addChild).toBeCalled();
            });
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
                component["updateBetAmount"](amount);

                // Assert
                expect(component.lblBetAmount.string).toEqual("10");
            });
        });

        describe("when amount <= 0", () => {
            it("should not update bet amount label", () => {
                // Arrange
                const amount = 0;

                // Act
                component["updateBetAmount"](amount);

                // Assert
                expect(component.lblBetAmount.string).toEqual("20");
            });
        });
    });

    describe("setIncreaseButtonStatus", () => {
        it("should call handleStakeButtonQuickChange()", () => {
            // Arrange
            component["handleStakeButtonQuickChange"] = jest.fn();

            // Act
            component["setIncreaseButtonStatus"](true);

            // Assert
            expect(component["handleStakeButtonQuickChange"]).toBeCalled();
        });
    });

    describe("setDecreaseButtonStatus", () => {
        it("should call handleStakeButtonQuickChange()", () => {
            // Arrange
            component["handleStakeButtonQuickChange"] = jest.fn();

            // Act
            component["setDecreaseButtonStatus"](true);

            // Assert
            expect(component["handleStakeButtonQuickChange"]).toBeCalled();
        });
    });

    describe("renderOpenBetAmountPopup", () => {
        beforeEach(() => {
            // Arrange
            component["initBetAmountPopup"] = jest.fn();

            // Act
            component["renderOpenBetAmountPopup"](true);
        });

        it("should show nodeOverlay when isOpenBetAmountPopup = true", () => {
            // Assert
            expect(component.nodeOverlay.active).toEqual(true);
        });

        it("should hide nodeOverlay when isOpenBetAmountPopup = false", () => {
            // Act
            component["renderOpenBetAmountPopup"](false);

            // Assert
            expect(component.nodeOverlay.active).toEqual(false);
        });

        it("should call initBetAmountPopup()", () => {
            // Assert
            expect(component["initBetAmountPopup"]).toBeCalled();
        });
    });

    describe("onClickBetAmountQuickChange", () => {
        it("should return true when click on increase button ", () => {
            // Arrange
            const event = { target: { name: "increase" } };

            // Act
            const onStakeQuickChange = component["onClickBetAmountQuickChange"](event);

            // Assert
            expect(onStakeQuickChange).toEqual(true);
        });

        it("should return false when click on decrease button ", () => {
            // Arrange
            const event = { target: { name: "descrease" } };

            // Act
            const onStakeQuickChange = component["onClickBetAmountQuickChange"](event);

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
                component["handleStakeButtonQuickChange"](button, status);
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
                component["handleStakeButtonQuickChange"](button, status);
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

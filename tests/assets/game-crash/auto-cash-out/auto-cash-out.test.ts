import { Button, Label, Sprite, Toggle, UIOpacity } from "cc";

import { AutoCashout } from "../../../../assets/game-crash/auto-cash-out/scripts/components/auto-cash-out";

describe("AutoCashout", () => {
    let autoCashout: AutoCashout;

    beforeEach(() => {
        autoCashout = new AutoCashout();
        autoCashout.toggle = new Toggle();
        autoCashout.multiplierLabel = new Label();
        autoCashout.disableMultiplier = new Sprite();
        autoCashout.increaseButton = new Button();
        autoCashout.decreaseButton = new Button();
    });
    describe("toggleCheck", () => {
        it("should return correct status of toggle", () => {
            autoCashout.toggle.isChecked = true;
            const result = autoCashout.toggleCheck();

            expect(result).toBe(true);
        });
    });

    describe("quickChangeMultiplier", () => {
        it("should return correct value", () => {
            expect(autoCashout.quickChangeMultiplier(0.01)).toBe(0.01);
        });
    });

    describe("openPopup", () => {
        it("should return true", () => {
            expect(autoCashout.openPopup()).toBe(true);
        });
    });

    describe("updateMultiplier", () => {
        it("should update the multiplier label", () => {
            autoCashout.updateMultiplier(1.0);
            expect(autoCashout.multiplierLabel.string).toBe("1.00X");
        });
    });

    describe("updateEnable", () => {
        it("should update the toggle & overlay status", () => {
            autoCashout.updateEnable(true);
            expect(autoCashout.toggle.isChecked).toBe(true);
            expect(autoCashout.disableMultiplier.node.active).toBe(false);
        });
    });

    describe("updateButtonStatus", () => {
        describe("when enable", () => {
            it("should update button interactable & overlay opacity", () => {
                autoCashout.updateButtonStatus(autoCashout.decreaseButton, true);
                expect(autoCashout.decreaseButton.interactable).toBe(true);
                expect(autoCashout.decreaseButton.node.getComponent(UIOpacity).opacity).toBe(255);
            });
        });

        describe("when disable", () => {
            it("should update button interactable & overlay opacity", () => {
                autoCashout.updateButtonStatus(autoCashout.decreaseButton, false);
                expect(autoCashout.decreaseButton.interactable).toBe(false);
                expect(autoCashout.decreaseButton.node.getComponent(UIOpacity).opacity).toBe(100);
            });
        });
    });
});

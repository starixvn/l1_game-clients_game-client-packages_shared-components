import { Button, Label } from "cc";

import { AutoCashoutPopup } from "../../../../assets/game-crash/auto-cash-out/scripts/components/auto-cash-out-popup";

describe("AutoCashoutPopup", () => {
    let autoCashoutPopup: AutoCashoutPopup;

    beforeEach(() => {
        autoCashoutPopup = new AutoCashoutPopup();
        autoCashoutPopup.multiplierLabel = new Label();
        autoCashoutPopup.multiplierRangeLabel = new Label();
        autoCashoutPopup.confirmButton = new Button();
    });

    describe("confirm", () => {
        it("should return multiplier value", () => {
            autoCashoutPopup.multiplierLabel.string = "2.01";

            const result = autoCashoutPopup.confirm();

            expect(result).toEqual(2.01);
        });
    });

    describe("addValue", () => {
        describe("when multiplier label is 0", () => {
            describe("when input value is .", () => {
                it("should return 0", () => {
                    autoCashoutPopup.multiplierLabel.string = "0";
                    const result = autoCashoutPopup.addValue(null, ".");

                    expect(result).toEqual("0");
                });
            });

            describe("when input value is number", () => {
                it("should return input value", () => {
                    autoCashoutPopup.multiplierLabel.string = "0";
                    const result = autoCashoutPopup.addValue(null, 1);

                    expect(result).toEqual("1");
                });
            });
        });

        describe("when multiplier label is greater than 0", () => {
            it("should append input value", () => {
                autoCashoutPopup.multiplierLabel.string = "1";
                const result = autoCashoutPopup.addValue(null, 1);

                expect(result).toEqual("11");
            });
        });
    });

    describe("updateMultiplierRangeLabel", () => {
        it("should update multiplier range label", () => {
            autoCashoutPopup.updateMultiplierRangeLabel(3000);
            expect(autoCashoutPopup.multiplierRangeLabel.string).toEqual("1.01X - 3000.00X");
        });
    });

    describe("clear", () => {
        it("should return  0", () => {
            const result = autoCashoutPopup.clear();
            expect(result).toEqual("0");
        });
    });

    describe("removeLastLetter", () => {
        describe("when multiplier label has 1 character", () => {
            it("should return 0", () => {
                autoCashoutPopup.multiplierLabel.string = "1";
                const result = autoCashoutPopup.removeLastLetter();
                expect(result).toEqual("0");
            });
        });

        describe("when multiplier label has more than 1 character", () => {
            it("should remove last digit", () => {
                autoCashoutPopup.multiplierLabel.string = "12";
                const result = autoCashoutPopup.removeLastLetter();
                expect(result).toEqual("1");
            });
        });
    });
});

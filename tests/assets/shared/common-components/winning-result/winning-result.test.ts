import { Label } from "cc";
import { WinningResult } from "../../../../../assets/shared/common-components/winning-result/scripts/winning-result";
import gc from "@sg/game-client-base";

describe("WinningResult", () => {
    let component: WinningResult;
    beforeEach(() => {
        component = new WinningResult();
        component.supportChoices = "dragon,tiger,tie";
        component.label = new Label();
    });

    describe("setSettlementResult", () => {
        it("should render correct winning bet choices", () => {
            // Arrange
            const data = {
                dragon: true,
                tiger: false,
                tie: false,
                blackDragon: false,
                redDragon: true,
                blackTiger: true,
                redTiger: false,
            };

            const commonTranslateSpy = jest.spyOn(gc.Translator, "gameTranslate");
            commonTranslateSpy.mockReturnValue("dragon_win");

            // Act
            const winChoice = component.setSettlementResult(data);

            // Assert
            expect(winChoice).toBe("dragon");
            expect(component.label.string).toEqual("dragon_win");
        });
    });

    describe("Hide quickly", () => {
        it("should inactive the node", () => {
            // Arrange
            component.node.active = true;

            // Act
            component.hideQuickly();

            // Assert
            expect(component.node.active).toBeFalsy();
        });
    });
});

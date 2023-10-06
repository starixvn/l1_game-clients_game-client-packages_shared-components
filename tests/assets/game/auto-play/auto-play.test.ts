import { Label, Prefab, Sprite } from "cc";
import { AutoPlay } from "./../../../../assets/game/auto-play/scripts/auto-play";

describe("AutoPlayPopup", () => {
    let comp: AutoPlay;

    beforeEach(() => {
        comp = new AutoPlay();
        comp.lblnoOfRound = new Label();
        comp.sprIconAutoPlay = new Sprite();
        comp.prfautoPlayPopup = new Prefab();
    });
    describe("setNoOfRound", () => {
        it("should assign label noOfRound is rounds", () => {
            //Arrange
            const rounds = 10;

            //Act
            comp.setNoOfRound(rounds);

            //Assert
            expect(comp.lblnoOfRound.string).toEqual("10");
        });
    });

    describe("confirmAndStartRounds", () => {
        it("should start auto play", () => {
            //Arrange
            const isAutoPlay = true;

            //Act
            comp.confirmAndStartRounds(isAutoPlay);

            //Assert
            expect(comp.lblnoOfRound.node.active).toEqual(true);
            expect(comp.sprIconAutoPlay.node.active).toEqual(false);
        });

        it("should stop auto play", () => {
            //Arrange
            const isAutoPlay = false;

            //Act
            comp.confirmAndStartRounds(isAutoPlay);

            //Assert
            expect(comp.lblnoOfRound.node.active).toEqual(false);
            expect(comp.sprIconAutoPlay.node.active).toEqual(true);
        });
    });
});

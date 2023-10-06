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

    describe("updateAutoPlayButton", () => {
        it("should start auto play when isAutoPlay is true", () => {
            //Arrange
            const isAutoPlay = true;

            //Act
            comp.updateAutoPlayButton(isAutoPlay);

            //Assert
            expect(comp.lblnoOfRound.node.active).toEqual(true);
            expect(comp.sprIconAutoPlay.node.active).toEqual(false);
        });

        it("should stop auto play when isAutoPlay is false", () => {
            //Arrange
            const isAutoPlay = false;

            //Act
            comp.updateAutoPlayButton(isAutoPlay);

            //Assert
            expect(comp.lblnoOfRound.node.active).toEqual(false);
            expect(comp.sprIconAutoPlay.node.active).toEqual(true);
        });
    });
});

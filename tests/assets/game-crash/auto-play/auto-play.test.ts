import { Label, Node, Sprite } from "cc";

import { AutoPlayButton } from "../../../../assets/game-crash/auto-play/scripts/auto-play-button";

describe("AutoPlayPopup", () => {
    let comp: AutoPlayButton;

    beforeEach(() => {
        comp = new AutoPlayButton();
        comp.lblNoOfRound = new Label();
        comp.sprIconAutoPlay = new Sprite();
        comp.nodeTextAutoPlay = new Node();
        comp.nodeTextStopAutoPlay = new Node();
    });
    describe("setNoOfRound", () => {
        it("should assign label noOfRound is rounds", () => {
            //Arrange
            const rounds = 10;

            //Act
            comp.setNoOfRound(rounds);

            //Assert
            expect(comp.lblNoOfRound.string).toEqual("10");
        });
    });

    describe("updateAutoPlayButton", () => {
        it("should start auto play when isAutoPlay is true", () => {
            //Arrange
            const isAutoPlay = true;

            //Act
            comp.updateAutoPlayButton(isAutoPlay);

            //Assert
            expect(comp.lblNoOfRound.node.active).toEqual(true);
            expect(comp.nodeTextStopAutoPlay.active).toEqual(true);
            expect(comp.sprIconAutoPlay.node.active).toEqual(false);
            expect(comp.nodeTextAutoPlay.active).toEqual(false);
        });

        it("should stop auto play when isAutoPlay is false", () => {
            //Arrange
            const isAutoPlay = false;

            //Act
            comp.updateAutoPlayButton(isAutoPlay);

            //Assert
            expect(comp.lblNoOfRound.node.active).toEqual(false);
            expect(comp.nodeTextStopAutoPlay.active).toEqual(false);
            expect(comp.sprIconAutoPlay.node.active).toEqual(true);
            expect(comp.nodeTextAutoPlay.active).toEqual(true);
        });
    });
});

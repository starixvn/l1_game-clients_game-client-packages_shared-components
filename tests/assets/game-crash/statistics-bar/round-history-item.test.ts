import { Label, Node, Sprite, SpriteAtlas } from "cc";
import { RoundHistoryItem } from "./../../../../assets/game-crash/statistics-bar/round-history-item";
describe("RoundHistoryItem", () => {
    let comp: RoundHistoryItem;
    beforeEach(() => {
        comp = new RoundHistoryItem();
        comp.nodeCountdown = new Node();
        comp.lblCountdown = new Label();
        comp.nodeMultiplier = new Sprite();
        comp.lblMultiplier = new Label();
        comp.nodeInPlay = new Node();
        comp.mainAtlas = new SpriteAtlas();
        comp.isLastRound = false;
        comp.roundInfo = null;
    });

    describe("setDisplay", () => {
        it("should display nodeCountdown", () => {
            //Arrange
            const isShowMultiplier = false;
            const isShowCountDown = true;
            const isShowSprInPlay = false;

            //Act
            comp.setDisplay(isShowMultiplier, isShowCountDown, isShowSprInPlay);

            //Assert
            expect(comp.nodeCountdown.active).toEqual(true);
        });

        it("should display nodeMultiplier", () => {
            //Arrange
            const isShowMultiplier = true;
            const isShowCountDown = false;
            const isShowSprInPlay = false;

            //Act
            comp.setDisplay(isShowMultiplier, isShowCountDown, isShowSprInPlay);

            //Assert
            expect(comp.nodeMultiplier.node.active).toEqual(true);
        });

        it("should display node InPlay", () => {
            //Arrange
            const isShowMultiplier = false;
            const isShowCountDown = false;
            const isShowSprInPlay = true;

            //Act
            comp.setDisplay(isShowMultiplier, isShowCountDown, isShowSprInPlay);

            //Assert
            expect(comp.nodeInPlay.active).toEqual(true);
        });
    });

    describe("updateCountDownValue", () => {
        it("should update node count down is 9", () => {
            //Arrange
            const countdownTimer = 9;
            comp.checkCrashedGame = jest.fn(() => false);

            //Act
            comp.updateCountDownValue(countdownTimer);

            //Assert
            expect(comp.lblCountdown.string).toEqual("9");
            expect(comp.nodeCountdown.active).toEqual(true);
        });
    });
});

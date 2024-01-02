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

    describe("checkCrashedGame", () => {
        it("should return true", () => {
            //Arrange
            comp.roundInfo = {
                md5Result: {
                    hashValue: "abc",
                    rawValue: "xyz",
                },
                roundId: 123,
                result: [1.23],
                settlementResult: null,
            };

            //Act
            let isCrashed = comp.checkCrashedGame();

            //Assert
            expect(isCrashed).toEqual(true);
        });

        it("should return false", () => {
            //Arrange
            comp.roundInfo = {
                md5Result: {
                    hashValue: "abc",
                },
                roundId: 123,
                result: [1.23],
                settlementResult: null,
            };

            //Act
            let isCrashed = comp.checkCrashedGame();

            //Assert
            expect(isCrashed).toEqual(false);
        });
    });

    describe("onClickRoundItem", () => {
        it("should open popup md5", () => {
            //Arrange
            comp.playSoundClick = jest.fn();
            comp.roundInfo = { roundId: 123, result: [1.23], settlementResult: null };

            //Act
            const roundData = comp.onClickRoundItem();

            //Assert
            expect(roundData.isOpenPopupMd5).toEqual(true);
            expect(roundData.roundId).toEqual(123);
        });
    });
});

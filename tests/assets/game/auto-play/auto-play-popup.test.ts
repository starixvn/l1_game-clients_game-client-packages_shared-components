import { Node } from "cc";
import { RoundNumberItem } from "db://shared-components/game/auto-play/scripts/components/round-number-item";
import { AutoPlayPopup } from "./../../../../assets/game/auto-play/scripts/components/auto-play-popup";
describe("AutoPlayPopup", () => {
    let popup: AutoPlayPopup;

    beforeEach(() => {
        popup = new AutoPlayPopup();
        popup.nodeContent = new Node();
    });
    describe("initContentRounds", () => {
        it("should initialize content rounds", () => {
            //Arrange
            const roundsList = [1, 2, 3];
            const setAutoPlayItemSpy = jest.spyOn(RoundNumberItem.prototype, "setValue").mockImplementation(jest.fn());

            //Act
            popup.initContentRounds(roundsList);

            //Assert
            expect(setAutoPlayItemSpy).toBeCalledTimes(roundsList.length);
        });
    });

    describe("renderSelectedRounds", () => {
        it("should render style for selected rounds", () => {
            //Arrange
            const noOfRounds = 2;
            const node = new Node();
            node.getComponent(RoundNumberItem);
            node.name = noOfRounds.toString();
            popup.nodeContent.children.push(node);

            const setAutoPlayItemSpy = jest.spyOn(RoundNumberItem.prototype, "setSelectedRound").mockImplementation(jest.fn());

            //Act
            popup.renderSelectedRounds(noOfRounds);

            //Assert
            expect(setAutoPlayItemSpy).toHaveBeenCalledWith(true);
        });
    });
});

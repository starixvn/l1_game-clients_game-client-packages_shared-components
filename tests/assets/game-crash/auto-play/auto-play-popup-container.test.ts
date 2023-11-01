import { Node } from "cc";

import { AutoPlayPopupContainer } from "../../../../assets/game-crash/auto-play/scripts/components/auto-play-popup-container";

describe("AutoPlayPopupContainer", () => {
    let container: AutoPlayPopupContainer;

    beforeEach(() => {
        container = new AutoPlayPopupContainer();
        container.nodeOverlay = new Node();
    });
    describe("renderOpenPopup", () => {
        beforeEach(() => {
            // Arrange
            container.createNode = jest.fn();
        });
        it("should render open popup", () => {
            //Act
            container.renderOpenPopup(true);
            //Assert
            expect(container.nodeOverlay.active).toEqual(true);
        });

        it("should render close popup ", () => {
            //Act
            container.renderOpenPopup(false);
            //Assert
            expect(container.nodeOverlay.active).toEqual(false);
        });
    });

    describe("onClickclosePopup", () => {
        beforeEach(() => {
            // Arrange
            container.createNode = jest.fn();
            //Act
            container.onClickclosePopup();
        });
        it("should handle close popup", () => {
            expect(container.createNode).toBeCalled;
        });
    });
});

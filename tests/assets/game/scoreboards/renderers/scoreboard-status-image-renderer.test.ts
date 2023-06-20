import { ScoreboardItemImage } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-image";
import { ScoreboardItemState } from "db://shared-components/game/scoreboards/scripts/models/scoreboard-item-state";
import { ScoreboardStatusImageRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-status-image-renderer";

describe(ScoreboardStatusImageRenderer.name, () => {
    let component: ScoreboardStatusImageRenderer;
    const state = new ScoreboardItemState();
    const image = new ScoreboardItemImage();

    beforeEach(() => {
        component = new ScoreboardStatusImageRenderer();
    });

    describe("canRender", () => {
        describe("when exists Sprite and valid input", () => {
            it("should return true", () => {
                // Arrange

                (component.node.getComponent as jest.Mock).mockReturnValue({ component: true });

                // Act
                const actual = component.canRender(state, [image]);

                // Assert
                expect(actual).toBeTruthy();
            });
        });
    });

    describe("render", () => {
        beforeEach(() => {
            component.canRender = jest.fn().mockReturnValue(true);
        });

        describe("and can not render", () => {
            it("should do nothing", () => {
                // Arrange
                (component.canRender as jest.Mock).mockReturnValue(false);

                // Act
                component.render(state, [image]);

                // Assert
                expect(component.node.parent.getComponent).toBeCalledTimes(0);
            });
        });

        it("should check status", () => {
            // Act
            component.render(state, [image]);

            // Assert
            expect(component.canRender).toBeCalled();
        });

        it("should update sprite", () => {
            // Arrange
            const sprite = { spriteFrame: null };

            (component.node.getComponent as jest.Mock).mockReturnValue(sprite);
            image.image = { image: true };

            // Act
            component.render(state, [image]);

            // Assert
            expect(sprite.spriteFrame).toStrictEqual({ image: true });
        });
    });
});

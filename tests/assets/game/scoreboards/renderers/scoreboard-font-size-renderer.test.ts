import { Label, UITransform } from "cc";
import { ScoreboardFontSizeRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-font-size-renderer";

describe(ScoreboardFontSizeRenderer.name, () => {
    let component: ScoreboardFontSizeRenderer;

    beforeEach(() => {
        component = new ScoreboardFontSizeRenderer();
    });

    describe("render", () => {
        beforeEach(() => {
            component.canRender = jest.fn().mockReturnValue(true);
        });

        it("should check status", () => {
            // Act
            component.render();

            // Assert
            expect(component.canRender).toBeCalled();
        });

        it("should get UITransform component", () => {
            // Act
            component.render();

            // Assert
            expect(component.node.parent.getComponent).toBeCalledWith(UITransform);
        });

        it("should get Label component", () => {
            // Act
            component.render();

            // Assert
            expect(component.node.parent.getComponent).toBeCalledWith(Label);
        });

        it("should update font size", () => {
            // Arrange
            const metadata = { width: 26, fontSize: 0 };

            (component.node.getComponent as jest.Mock).mockReturnValue(metadata);

            // Act
            component.render();

            // Assert
            expect(metadata.fontSize).toBe(20);
        });

        describe("and can not render", () => {
            it("should do nothing", () => {
                // Arrange
                (component.canRender as jest.Mock).mockReturnValue(false);

                // Act
                component.render();

                // Assert
                expect(component.node.parent.getComponent).toBeCalledTimes(0);
            });
        });
    });

    describe("canRender", () => {
        describe("when exists UITransform and Label component", () => {
            it("should return true", () => {
                // Arrange
                (component.node.getComponent as jest.Mock).mockReturnValue({ component: true });

                // Act
                const actual = component.canRender();

                // Assert
                expect(actual).toBeTruthy();
            });
        });
    });
});

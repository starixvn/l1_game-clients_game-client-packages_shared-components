import { Node } from "cc";
import { ScoreboardGridItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-grid-item";
import { ScoreboardItem } from "db://shared-components/game/scoreboards/scripts/components/scoreboard-item";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";
import { GridItemSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-item-settings";

describe(ScoreboardGridItem.name, () => {
    let component: ScoreboardGridItem<unknown>;
    let container: Node;
    let grid: GridLayout;
    const settings: GridItemSettings = {
        prefab: null,
        size: 20,
    };

    beforeEach(() => {
        container = new Node();
        grid = new GridLayout();
        component = new ScoreboardGridItem();

        grid.settings = {
            column: 1,
            row: 1,
        } as any;
        (container.getComponent as jest.Mock).mockReturnValue(grid);

        component["item"] = new ScoreboardItem();
        component["borderBottom"] = new Node();
        component["borderLeft"] = new Node();
        component.updateSize = jest.fn();
    });

    describe("onFocusInEditor", () => {
        describe("when called", () => {
            it("should get scoreboard item component", () => {
                // Act
                component.onFocusInEditor();

                // Assert
                expect(component.node.getComponent).toBeCalledWith(ScoreboardItem);
            });
        });
    });

    describe("render", () => {
        describe("when called", () => {
            it("should create the state", () => {
                // Arrange
                jest.spyOn(component, "createState");

                // Act
                component.render(settings, 1, container, 0);

                // Assert
                expect(component.createState).toBeCalledWith(settings, 1, container);
            });

            it("should render border", () => {
                // Arrange
                jest.spyOn(component, "renderBorder");

                // Act
                component.render(settings, 1, container, 0);

                // Assert
                expect(component.renderBorder).toBeCalledWith(container, 0);
            });
        });
    });
});

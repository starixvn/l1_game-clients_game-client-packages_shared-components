import { Layout, Node, ScrollView, UITransform, Vec3, instantiate, math, v2 } from "cc";
import { GridItem } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-item";
import { GridItemSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-item-settings";
import { GridLayoutSettings } from "db://shared-components/shared/common-components/grid-layout/scripts/settings/grid-layout-settings";
import { GridLayout } from "../../../../../../assets/shared/common-components/grid-layout/scripts/components/grid-layout";

// Mock the instantiate function
jest.mock("cc", () => ({
    ...jest.requireActual("cc"),
    instantiate: jest.fn(),
    v2: jest.fn(),
}));

const mockedInstantiate = instantiate as jest.MockedFunction<typeof instantiate>;
const mockedV2 = v2 as jest.MockedFunction<typeof v2>;

class FakeItem extends GridItem<number> {}

describe(GridLayout.name, () => {
    let grid: GridLayout;
    let fakeItem: FakeItem;
    let fakeItemNode: Node;
    let fakeLayoutNode: Node;
    let fakeNormalChild: Node;
    let mockInstantiatedNode: Node;
    let mockUITransform: UITransform;
    let mockContentUITransform: UITransform;
    let mockScrollViewUITransform: UITransform;
    const gridLayoutSettings: GridLayoutSettings = {
        column: 1,
        direction: Layout.AxisDirection.HORIZONTAL,
        row: 1,
        itemPrefab: null,
        itemSize: 10,
        scrollable: true,
        scrollToEnd: true,
    };
    const itemSettings: GridItemSettings = {
        prefab: null,
        size: 10,
    };

    beforeEach(() => {
        // Mock v2 function to return proper objects with x and y properties
        mockedV2.mockImplementation((x: number, y: number) => ({ x, y, equals: jest.fn().mockReturnValue(false) } as any));

        // Create mock UITransform components with contentSize
        mockUITransform = new UITransform();
        mockUITransform.width = 100;
        mockUITransform.height = 100;
        mockUITransform.contentSize = new math.Size(100, 100);

        mockContentUITransform = new UITransform();
        mockContentUITransform.width = 200;
        mockContentUITransform.height = 200;
        mockContentUITransform.contentSize = new math.Size(200, 200);

        mockScrollViewUITransform = new UITransform();
        mockScrollViewUITransform.width = 300;
        mockScrollViewUITransform.height = 300;
        mockScrollViewUITransform.contentSize = new math.Size(300, 300);

        // Create mock nodes with proper structure
        fakeNormalChild = new Node();
        fakeNormalChild.active = true;

        // Create a mock node for the grid item
        fakeItemNode = new Node();
        fakeItemNode.destroy = jest.fn();
        const nodePosition = new Vec3();
        nodePosition.x = 0;
        nodePosition.y = 0;
        nodePosition.z = 0;
        fakeItemNode.position = nodePosition;
        fakeItemNode.getComponent = jest.fn().mockImplementation((componentType) => {
            if (componentType === UITransform) {
                return mockUITransform;
            }
            return null;
        });
        fakeItemNode.getChildByName = jest.fn().mockImplementation((name: string) => {
            if (name === "normal") {
                return fakeNormalChild;
            }
            return null;
        });

        fakeItem = new FakeItem();
        // Set the node property of the grid item to our mock node
        (fakeItem as any).node = fakeItemNode;

        fakeLayoutNode = new Node();
        fakeLayoutNode.getComponent = jest.fn().mockImplementation((componentType) => {
            if (componentType === UITransform) {
                return mockContentUITransform;
            }
            return null;
        });
        // Mock the children property to return our fake item node
        Object.defineProperty(fakeLayoutNode, "children", {
            value: [fakeItemNode],
            writable: true,
            configurable: true,
        });
        fakeLayoutNode.addChild = jest.fn();
        fakeLayoutNode.getChildByName = jest.fn().mockImplementation((name: string) => {
            if (name === "normal") {
                return fakeNormalChild;
            }
            return null;
        });

        // Create mock instantiated node
        mockInstantiatedNode = new Node();
        mockInstantiatedNode.getComponent = jest.fn().mockImplementation((componentType) => {
            if (componentType === UITransform) {
                return mockUITransform;
            }
            return null;
        });
        mockInstantiatedNode.getComponentInChildren = jest.fn();
        mockInstantiatedNode.getChildByName = jest.fn().mockImplementation((name: string) => {
            if (name === "normal") {
                return fakeNormalChild;
            }
            return null;
        });

        // Mock instantiate to return our mock node
        mockedInstantiate.mockReturnValue(mockInstantiatedNode);

        grid = new GridLayout();
        grid.layout = new Layout();
        grid.scrollView = new ScrollView();
        grid.settings = gridLayoutSettings;
        grid.itemSettings = itemSettings;

        // Mock layout methods
        grid.layout.updateLayout = jest.fn();
        grid.layout.node = fakeLayoutNode;

        // Mock scrollView methods and node
        grid.scrollView.scrollToOffset = jest.fn();
        grid.scrollView.getMaxScrollOffset = jest.fn().mockReturnValue({ x: 100, y: 100 });
        grid.scrollView.getScrollOffset = jest.fn().mockReturnValue({ x: 0, y: 0 });
        grid.scrollView.node = new Node();
        grid.scrollView.node.getComponent = jest.fn().mockImplementation((componentType) => {
            if (componentType === UITransform) {
                return mockScrollViewUITransform;
            }
            return null;
        });
    });

    describe("content", () => {
        it("should return node of layout component", () => {
            // Assert
            expect(grid.content).toStrictEqual(grid.layout.node);
        });
    });

    describe("render", () => {
        describe("when input length is less than current", () => {
            it("should remove unused nodes", () => {
                // Act
                grid.render(FakeItem, []);

                // Assert
                expect(fakeItemNode.destroy).toBeCalled();
            });
        });

        describe("when input length is greater than current", () => {
            let render;
            beforeEach(() => {
                render = jest.fn();

                grid["getItemComponent"] = jest.fn().mockReturnValue({ render });
            });

            it("should create prefab instances", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(mockedInstantiate).toBeCalledWith(itemSettings.prefab);
            });

            it("should render items", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(render).toBeCalledWith(itemSettings, 2, grid.node, 1);
            });

            it("should add new node to container", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(fakeLayoutNode.addChild).toBeCalledWith(mockInstantiatedNode);
            });

            it("should re-render the existing nodes", () => {
                // Act
                grid.render(FakeItem, [1, 2]);

                // Assert
                expect(render).toBeCalledWith(itemSettings, 1, grid.node, 0);
            });
        });

        it("should update layout", () => {
            // Act
            grid.render(FakeItem, []);

            // Assert
            expect(grid.layout.updateLayout).toBeCalled();
        });
    });
});

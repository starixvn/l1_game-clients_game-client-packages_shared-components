import { ExpandableNode } from "../../../../../assets/common/expandable-node/scripts/expandable-node";
describe("ExpandableNode", () => {
    let expandableNode: ExpandableNode;

    beforeAll(() => {
        expandableNode = new ExpandableNode();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("onClickExpand", () => {
        it("should return audio click id", () => {
            // Arrange
            expandableNode.expand = jest.fn();
            expandableNode.collapse = jest.fn();
            expandableNode["expanded"] = false;

            // Act
            expandableNode.onClickExpand();

            // Assert
            expect(expandableNode.expand).toBeCalled();
        });
    });
});

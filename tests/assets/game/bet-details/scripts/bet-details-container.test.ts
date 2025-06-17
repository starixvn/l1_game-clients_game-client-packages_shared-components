import "reflect-metadata";
//rest
import { Container } from "inversify";
import { BetDetailsContainer } from "../../../../../assets/game/bet-details/scripts/bet-details-container";
import { BetTicketDetails } from "../../../../../assets/game/bet-details/scripts/bet-ticket-details";

jest.mock("@sg/game-client-base", () => ({
    BetDetailsNew: {
        BetDetailsStore: jest.fn().mockImplementation(() => ({
            betDetailsUrl: "",
        })),
    },
    Dialogs: {
        DialogsStore: jest.fn().mockImplementation(() => ({
            forceClosed: false,
        })),
    },
}));

jest.mock("../../../../../assets/game/bet-details/scripts/bet-ticket-details", () => ({
    BetTicketDetails: jest.fn().mockImplementation(() => ({
        openBetDetails: jest.fn(),
    })),
}));

describe("BetDetailsContainer", () => {
    let container: Container;
    let betDetailsContainer: BetDetailsContainer;
    let mockBetTicketDetails: jest.Mocked<BetTicketDetails>;

    beforeEach(() => {
        container = new Container();
        container.bind(BetDetailsContainer).toSelf();

        betDetailsContainer = container.get(BetDetailsContainer);
        mockBetTicketDetails = new (jest.requireMock(
            "../../../../../assets/game/bet-details/scripts/bet-ticket-details"
        ).BetTicketDetails)();

        // Mock createNode method
        betDetailsContainer.createNode = jest.fn().mockReturnValue({
            getComponent: jest.fn().mockReturnValue(mockBetTicketDetails),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("renderContent", () => {
        it("should not render content when betDetailsUrl is empty", () => {
            betDetailsContainer.renderContent("");
            expect(betDetailsContainer.createNode).not.toHaveBeenCalled();
        });

        it("should create node and open bet details when betDetailsUrl is provided", () => {
            const testUrl = "test-url";
            betDetailsContainer.renderContent(testUrl);

            expect(betDetailsContainer.createNode).toHaveBeenCalled();
            expect(mockBetTicketDetails.openBetDetails).toHaveBeenCalledWith(testUrl);
        });
    });

    describe("popupVisibility", () => {
        it("should not destroy children when forceClosed is false", () => {
            betDetailsContainer.node = { destroyAllChildren: jest.fn() } as any;
            betDetailsContainer.popupVisibility(false);
            expect(betDetailsContainer.node.destroyAllChildren).not.toHaveBeenCalled();
        });

        it("should destroy all children when forceClosed is true", () => {
            betDetailsContainer.node = { destroyAllChildren: jest.fn() } as any;
            betDetailsContainer.popupVisibility(true);
            expect(betDetailsContainer.node.destroyAllChildren).toHaveBeenCalled();
        });
    });
});

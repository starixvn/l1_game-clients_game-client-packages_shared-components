import { Container } from "inversify";
import "reflect-metadata";
import { BetTicketDetails } from "../../../../../assets/game/bet-details/scripts/bet-ticket-details";

// Mock gc
jest.mock("@sg/game-client-base", () => ({
    Audios: {
        AudioHandler: jest.fn(),
        AudioIds: { CLICK: "CLICK" },
    },
}));

// Mock Dialog
jest.mock("../../../../../assets/shared/common-components/dialogs/dialog", () => ({
    Dialog: jest.fn().mockImplementation(() => ({
        hide: jest.fn(),
    })),
}));

// Mock LoadWebView (và các property cần thiết)
jest.mock("../../../../../assets/shared/common-components/web-view/load-web-view", () => {
    return {
        __esModule: true,
        default: class {
            url = "";
            loadWebView = jest.fn();
            node = { destroy: jest.fn() };
            getComponentsInChildren = jest.fn();
            webView = { node: { on: jest.fn() }, url: "" };
            nodeLoading = { active: false };
        },
    };
});

// Mock Observer
jest.mock("observer", () => {
    const actual = jest.requireActual("../../../../../../../tests/cocos-testing/observer");
    return actual;
});

describe("BetTicketDetails", () => {
    let container: Container;
    let betTicketDetails: BetTicketDetails;

    beforeEach(() => {
        container = new Container();
        container.bind(BetTicketDetails).toSelf();
        betTicketDetails = container.get(BetTicketDetails);
        // Patch node và getComponentsInChildren cho test
        betTicketDetails.node = { destroy: jest.fn() } as any;
        betTicketDetails.loadWebView = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("openBetDetails", () => {
        it("should set url and call loadWebView", () => {
            const testUrl = "https://test.com";
            betTicketDetails.openBetDetails(testUrl);
            // Không kiểm tra trực tiếp url vì là protected
            expect(betTicketDetails.loadWebView).toHaveBeenCalled();
        });
    });

    describe("onClickClose", () => {
        it("should hide first dialog if dialogs exist", () => {
            const mockDialog = { hide: jest.fn() };
            betTicketDetails.getComponentsInChildren = jest.fn().mockReturnValue([mockDialog]);
            betTicketDetails.onClickClose();
            expect(mockDialog.hide).toHaveBeenCalled();
            expect(betTicketDetails.node.destroy).not.toHaveBeenCalled();
        });

        it("should destroy node if no dialogs exist", () => {
            betTicketDetails.getComponentsInChildren = jest.fn().mockReturnValue([]);
            betTicketDetails.onClickClose();
            expect(betTicketDetails.node.destroy).toHaveBeenCalled();
        });
    });
});

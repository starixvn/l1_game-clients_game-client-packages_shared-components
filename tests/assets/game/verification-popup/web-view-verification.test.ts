import { Container } from "inversify";
import gc from "@sg/game-client-base";
import { Label } from "cc";
import WebViewVerification from "../../../../assets/game/verification-popup/scripts/web-view-verification";

// Mock dependencies
jest.mock("@sg/game-client-base", () => ({
    UrlUtils: {
        getSubDomain: jest.fn(),
    },
    PFVerification: {
        WebViewPFVerificationHandlers: {
            GetVerificationURL: "GetVerificationURL",
            VerificationPopupHandler: "VerificationPopupHandler",
        },
        WebViewPFVerificationStore: jest.fn(),
    },
    RoundPF: {
        RoundPFStore: jest.fn(),
    },
    Audios: {
        AudioHandler: jest.fn(),
        AudioIds: {
            CLICK: "CLICK",
        },
    },
    GameServiceMessage: {
        ProvablyFair: jest.fn(),
        RoundPFResult: jest.fn(),
    },
}));

jest.mock("../../../../assets/shared/common-components/web-view/load-web-view", () => {
    return jest.fn().mockImplementation(function() {
        this.url = "";
        this.webView = { url: "", node: { on: jest.fn() } };
        this.nodeLoading = { active: false };
        this.onWebViewLoaded = jest.fn();
        this.showLoading = jest.fn();
        this.hideWebView = jest.fn();
        this.showWebView = jest.fn();
        // Don't mock loadWebView - let the child class override it
        this.setOpacity = jest.fn();
        this.destroyDivIframe = jest.fn();
        this.hideLoading = jest.fn();
        this.onLoad = jest.fn();
    });
});

describe("WebViewVerification", () => {
    let container: Container;
    let webViewVerification: WebViewVerification;
    let mockLabel: Label;

    beforeEach(() => {
        
        // Create mock label
        mockLabel = {
            string: "",
        } as Label;

        // Create WebViewVerification instance
        webViewVerification = new WebViewVerification();
        webViewVerification.lblRound = mockLabel;

        // Mock document.getElementById specifically  
        (global.document.getElementById as any) = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("onLoad", () => {
        it("should execute onLoad method without errors", () => {
            // Arrange - create fresh instance
            const freshInstance = new WebViewVerification();

            // Act & Assert - should not throw errors
            expect(() => {
                freshInstance.onLoad();
            }).not.toThrow();
        });
    });

    describe("initUrl", () => {
        it("should return theme, specialDirection, and scrollToId with default parameters", () => {
            // Act
            const result = webViewVerification.initUrl();

            // Assert
            expect(result).toEqual({
                theme: "blue",
                specialDirection: "",
                scrollToId: "",
            });
        });

        it("should return theme, specialDirection, and scrollToId with custom parameters", () => {
            // Arrange
            const specialDirection = "custom-direction";
            const scrollToId = "custom-scroll";

            // Act
            const result = webViewVerification.initUrl(specialDirection, scrollToId);

            // Assert
            expect(result).toEqual({
                theme: "blue",
                specialDirection,
                scrollToId,
            });
        });
    });

    describe("setProvablyFair", () => {
        it("should set provablyFair and update label string", () => {
            // Arrange
            const mockPf = {
                roundId: 12345,
                clientSeed: "test-client-seed",
                serverSeed: "test-server-seed",
                serverSeedHash: "test-server-seed-hash",
                mergeClientSeed: "test-merge-client-seed",
                finalHash: "test-final-hash",
                clientSeeds: [],
                result: null,
            } as any;

            // Act
            webViewVerification.setProvablyFair(mockPf);

            // Assert
            expect(webViewVerification['provablyFair']).toBe(mockPf);
            expect(mockLabel.string).toBe("12345");
        });

        it("should set provablyFair but not update label when lblRound is null", () => {
            // Arrange
            const mockPf = {
                roundId: 12345,
                clientSeed: "test-client-seed",
                serverSeed: "test-server-seed",
                serverSeedHash: "test-server-seed-hash",
            } as any;
            webViewVerification.lblRound = null;

            // Act
            webViewVerification.setProvablyFair(mockPf);

            // Assert
            expect(webViewVerification['provablyFair']).toBe(mockPf);
        });
    });

    describe("sendDataToIframe", () => {
        it("should set onWebViewLoaded callback and send data to iframe", () => {
            // Arrange
            const mockProvablyFair = {
                roundId: 12345,
                clientSeed: "test-client-seed",
                serverSeed: "test-server-seed",
            } as any;
            
            const mockIframe = {
                contentWindow: {
                    postMessage: jest.fn(),
                },
            };
            
            const mockGetSubDomain = gc.UrlUtils.getSubDomain as jest.Mock;
            mockGetSubDomain.mockReturnValue("https://test-domain.com");
            
            (global.document.getElementById as jest.Mock).mockReturnValue(mockIframe);
            
            webViewVerification['url'] = "https://test-url.com";

            // Act
            webViewVerification.sendDataToIframe(mockProvablyFair);

            // Assert
            expect(mockGetSubDomain).toHaveBeenCalledWith("https://test-url.com");
            expect(webViewVerification['onWebViewLoaded']).toBeDefined();
            
            webViewVerification['onWebViewLoaded']();
            expect(global.document.getElementById).toHaveBeenCalledWith("webview");
            expect(mockIframe.contentWindow.postMessage).toHaveBeenCalledWith(
                JSON.stringify(mockProvablyFair),
                "https://test-domain.com"
            );
        });

        it("should handle case when iframe is not found", () => {
            // Arrange
            const mockProvablyFair = {
                roundId: 12345,
            } as any;
            
            (global.document.getElementById as jest.Mock).mockReturnValue(null);
            webViewVerification['url'] = "https://test-url.com";

            // Act
            webViewVerification.sendDataToIframe(mockProvablyFair);
            webViewVerification['onWebViewLoaded']();

            // Assert - should not throw error
            expect(global.document.getElementById).toHaveBeenCalledWith("webview");
        });
    });

    describe("loadVerificationGuide", () => {
        it("should load verification guide when url is provided", () => {
            // Arrange
            const testUrl = "https://verification-guide.com";
            const mockProvablyFair = {
                roundId: 12345,
            } as any;
            
            webViewVerification['provablyFair'] = mockProvablyFair;
            const sendDataToIframeSpy = jest.spyOn(webViewVerification, 'sendDataToIframe');
            const loadWebViewSpy = jest.spyOn(webViewVerification, 'loadWebView');

            // Act
            webViewVerification.loadVerificationGuide(testUrl);

            // Assert
            expect(webViewVerification['url']).toBe(testUrl);
            expect(sendDataToIframeSpy).toHaveBeenCalledWith(mockProvablyFair);
            expect(loadWebViewSpy).toHaveBeenCalled();
        });

        it("should not load verification guide when url is empty", () => {
            // Arrange
            const sendDataToIframeSpy = jest.spyOn(webViewVerification, 'sendDataToIframe');
            const loadWebViewSpy = jest.spyOn(webViewVerification, 'loadWebView');

            // Act
            webViewVerification.loadVerificationGuide("");

            // Assert
            expect(sendDataToIframeSpy).not.toHaveBeenCalled();
            expect(loadWebViewSpy).not.toHaveBeenCalled();
        });
    });

    describe("loadWebView", () => {
        it("should load web view when url is provided", () => {
            // Arrange
            const testUrl = "https://test-webview.com";
            webViewVerification['url'] = testUrl;
            const showLoadingSpy = jest.spyOn(webViewVerification, 'showLoading');
            const hideWebViewSpy = jest.spyOn(webViewVerification, 'hideWebView');

            // Act
            webViewVerification.loadWebView();

            // Assert
            expect(showLoadingSpy).toHaveBeenCalled();
            expect(hideWebViewSpy).toHaveBeenCalled();
            expect(webViewVerification.webView.url).toBe(testUrl);
        });

        it("should not load web view when url is empty", () => {
            // Arrange
            webViewVerification['url'] = "";
            const showLoadingSpy = jest.spyOn(webViewVerification, 'showLoading');
            const hideWebViewSpy = jest.spyOn(webViewVerification, 'hideWebView');

            // Act
            webViewVerification.loadWebView();

            // Assert
            expect(showLoadingSpy).not.toHaveBeenCalled();
            expect(hideWebViewSpy).not.toHaveBeenCalled();
        });
    });

    describe("onClickClose", () => {
        it("should call closeVerificationPopup", () => {
            // Arrange
            const closeVerificationPopupSpy = jest.spyOn(webViewVerification, 'closeVerificationPopup');

            // Act
            webViewVerification.onClickClose();

            // Assert
            expect(closeVerificationPopupSpy).toHaveBeenCalled();
        });
    });

    describe("closeVerificationPopup", () => {
        it("should return false", () => {
            // Act
            const result = webViewVerification.closeVerificationPopup();

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when called directly", () => {
            // Arrange - create fresh instance to ensure clean state
            const freshInstance = new WebViewVerification();

            // Act & Assert
            expect(freshInstance.closeVerificationPopup()).toBe(false);
        });
    });

    describe("integration scenarios", () => {
        it("should handle complete verification flow", () => {
            // Arrange
            const mockPf = {
                roundId: 12345,
                clientSeed: "test-client-seed",
                serverSeed: "test-server-seed",
            } as any;
            
            const testUrl = "https://verification-guide.com";
            const mockIframe = {
                contentWindow: {
                    postMessage: jest.fn(),
                },
            };
            
            (gc.UrlUtils.getSubDomain as jest.Mock).mockReturnValue("https://test-domain.com");
            (global.document.getElementById as jest.Mock).mockReturnValue(mockIframe);

            const showLoadingSpy = jest.spyOn(webViewVerification, 'showLoading');
            const hideWebViewSpy = jest.spyOn(webViewVerification, 'hideWebView');

            // Act - simulate complete flow
            webViewVerification.setProvablyFair(mockPf);
            webViewVerification.loadVerificationGuide(testUrl);
            webViewVerification['onWebViewLoaded']();

            // Assert
            expect(webViewVerification['provablyFair']).toBe(mockPf);
            expect(mockLabel.string).toBe("12345");
            expect(webViewVerification['url']).toBe(testUrl);
            expect(showLoadingSpy).toHaveBeenCalled();
            expect(hideWebViewSpy).toHaveBeenCalled();
            expect(mockIframe.contentWindow.postMessage).toHaveBeenCalledWith(
                JSON.stringify(mockPf),
                "https://test-domain.com"
            );
        });
    });
});

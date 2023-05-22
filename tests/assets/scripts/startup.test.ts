import { Auth, Configs, IContainerOptions, Player, buildObserverContainer, getContainer } from "game-client-base";
import mobx from "mobx";
import { configure } from "observer";
import { getSharedContainer, startGame } from "../../../assets/scripts/startup";

jest.mock("game-client-base");
jest.mock("mobx");

describe(startGame.name, () => {
    const options: IContainerOptions = { disabledFeatures: ["a"] };

    describe("when called", () => {
        it("should get container from game client base", () => {
            // Act
            startGame("namespace", options);

            // Assert
            expect(getContainer).toBeCalledWith(options);
        });

        it("should build observer container", () => {
            // Arrange
            (getContainer as jest.Mock).mockReturnValueOnce({ container: true });

            // Act
            startGame("namespace", options);

            // Assert
            expect(buildObserverContainer).toBeCalledWith({ container: true });
        });

        it("should configure the observer", () => {
            // Arrange
            (buildObserverContainer as jest.Mock).mockReturnValueOnce({ container: true });

            // Act
            startGame("namespace", options);

            // Assert
            expect(configure).toBeCalledWith({ namespace: { mobx, container: { container: true } } });
        });

        it("should return the container", () => {
            // Arrange
            const expected = { container: true };
            (getContainer as jest.Mock).mockReturnValueOnce(expected);

            // Act
            const actual = startGame("namespace", options);

            // Assert
            expect(actual).toStrictEqual(expected);
        });
    });
});

describe(getSharedContainer.name, () => {
    const configs: Configs.SiteConfigs = {
        enableMsgpackParserAllGames: true,
        env: "env",
        enableMsgpackParserOnNotification: true,
        serverDomainMapper: {},
        ssl: true,
        subDomain: "sub",
        subGuideDomain: "guide",
        systemType: "type",
        websocket: { proxyPath: "/", route: "route" },
    };

    describe("when called", () => {
        it("should get container from game client base", () => {
            // Act
            getSharedContainer(configs);

            // Assert
            expect(getContainer).toBeCalledWith(expect.objectContaining({ enabledFeatures: [Player.FEATURE_NAME, Auth.FEATURE_NAME] }));
        });

        it("should return the container", () => {
            // Arrange
            const expected = { container: true };
            (getContainer as jest.Mock).mockReturnValueOnce(expected);

            // Act
            const actual = getSharedContainer(configs);

            // Assert
            expect(actual).toStrictEqual(expected);
        });

        describe("and after the container is created", () => {
            it("should bind the site config to the container", () => {
                // Arrange
                const toConstantValue = jest.fn();
                const bind = jest.fn().mockReturnValue({ toConstantValue });
                const container = { bind };
                (getContainer as jest.Mock).mockImplementationOnce((options) => {
                    options.onContainerCreated(container);
                });

                // Act
                getSharedContainer(configs);

                // Assert
                expect(bind).toBeCalledWith(Configs.SiteConfigs);
                expect(toConstantValue).toBeCalledWith(configs);
            });
        });
    });
});

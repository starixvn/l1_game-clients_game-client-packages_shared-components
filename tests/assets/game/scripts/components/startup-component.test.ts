import { director } from "cc";
import StartupComponent from "../../../../../assets/game/scripts/components/startup-component";

describe(StartupComponent.name, () => {
    let component: StartupComponent;

    beforeEach(() => {
        component = new StartupComponent();
    });

    describe("onLoad", () => {
        describe("when called", () => {
            it("should execute connectToService method", () => {
                // Arrange
                component.connectToService = jest.fn();

                // Act
                component.onLoad();

                // Assert
                expect(component.connectToService).toBeCalled();
            });
        });
    });

    describe("loadSessionTimeoutScene", () => {
        describe("when the session is not timeout", () => {
            it("should do nothing", () => {
                // Act
                component.loadSessionTimeoutScene(false);

                // Assert
                expect(director.loadScene).toBeCalledTimes(0);
            });
        });

        describe("when the session is timeout", () => {
            it("should load scene session-timeout", () => {
                // Act
                component.loadSessionTimeoutScene(true);

                // Assert
                expect(director.loadScene).toBeCalledWith("session-timeout");
            });
        });
    });
});

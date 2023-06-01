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
                jest.spyOn(component, "connectToService");

                // Act
                component.onLoad();

                // Assert
                expect(component.connectToService).toBeCalled();
            });
        });
    });

    describe("loadUMScene", () => {
        describe("when the param isUM is false", () => {
            it("should do nothing", () => {
                // Act
                component.loadUMScene(false);

                // Assert
                expect(director.loadScene).toBeCalledTimes(0);
            });
        });

        describe("when the param isUM is true", () => {
            it("should load scene under-maintenance", () => {
                // Act
                component.loadUMScene(true);

                // Assert
                expect(director.loadScene).toBeCalledWith("under-maintenance");
            });
        });
    });
});

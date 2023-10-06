import { Tween, tween, UIOpacity } from "cc";
import { BlinkAnimation } from "db://shared-components/shared/common-components/blink-animation/blink-animation";

describe("BlinkAnimation", () => {
    let component: BlinkAnimation;
    const uiOpacity = {
        opacity: true,
    };

    beforeEach(() => {
        component = new BlinkAnimation();
    });

    describe("onEnable", () => {
        describe("when called", () => {
            it("should create tween as expected", () => {
                // Arrange
                const uiOpacity = component.node.getComponent(UIOpacity);

                // Act
                component.onEnable();
                const tweenInstance = tween();

                // Assert
                expect(tween).toBeCalledWith(uiOpacity);
                expect(tweenInstance.to).toBeCalledWith(0.2, { opacity: 0 });
                expect(tweenInstance.to).toBeCalledWith(0.2, { opacity: 255 });
                expect(tweenInstance.repeatForever).toBeCalledWith(tweenInstance);
                expect(tweenInstance.start).toBeCalled();
            });
        });
    });

    describe("onDisable", () => {
        describe("when called", () => {
            it("should stop the running tween", () => {
                // Arrange
                const tween = new Tween();

                component.runningTween = tween;

                // Act
                component["onDisable"]();

                // Assert
                expect(tween.stop).toBeCalled();
            });
        });
    });
});

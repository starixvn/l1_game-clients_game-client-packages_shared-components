import { Tween, tween, tweenInstance } from "cc";
import { BlinkAnimation } from "../../../../../assets/game/scoreboards/scripts/animations/blink-animation";

describe(BlinkAnimation.name, () => {
    let component: BlinkAnimation;
    const uiOpacity = {
        opacity: true,
    };

    beforeEach(() => {
        component = new BlinkAnimation();

        (component.node.getComponent as jest.Mock).mockReturnValue(uiOpacity);
    });

    describe("onEnable", () => {
        describe("when called", () => {
            it("should create tween as expected", () => {
                // Act
                component.onEnable();

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

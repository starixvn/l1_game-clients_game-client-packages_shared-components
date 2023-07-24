import { _decorator, Component, tween } from "cc";
import { FlashLightController } from "./flash-light-controller";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class FlashLightRotation extends Component {
    @property
    degreePerSecond = 360;

    @property
    clockwise = true;

    private controller: FlashLightController;
    onLoad() {
        this.controller = this.getComponent(FlashLightController);
    }

    onEnable() {
        const data = {
            angle: 0,
        };
        const angle = this.clockwise ? -this.degreePerSecond : this.degreePerSecond;
        tween(data)
            .by(
                1,
                { angle },
                {
                    onUpdate: (target: { angle }) => {
                        if (!this.controller) {
                            return;
                        }
                        this.controller.lightAngle = target.angle;
                        this.controller.updateController();
                    },
                }
            )
            .repeatForever()
            .start();
    }
}

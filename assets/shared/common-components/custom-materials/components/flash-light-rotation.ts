import { _decorator, Component, tween } from "cc";
import { FlashLightController } from "./flash-light-controller";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class FlashLightRotation extends Component {
    @property
    degreePerSecond = 360;

    private controller: FlashLightController;
    onLoad() {
        this.controller = this.getComponent(FlashLightController);
    }

    onEnable() {
        const data = {
            angle: 0,
        };
        tween(data)
            .by(
                1,
                { angle: -this.degreePerSecond },
                {
                    onUpdate: (target: { angle }) => {
                        this.controller.lightAngle = target.angle;
                        this.controller.updateController();
                    },
                }
            )
            .repeatForever()
            .start();
    }
}

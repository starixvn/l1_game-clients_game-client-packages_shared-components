import { Color, Component, Material, UIRenderer, Vec2, _decorator, v2 } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class FlashLightController extends Component {
    @property
    lightColor: Color = new Color();
    @property
    lightCenterPoint: Vec2 = v2(0.5, 0.5);
    @property
    lightAngle: number = 0;
    @property
    lightWidth: number = 0.5;
    @property
    enableGradient: boolean = true;
    @property
    cropAlpha: boolean = true;
    @property
    enableFog: boolean = false;

    private uiRenderer: UIRenderer;
    init() {
        this.uiRenderer = this.getComponent(UIRenderer);
    }

    onFocusInEditor() {
        this.updateController();
    }

    updateController() {
        if (!this.uiRenderer) {
            this.init();
        }
        let material: Material = this.uiRenderer.getMaterialInstance(0);
        material.setProperty("lightColor", this.lightColor);
        material.setProperty("lightCenterPoint", this.lightCenterPoint);
        material.setProperty("lightAngle", this.lightAngle);
        material.setProperty("lightWidth", this.lightWidth);
        material.setProperty("enableGradient", this.enableGradient ? 1.0 : 0.0);
        material.setProperty("cropAlpha", this.cropAlpha ? 1.0 : 0.0);
        material.setProperty("enableFog", this.enableFog ? 1.0 : 0.0);
    }
}

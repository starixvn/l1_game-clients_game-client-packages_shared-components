import { _decorator, Component, Material, Texture2D, UIRenderer } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass
@executeInEditMode
export class GradientNode extends Component {
    @property(Material)
    originMaterial: Material = null;

    @property(Texture2D)
    albedoTexture: Texture2D = null;

    private cloneMaterial: Material;

    onLoad() {
        this.changeMaterial();
    }

    private changeMaterial() {
        if (!this.albedoTexture || !this.originMaterial) {
            return;
        }
        this.cloneMaterial = new Material();
        this.cloneMaterial.copy(this.originMaterial);

        const renderComponent = this.getComponent(UIRenderer);
        if (renderComponent) {
            renderComponent.customMaterial = this.cloneMaterial;
            renderComponent.customMaterial.setProperty("albedoTexture", this.albedoTexture);
        }
    }

    onFocusInEditor() {
        this.changeMaterial();
    }
}

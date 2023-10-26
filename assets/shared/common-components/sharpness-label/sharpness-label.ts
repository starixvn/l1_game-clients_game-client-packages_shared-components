import { CCBoolean, Component, Label, RichText, _decorator, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("SharpnessLabel")
export class SharpnessLabel extends Component {
    @property(CCBoolean)
    isBitmapCacheMode = false;

    private readonly fontSizeWeight = 2;
    private get weightScale() {
        return 1 / this.fontSizeWeight;
    }
    private label: Label = null;
    private richText: RichText = null;

    protected onLoad(): void {
        this.label = this.node.getComponent(Label);
        this.richText = this.node.getComponent(RichText);

        [this.label, this.richText].forEach((component) => {
            if (component) {
                component.fontSize *= this.fontSizeWeight;
                component.lineHeight *= this.fontSizeWeight;
            }

            if (component instanceof RichText) {
                this.richText.maxWidth *= this.fontSizeWeight;
            }
        });

        this.node.scale = v3(this.weightScale, this.weightScale, this.weightScale);
    }
}

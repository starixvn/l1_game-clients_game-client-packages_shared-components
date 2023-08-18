import { CCBoolean, CacheMode, Component, Label, Node, RichText, _decorator, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("SharpnessLabel")
export class SharpnessLabel extends Component {
    @property(CCBoolean)
    isNoneCacheMode = false;

    private readonly weightFontSize = 2;
    private readonly weightScale = 0.5;
    private currentFontSize = 0;
    private label: Label = null;
    private richText: RichText = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TRANSFORM_CHANGED, this.transformChange, this);
        this.label = this.node.getComponent(Label);
        this.richText = this.node.getComponent(RichText);

        [this.label, this.richText].forEach((component) => {
            if (component) {
                component.fontSize *= this.weightFontSize;
                component.lineHeight *= this.weightFontSize;
                this.currentFontSize = component.fontSize;
            }

            if (component instanceof RichText) {
                this.richText.maxWidth *= this.weightFontSize;
            }
        });

        this.node.scale = v3(this.weightScale, this.weightScale, this.weightScale);
    }

    // Text is out of line or distorted when resizing and maximize window on desktop
    protected transformChange(): void {
        [this.label, this.richText].forEach((component) => {
            if (component) {
                this.isNoneCacheMode && (component.cacheMode = CacheMode.NONE);
                this.currentFontSize > 0 && (component.fontSize = this.currentFontSize);
            }
        });
    }
}

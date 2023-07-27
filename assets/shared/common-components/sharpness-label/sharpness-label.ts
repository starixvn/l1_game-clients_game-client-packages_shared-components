import { _decorator, Component, Label, RichText, v3 } from "cc";
const { ccclass } = _decorator;

@ccclass("SharpnessLabel")
export class SharpnessLabel extends Component {
    private weightFontSize = 2;
    private weightScale = 0.5;

    protected onLoad(): void {
        const label = this.node.getComponent(Label);
        const richText = this.node.getComponent(RichText);

        [label, richText].forEach((component) => {
            if (component) {
                component.fontSize *= this.weightFontSize;
                component.lineHeight *= this.weightFontSize;
            }

            if (component instanceof RichText) {
                richText.maxWidth *= this.weightFontSize;
            }
        });

        this.node.scale = v3(this.weightScale, this.weightScale, this.weightScale);
    }
}

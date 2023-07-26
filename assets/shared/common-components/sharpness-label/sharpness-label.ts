import { _decorator, Component, Label, RichText, v3 } from "cc";
const { ccclass } = _decorator;

@ccclass("SharpnessLabel")
export class SharpnessLabel extends Component {
    weightFontSize = 2;
    weightScale = 0.5;

    protected onLoad(): void {
        const label = this.node?.getComponent(Label);
        const richText = this.node?.getComponent(RichText);
        [label, richText].forEach((component) => {
            if (component) {
                component.fontSize = component.fontSize * this.weightFontSize;
                component.lineHeight = component.lineHeight * this.weightFontSize;
            }
        });

        this.node.scale = v3(this.weightScale, this.weightScale, this.weightScale);
    }
}

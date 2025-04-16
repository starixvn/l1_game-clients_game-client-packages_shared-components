import { _decorator, Color, Component, Label, Sprite } from "cc";
import { ComponentUtils } from "../utils";
const { ccclass, property } = _decorator;

@ccclass
export class ChangeNodeColor extends Component {
    @property
    defaultColor = "";

    updateSpriteColor(color = this.defaultColor) {
        this.node.getComponent(Sprite).color = new Color().fromHEX(color);
    }

    updateLabelColor(color = this.defaultColor) {
        this.node.getComponent(Label).color = new Color().fromHEX(color);
    }

    updateColor(color: string) {
        ComponentUtils.setNodeColor(this.node, color);
    }
}

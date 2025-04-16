import { _decorator, Component } from "cc";
import { ComponentUtils } from "../utils";
const { ccclass, property } = _decorator;

@ccclass
export class ChangeNodeColor extends Component {
    @property
    defaultColor = "";

    updateColor(color: string) {
        ComponentUtils.setNodeColor(this.node, color);
    }
}

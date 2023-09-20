import { Component, Node, _decorator } from "cc";
import { FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;

@ccclass("SplashInstantVisibility")
export default class SplashInstantVisibility extends Component {
    @property(Node)
    nodeLandscape: Node = null;

    @property(Node)
    nodePortrait: Node = null;

    protected onEnable(): void {
        if (FunctionUtils.isPortraitMode()) {
            this.nodePortrait.active = true;
            this.nodeLandscape.active = false;
        } else {
            this.nodePortrait.active = false;
            this.nodeLandscape.active = true;
        }
    }
}

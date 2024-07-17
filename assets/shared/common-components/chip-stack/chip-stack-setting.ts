import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ChipStackSetting")
export class ChipStackSetting extends Component {
    @property
    maxChipCount = 10;

    @property
    chipThickness = 5;
}

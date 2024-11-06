import { _decorator, Component, log, Node, Toggle } from "cc";
const { ccclass, property } = _decorator;

enum TabName {
    All = "all",
    GoodRoad = "good-road",
}

enum CategoryName {
    Classic = "classic",
    Speed = "speed",
    Lucky = "lucky",
}

@ccclass("SwitchTablePanel")
export class SwitchTablePanel extends Component {
    @property(Node)
    nodeScrollView: Node = null;

    @property(Node)
    nodeEmptyList: Node = null;

    onTabChanged(toggle: Toggle) {
        log("onTabChanged ", toggle.node.name);
        log("onTabChanged ", toggle.isChecked);
    }

    onCategoryChanged(toggle: Toggle) {
        log("onCategoryChanged ", toggle.node.name);
        log("onCategoryChanged ", toggle.isChecked);
    }

    onClickSetting() {}

    updateVisibility(existData: boolean) {
        this.nodeScrollView.active = existData;
        this.nodeEmptyList.active = !existData;
    }
}

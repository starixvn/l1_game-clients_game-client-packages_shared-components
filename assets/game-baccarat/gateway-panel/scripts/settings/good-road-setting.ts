import { _decorator, log, Node, Toggle } from "cc";
import Observer from "observer";
import LocalizedLabelWithFormat from "../../../../../../i18n/assets/LocalizedLabelWithFormat";
import {
    ONE_LOUNGE_2_ROOMS_BANKER,
    ONE_LOUNGE_2_ROOMS_PLAYER,
    PATTED_EAT_BANKER,
    PATTED_EAT_PLAYER,
    PING_PONG_BANKER,
    PING_PONG_PLAYER,
    STREAK_BANKER,
    STREAK_PLAYER,
} from "../../../../game/scoreboards/scripts/components/baccarat/big-road/baccarat-big-road-good-road-patterns";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { GoodRoadStore } from "./good-road-store";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
@ccclass("GoodRoadSetting")
export class GoodRoadSetting extends ObserverComponent {
    @property(Toggle)
    toggleAll: Toggle = null;

    @property(Node)
    patternToggleContainer: Node = null;

    patternToggles: Toggle[] = [];

    selectedFlag = {};

    private readonly configToggles = [
        { key: "streak_banker", pattern: STREAK_BANKER },
        { key: "streak_player", pattern: STREAK_PLAYER },

        { key: "ping_pong_banker", pattern: PING_PONG_BANKER },
        { key: "ping_pong_player", pattern: PING_PONG_PLAYER },

        { key: "patted_eat_banker", pattern: PATTED_EAT_BANKER },
        { key: "patted_eat_player", pattern: PATTED_EAT_PLAYER },

        { key: "one_lounge_two_bedrooms_banker", pattern: ONE_LOUNGE_2_ROOMS_BANKER },
        { key: "one_lounge_two_bedrooms_player", pattern: ONE_LOUNGE_2_ROOMS_PLAYER },
    ];

    onLoad() {
        super.onLoad();
        this.patternToggles = this.patternToggleContainer.getComponentsInChildren(Toggle);

        try {
            this.patternToggles.forEach((toggle, index) => {
                const key = this.configToggles[index].key;
                toggle.node.name = key;
                const label = toggle.node.getComponentInChildren(LocalizedLabelWithFormat);
                label.key = `BaccaratX.${key}`;
            });
        } catch (e) {
            log(e);
        }
    }

    onToggleAll(toggle: Toggle) {
        const activeAll = toggle.isChecked;
        this.patternToggles.forEach((toggle) => (toggle.isChecked = activeAll));
    }

    onSinglePatternToggle(toggle: Toggle) {
        this.updateSelectedPatterns(toggle.node.name, toggle.isChecked);
    }

    @handle(GoodRoadStore, (store, selectedFlag: { [key: string]: boolean }) => store.updateSelectedPatterns(selectedFlag))
    updateSelectedPatterns(key: string, checked: boolean) {
        if (!checked) {
            this.toggleAll.isChecked = false;
        }
        this.selectedFlag[key] = checked;
        return this.selectedFlag;
    }
}

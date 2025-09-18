import { _decorator } from "cc";
import { GameGuideContainer } from "db://shared-components/game/game-guide/scripts/game-guide-container";
import { InGameMenuEvents } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-events";
const { ccclass } = _decorator;

@ccclass("OriginalGamesGameGuideContainer")
export class OriginalGamesGameGuideContainer extends GameGuideContainer {
    openGuide({ event }: { event: InGameMenuEvents }) {
        super.openGuide({ event });
    }
}

import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { InGameMenuEvents } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-store";
import Observer from "observer";
import { NodeContainer } from "../../node-container/node-container";

const { render, handle } = Observer;
const { ccclass, property } = _decorator;

@ccclass("VolumeControlContainer")
export class VolumeControlContainer extends NodeContainer {

    @property(AudioContainer)
    audioContainer: AudioContainer = null;

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openVolumeControl({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_VOLUME_CONTROL) {
            this.openDialog();
        }
    }

    protected openDialog() {
        this.createNode();
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.node.destroyAllChildren();
    }
}

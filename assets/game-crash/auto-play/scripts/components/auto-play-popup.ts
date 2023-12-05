import gc from "@sg/game-client-base";
import { Node, Prefab, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { PopupsHandlers } from "../../../popups/popups-handlers";
import { AutoPlayHandler } from "../handlers/auto-play-handler";
import { AutoPlayStore } from "../stores/auto-play-store";
import { RoundNumberItem } from "./round-number-item";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, Notices } = gc;

@ccclass
export class AutoPlayPopup extends ObserverComponent {
    @property(Node)
    nodeContent: Node = null;

    @property(Prefab)
    prfNoOfRound: Prefab = null;

    @render(AutoPlayStore, (store) => store.roundsList)
    initContentRounds(roundsList: number[]) {
        this.nodeContent.destroyAllChildren();
        roundsList.forEach((round) => {
            const node = instantiate(this.prfNoOfRound);
            const roundNumber = node.getComponent(RoundNumberItem);
            roundNumber?.setValue(round);
            this.nodeContent.addChild(node);
        });
    }

    @render(AutoPlayStore, (store) => store.selectedRoundOnPopup)
    renderSelectedRounds(noOfRounds: number) {
        this.nodeContent.children.forEach((child) => {
            const roundNumber = child.getComponent(RoundNumberItem);
            const selectedBg = roundNumber.value === noOfRounds;
            roundNumber.setSelectedRound(selectedBg);
        });
    }

    @render(AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    setAutoPlayPopupVisibility(status: boolean) {
        this.node.active = status;
        status && this.closeOtherPopups();
    }

    @handle(PopupsHandlers, (handle) => handle.closeOtherPopupsWithoutAutoPlay())
    closeOtherPopups() {}

    @handle(AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    onClickclosePopup() {}

    @handle(AutoPlayHandler, (handle) => handle.confirmRoundAndStart())
    onClickStartButton() {}

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.isCrashed)
    checkFinishedAutoPlay(isCrashed: boolean) {
        if (isCrashed) {
            setTimeout(() => {
                this.updateAutoPlayMode();
            }, 4000);
        }
    }

    @handle(AutoPlayHandler, (handle) => handle.checkFinishedPlayMode())
    updateAutoPlayMode() {}

    @render(Notices.NoticeStore, (store) => store.notice)
    withExcludedGameInfo(notice: any) {
        const isExcludedGameOrApiError =
            notice?.noticeInfo === Notices.NoticeInfo.ExcludedGame || notice?.noticeInfo === Notices.NoticeInfo.ApiError;

        if (isExcludedGameOrApiError) {
            this.handleAutoPlay();
        }
    }

    @handle(AutoPlayHandler, (handle) => handle.cancelAutoPlay())
    handleAutoPlay() {}
}

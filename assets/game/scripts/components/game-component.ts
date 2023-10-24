import gc from "@sg/game-client-base";
import { Game, Label, Prefab, _decorator, game, instantiate, sys } from "cc";
import Observer from "observer";
import { StaticNode } from "../../../shared/common-components/static-node/scripts/static-node";
import { StaticGroupId } from "../../../shared/common-components/static-node/scripts/static-node-info";
import { ComponentUtils, FunctionUtils } from "../../../shared/utils";
import { LogStore } from "../stores/log-store";
import { GameComponentBase } from "./game-component-base";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-magager/bundle-manager";

const { Rounds, Connection, HideGame, Settlements, FormatUtils, RoundHistories } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class GameComponent extends GameComponentBase {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblMinBet: Label = null;

    @property(Label)
    lblMaxBet: Label = null;

    containerOptions: gc.IContainerOptions;

    onLoad() {
        game.on(Game.EVENT_HIDE, this.onHideGame, this);
        game.on(Game.EVENT_SHOW, this.onShowGame, this);
        this.initUserSettings();
        this.initPlayerSelections();
        this.handleStaticNodeAndSetEmptyLabels();
    }

    protected handleStaticNodeAndSetEmptyLabels() {
        const lblList: Label[] = [this?.lblRoundId, this?.lblMinBet, this?.lblMaxBet];
        if (lblList.length > 0) {
            lblList?.forEach((label) => {
                if (label) {
                    const component = label?.addComponent(StaticNode);
                    component && (component.groupId = StaticGroupId.TextContainer);
                }
            });
            ComponentUtils.setEmptyLabels(lblList);
        }
    }

    @handle(gc.Connection.ConnectionHandlers.ConnectHandler)
    connectToService() {}

    @render(gc.GameConfigs.GameSetting, (gameSetting) => gameSetting.name)
    logLoadScene(gameName: string) {
        console.log(`LoadScene ${gameName}`);
    }

    @render(LogStore, (store) => store.message)
    logInfo(message: string) {}

    @handle(gc.UserSettings.UserSettingHandlers, (handle) => handle.loadStorages())
    initUserSettings() {}

    @handle(gc.PlayerSelections.PlayerSelectionHandlers.InitHandlers)
    initPlayerSelections() {}

    protected onDestroy(): void {
        game.off(Game.EVENT_HIDE, this.onHideGame, this);
        game.off(Game.EVENT_SHOW, this.onShowGame, this);
    }

    @handle(HideGame.HideGameHandler)
    onHideGame() {
        // reload here will run when page appears from hidden
        // to fix issue on iOS that EVENT_SHOW are not triggered when phone active
        if (sys.os === sys.OS.IOS) {
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }

    onShowGame() {
        window.location.reload();
    }

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignedIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGameAndShowResult(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        const { roundHistory, isShow } = joinGameHistory ?? {};
        if (roundHistory && isShow) {
            this.showResult(roundHistory?.result, false);
        }
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    renderRoundId(roundId: number) {
        roundId > 0 && this.lblRoundId && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(Rounds.RoundStore, (store) => ({ minBet: store.minBet, maxBet: store.maxBet }))
    renderMinMaxBet({ minBet, maxBet }: { minBet: number; maxBet: number }) {
        this.lblMinBet && (this.lblMinBet.string = FormatUtils.numberWithCommas(minBet));
        this.lblMaxBet && (this.lblMaxBet.string = FormatUtils.numberWithCommas(maxBet));
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result, settlementResult } = data;

        if (!result || !settlementResult) {
            return;
        }
        this.showResult(result, true).then(() => {
            this.finishShowResult(result, settlementResult);
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {}

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    handleStartRound(isStartRound: boolean) {}

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        isStartRound && this.playSound(gc.Audios.AudioIds.STARTING_ROUND);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }

    @render(
        gc.Notification.BoostedOddsStore,
        (store) => {
            return {
                isInstantVersion: store.isInstantVersion,
                shouldAddBoostedOddPrefab: store.shouldAddBoostedOddPrefab,
            };
        },
        { fireImmediately: false }
    )
    async addBoostedOddIconPrefab(model: { isInstantVersion: boolean; shouldAddBoostedOddPrefab: boolean }) {
        let prefabPath = "boosted-odds";
        if (model.isInstantVersion) {
            prefabPath += FunctionUtils.isPortraitMode() ? "-portrait" : "-landscape";
        }

        console.log(`%c gameVersion: ${prefabPath}`, "color: blue; font-size: larger");
        if (model.shouldAddBoostedOddPrefab) {
            console.log("%c Add boosted odds", "color: red; font-size: larger");
            const prfBoostedOddIcon = await bundleManager.loadAssetsFromBundle<Prefab>(prefabPath, `prefabs/boosted-odds`, Prefab, null);

            const prfBoostedOddContainer = await bundleManager.loadAssetsFromBundle<Prefab>(
                prefabPath,
                `prefabs/boosted-odds-container`,
                Prefab,
                null
            );
            this.node.addChild(instantiate(prfBoostedOddIcon));
            this.node.addChild(instantiate(prfBoostedOddContainer));
            setTimeout(() => {
                this.handleSetBoostedOddsLoadedPrefab();
            }, 1000);
        }
    }

    @handle(gc.Notification.BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers, (handler) => handler.setIsLoadedPrefab(true))
    handleSetBoostedOddsLoadedPrefab() {}
}

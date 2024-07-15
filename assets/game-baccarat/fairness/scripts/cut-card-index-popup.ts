import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, instantiate, Label, Node, Prefab, ScrollView, tween, Tween } from "cc";
import FileSaver from "file-saver";
import Observer from "observer";
import { Dialog } from "../../../shared/common-components/dialogs/dialog";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ClientSeedInfo } from "../../../shared/common-components/provably-fair/client-seed-info";
const { CutCardPF, GameBaccaratX, DateTimeUtils, Auth } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { saveAs } = FileSaver;

@ccclass
export class CutCardIndexPopup extends ObserverComponent {
    @property(Node)
    nodeSeedPlayers: Node = null;

    @property(Label)
    lblServerSeed: Label = null;

    @property(Label)
    lblMergeSeed: Label = null;

    @property(Prefab)
    prfPlayerSeed: Prefab = null;

    @property(Label)
    lblFinalCutCard: Label = null;

    @property(Label)
    lblAverage: Label = null;

    @property(ScrollView)
    playerSeedScrollView: ScrollView = null;

    @property(Dialog)
    dialog: Dialog = null;

    roundId = 0;
    playerName = "";

    private playerCutCards = [];
    private dataPF = null;
    private DURATION_DELAY_RENDER_DATA = 0.3;
    private TAG_INDEX = 5;

    onLoad(): void {
        super.onLoad();
        this.dialog?.callBackFn &&
            (this.dialog.callBackFn = () => {
                tween(this?.node)
                    .delay(this.DURATION_DELAY_RENDER_DATA)
                    .call(() => {
                        this.renderSeedPlayers(this.playerCutCards);
                        this.renderCombinedHash(this.dataPF);
                        this.playerSeedScrollView?.scrollToLeft(0);
                    })
                    .tag(this.TAG_INDEX)
                    .start();
            });
    }
    onDestroy(): void {
        super.onDestroy();
        Tween.stopAllByTag(this.TAG_INDEX);
        this.unscheduleAllCallbacks();
    }

    @render(gc.Player.MainPlayerStore, (store) => store.name)
    renderPlayerName(name: string) {
        this.playerName = name;
    }

    @handle(CutCardPF.FairnessHandler, (handle) => handle.closeCutCardIndex())
    closePopup() {}

    @render(GameBaccaratX.RoundPF.RoundPFStore, (store) => store.pf)
    renderRound(pf: GameServiceMessage.ShoeVerification) {
        if (!pf) {
            return;
        }
        this.lblMergeSeed.string = pf?.cutCardIndex.toString();
        this.lblServerSeed.string = pf?.cutCardPF?.serverCutCardIndex.toString();
        this.playerCutCards = pf?.cutCardPF?.playerCutCards;
        this.dataPF = pf;
    }

    renderSeedPlayers(seedPlayers) {
        seedPlayers.forEach((player) => {
            const node = instantiate(this.prfPlayerSeed);
            const comp = node.getComponent(ClientSeedInfo);
            comp.setDisplayName(player, this.playerName !== player.name);
            this.nodeSeedPlayers.addChild(node);
        });
    }

    onClickSave() {
        let data = "Player,Nickname,Seed\n";
        this.playerCutCards.forEach((player, index) => {
            data += `${index + 1},${player.name},${player.clientSeed}\n`;
        });
        const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
        const fileName = `Round_${this.roundId}_${DateTimeUtils.getStringDateNow()}.csv`;
        saveAs(blob, fileName);
    }

    private renderCombinedHash(pf: GameServiceMessage.ShoeVerification) {
        this.lblFinalCutCard.string = pf.cutCardIndex.toString();
        let clientSeedStr = `${pf.cutCardPF.serverCutCardIndex},`;
        this.playerCutCards.forEach((player, index) => {
            const seed = player.clientSeed;
            clientSeedStr += index === this.playerCutCards.length - 1 ? seed : `${seed},`;
        });
        this.lblAverage.string = `Average(${clientSeedStr}) = ${pf.cutCardIndex}`;
    }
}

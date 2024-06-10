import gc, { GameServiceMessage } from "@sg/game-client-base";
import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import FileSaver from "file-saver";
import Observer from "observer";
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

    roundId = 0;
    playerName = "";

    private playerCutCards = [
        { name: "Matrix42549", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
        { name: "T12123", clientSeed: 123 },
    ];

    @render(gc.Player.MainPlayerStore, (store) => store.name)
    renderPlayerName(name: string) {
        console.log("renderPlayerName", name);
        this.playerName = name;
    }

    @handle(CutCardPF.FairnessHandler, (handle) => handle.closeCutCardIndex())
    closePopup() {}

    @render(GameBaccaratX.RoundPF.RoundPFStore, (store) => store.pf)
    renderRound(pf: GameServiceMessage.ShoeVerification) {
        if (!pf) {
            return;
        }
        this.lblMergeSeed.string = pf.cutCardIndex.toString();
        this.lblServerSeed.string = pf.cutCardPF.serverCutCardIndex.toString();
        //this.renderSeedPlayers(pf.cutCardPF.playerCutCards);
        this.renderSeedPlayers(this.playerCutCards);
    }

    renderSeedPlayers(seedPlayers) {
        seedPlayers.forEach((player) => {
            const node = instantiate(this.prfPlayerSeed);
            const comp = node.getComponent(ClientSeedInfo);
            comp.setDisplay(player, this.playerName !== player.name);
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
}

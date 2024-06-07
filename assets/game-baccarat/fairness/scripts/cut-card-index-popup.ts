import gc, { GameServiceMessage } from "@sg/game-client-base";
import { _decorator, instantiate, Label, Node, Prefab } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { ClientSeedInfo } from "../../../shared/common-components/provably-fair/client-seed-info";
const { CutCardPF, GameBaccaratX } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

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

    private playerCutCards = [
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
        { name: "T12123", clientSeed: 123 },
    ];

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
            comp.setDisplay(player);
            this.nodeSeedPlayers.addChild(node);
        });
    }
}

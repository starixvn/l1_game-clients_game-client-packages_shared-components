import gc from "@sg/game-client-base";
import { _decorator, Node, Sprite, SpriteAtlas, Tween, tween, UIOpacity, v3 } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";
import { FunctionUtils } from "../../../../shared/utils";
const { ccclass, property } = _decorator;
const { Settlements, Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class ScoreboardCollapseExpandContent extends ObserverComponent {
    private tween: Tween<Node> = null;

    @property(Node)
    nodeBigRoad: Node = null;

    @property(Node)
    nodeBgPercent1: Node = null;

    @property(Node)
    nodeBgPercent2: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    private readonly POSITION_COLLAPSE = 505;
    private readonly POSITION_EXPAND = 371;
    private nameSpriteFrame = "Big-road-board-BG-bot-side";

    @render(Settlements.SettlementStore, (store) => store.settlementResult)
    async collapseScoreboard(settlementResult) {
        if (settlementResult) {
            this.animChangePositon(this.node, this.POSITION_COLLAPSE);
            await FunctionUtils.delay(500);
            this.nodeBigRoad.getComponent(UIOpacity).opacity = 0;
            this.nodeBgPercent1.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(`${this.nameSpriteFrame}-collapse`);
            this.nodeBgPercent2.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(`${this.nameSpriteFrame}-collapse`);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    expandScoreboard(isStartRound: boolean) {
        if (isStartRound) {
            this.nodeBigRoad.getComponent(UIOpacity).opacity = 255;
            this.animChangePositon(this.node, this.POSITION_EXPAND);
            this.nodeBgPercent1.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(this.nameSpriteFrame);
            this.nodeBgPercent2.getComponent(Sprite).spriteFrame = this.mainAtlas.getSpriteFrame(this.nameSpriteFrame);
        }
    }

    animChangePositon(node: Node, y: number) {
        this.tween && this.tween.stop();
        this.tween = tween(node)
            .to(0.5, { position: v3(this.node.position.x, y, 0) })
            .start();
    }
}

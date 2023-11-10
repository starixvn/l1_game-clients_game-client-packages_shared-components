import gc from "@sg/game-client-base";
import { Animation, Component, Node, Sprite, SpriteAtlas, _decorator } from "cc";
import { AnimationUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;

const { Configs } = gc;

export interface DominoCardModel {
    top: number;
    bottom: number;
}

enum AnimationName {
    Open_Card = "open-domino-card",
    Draw_Card = "draw-domino-card",
    Pull_Card = "pull-domino-card",
}

@ccclass("DominoCard")
export class DominoCard extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Node)
    background: Node = null;

    @property(Sprite)
    rankTop: Sprite = null;

    @property(Sprite)
    rankBottom: Sprite = null;

    @property(Sprite)
    backCard: Sprite = null;

    animation: Animation;
    public dominoCard: DominoCardModel = { top: 0, bottom: 0 };

    protected onLoad(): void {
        this.animation = this.getComponent(Animation);
    }

    setDominoCard(dominoCard: DominoCardModel) {
        this.dominoCard = dominoCard;
    }

    setBackDominoCardSystem(systemType: string) {
        const spriteFrameName = systemType === Configs.SystemConfigs.VG.name ? "back-VG" : "back-SG";
        this.backCard.spriteFrame = this.atlas.getSpriteFrame(spriteFrameName);
    }

    pullDominoCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Pull_Card, duration);
    }

    drawDominoCard(duration: number) {
        return AnimationUtils.playAnimation(this.animation, AnimationName.Draw_Card, duration);
    }

    async openDominoCard() {
        if (this.animation) {
            await AnimationUtils.playAnimation(this.animation, AnimationName.Open_Card);
        } else {
            this.faceUp();
        }
    }

    faceUp() {
        this.changeDominoCardFace(true);
    }

    faceDown() {
        this.changeDominoCardFace(false);
    }

    protected changeDominoCardFace(faceUp: boolean) {
        if (faceUp) {
            if (this.dominoCard) {
                this.updateDominoCardFace();
            } else {
                console.warn("Call setFaceUp when domino-card is null");
                this.showDominoCardBack();
            }
        } else {
            this.showDominoCardBack();
        }
    }

    private updateDominoCardFace() {
        this.updateSpriteFrame(this.rankTop, this.dominoCard?.top?.toString());
        this.updateSpriteFrame(this.rankBottom, this.dominoCard?.bottom?.toString());

        this.background.active = true;
    }

    private updateSpriteFrame(spriteNode: Sprite, value: string) {
        const frame = this.atlas.getSpriteFrame(value);
        spriteNode.spriteFrame = frame || null;
    }

    protected showDominoCardBack() {
        this.background.active = false;
    }
}

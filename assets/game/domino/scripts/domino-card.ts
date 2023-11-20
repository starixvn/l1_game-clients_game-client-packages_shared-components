import gc from "@sg/game-client-base";
import { Animation, Component, Node, Sprite, SpriteAtlas, _decorator, warn } from "cc";
import { AnimationUtils, FunctionUtils } from "../../../shared/utils";
const { ccclass, property } = _decorator;

const { Configs } = gc;

export interface DominoCardModel {
    top: number;
    bottom: number;
}

enum AnimationName {
    OpenDominoCard = "open-domino-card",
    DrawDominoCard = "draw-domino-card",
    PullDominoCard = "pull-domino-card",
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

    protected async playAnimationWithAsyncExecute(animationName: string, duration: number) {
        return FunctionUtils.asyncExecute(this.node, AnimationUtils.playAnimation(this.animation, animationName, duration));
    }

    async pullDominoCard(duration: number) {
        try {
            return await this.playAnimationWithAsyncExecute(AnimationName.PullDominoCard, duration);
        } catch (error) {
            warn("Error in play anim pullDominoCard:", error);
            throw error;
        }
    }

    async drawDominoCard(duration: number) {
        try {
            return await this.playAnimationWithAsyncExecute(AnimationName.DrawDominoCard, duration);
        } catch (error) {
            warn("Error in play anim drawDominoCard:", error);
            throw error;
        }
    }

    async openDominoCardAnim(duration: number) {
        let result;
        if (this.animation) {
            try {
                result = await this.playAnimationWithAsyncExecute(AnimationName.OpenDominoCard, duration);
            } catch (error) {
                warn("An error occurred when play anim open domino", error);
            }
        }

        return result;
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

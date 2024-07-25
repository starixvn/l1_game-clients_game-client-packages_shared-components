import { _decorator, Node, sp, Sprite, SpriteAtlas } from "cc";
import { AnimationUtils } from "../../../shared/utils/utils";
import { PokerCard } from "./poker-card";
const { ccclass, property } = _decorator;

enum AnimationName {
    OpenCard = "open-card",
    CloseCard = "close-card",
    LuckyCard = "lucky-card",
    BackCard = "default-back",
    FrontCard = "default-front",
    FrontCardGold = "default-front-gold",
    HighlightCardOn = "highlight",
    HighlightCardOff = "default",
}

@ccclass
export class PokerCardSpine extends PokerCard {
    @property(sp.Skeleton)
    skeletonCard: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeletonCardWin: sp.Skeleton = null;

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Node)
    bgBackCard: Node = null;

    @property(Node)
    bgWhiteCard: Node = null;

    @property(Sprite)
    rank: Sprite = null;

    @property(Sprite)
    smallSuit: Sprite = null;

    @property(Sprite)
    largeSuit: Sprite = null;

    @property(Node)
    bgGolden: Node = null;

    @property(Node)
    nodeWinHighlight: Node = null;

    protected onLoad(): void {
        this.setStatusSkeletonCardWin(false);
    }

    setStatusSkeletonCardWin(status: boolean) {
        this.skeletonCardWin?.node && (this.skeletonCardWin.node.active = status);
    }

    async setGoldenCard(show: boolean, animated: boolean) {
        if (!this.bgGolden) {
            return;
        }

        if (animated) {
            if (show) {
                await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.LuckyCard, false);
            }
        } else {
            await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.FrontCardGold, false);
        }
    }

    dropCard(duration: number) {
        return AnimationUtils.playSpine(this?.skeletonCard, AnimationName.CloseCard, false, duration);
    }

    async openCard(animated = true) {
        if (animated) {
            await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.OpenCard, false);
        } else {
            this.faceUp();
        }
    }

    async closeCard(duration: number) {
        this.setStatusSkeletonCardWin(false);
        await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.CloseCard, false, duration);
    }

    async closeAfterDrop(duration: number) {}

    faceUp() {
        this.changeCardFace(true);
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.FrontCard, false);
    }

    async faceDown() {
        this.changeCardFace(false);
        await AnimationUtils.playSpine(this?.skeletonCard, AnimationName.BackCard, false);
    }

    async setWinHighlight(show: boolean) {
        this.setStatusSkeletonCardWin(show);
        show && (await AnimationUtils.playSpine(this?.skeletonCardWin, AnimationName.HighlightCardOn, false));
    }

    protected override setDetailVisibility(active: boolean) {}

    protected override async showCardBack() {
        AnimationUtils.playSpine(this?.skeletonCard, AnimationName.BackCard, false);
    }
}

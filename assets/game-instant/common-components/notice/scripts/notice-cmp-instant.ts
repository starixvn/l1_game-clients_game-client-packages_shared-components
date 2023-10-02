import { Label, Node, Sprite, SpriteFrame, _decorator } from "cc";
import { NoticeCmp } from "../../../../shared/common-components/notice/scripts/notice-cmp";
const { ccclass, property } = _decorator;

@ccclass("NoticeCmpInstant")
export class NoticeCmpInstant extends NoticeCmp {
    @property({ override: true, visible: false })
    containerBackground: Sprite = null;

    @property({ override: true, visible: false })
    lblTitle: Label = null;

    @property({ override: true, visible: false })
    errorBackground: SpriteFrame = null;

    @property({ override: true, visible: false })
    infoBackground: SpriteFrame = null;

    @property({ override: true, visible: false })
    btnConfirm: Node = null;
}

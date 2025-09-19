import { _decorator, Node, Slider, Sprite, SpriteFrame, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("custom_slider")
export class CustomSlider extends Slider {
    @property(Node)
    slideBar: Node = null;

    @property(Node)
    slideBarBg: Node = null;

    @property(SpriteFrame)
    thumbOn: SpriteFrame = null;

    @property(SpriteFrame)
    thumbOff: SpriteFrame = null;

    @property(Sprite)
    thumbNode: Sprite = null;

    updateSliderBar(progress: number) {
        const slideBarWidth = this.slideBarBg.getComponent(UITransform).width;
        const width = progress * slideBarWidth;
        this.slideBar.getComponent(UITransform).width = width;
        this.thumbNode.spriteFrame = progress > 0 ? this.thumbOn : this.thumbOff;
    }
}

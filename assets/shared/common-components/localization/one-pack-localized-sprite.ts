import { CCString, Component, Sprite, SpriteAtlas, _decorator, error } from "cc";
import gc from "@sg/game-client-base";
const {Translator} = gc;

const { ccclass, property } = _decorator;

@ccclass("OnePackLocalizedSprite")
export class OnePackLocalizedSprite extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(CCString)
    prefix = "";

    @property(CCString)
    defaultLocalized = "";

    protected sprite: Sprite;

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(Translator.getCurrentLanguageId());
        }
    }

    getSpriteFrameByLang(lang: string) {
        const spriteName = `${this.prefix}_${lang}`;
        return this.atlas.getSpriteFrame(spriteName);
    }

    getDefaultSprite() {
        const spriteName = this.defaultLocalized ? `${this.prefix}_en` : this.prefix;
        return this.atlas.getSpriteFrame(spriteName);
    }

    updateSprite(language: string) {
        if (!this.sprite) {
            if (this.node.activeInHierarchy) {
                error("Failed to update localized sprite, sprite component is invalid!");
            }
            return;
        }

        let spriteFrame = this.getSpriteFrameByLang(language);
        if (!spriteFrame) {
            spriteFrame = this.getDefaultSprite();
        }

        this.sprite.spriteFrame = spriteFrame;
    }
}

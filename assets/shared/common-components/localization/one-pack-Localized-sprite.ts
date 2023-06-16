import { Component, Sprite, SpriteAtlas, _decorator, error } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class OnePackLocalizedSprite extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property
    prefix = "";

    @property
    defaultLocalized = "";

    protected sprite: Sprite;

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.l10n.currentLanguage);
            return;
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

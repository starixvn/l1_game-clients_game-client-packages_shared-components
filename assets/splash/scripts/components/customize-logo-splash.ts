import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import * as i18n from "db://i18n/LanguageData";
const { ccclass, property } = _decorator;

@ccclass
export class CustomizeLogoSplash extends Component {
    @property(Sprite)
    sprLogo: Sprite = null;

    @property(Sprite)
    sprTagline: Sprite = null;

    @property
    isSystemSC: boolean = true;
    onLoad() {
        const logoName = this.isSystemSC ? "logo_saba.png" : "logo_vgaming.png";
        const absolutePathLogo = `${window.location.href}logoName`;
        assetManager.loadRemote<ImageAsset>(absolutePathLogo, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprLogo.spriteFrame = spriteFrameTmp;
        });
        const taglineName = this.isSystemSC ? "splash_text_sc1" : "splash_text_sc2";
        const lang = i18n._language;
        const taglinePath = `${window.location.href}${taglineName}_${lang}.png`;
        console.log("lang", lang);
        assetManager.loadRemote<ImageAsset>(taglinePath, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprTagline.spriteFrame = spriteFrameTmp;
        });
    }
}

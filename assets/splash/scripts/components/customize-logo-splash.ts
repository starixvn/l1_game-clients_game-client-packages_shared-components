import gc from "@sg/game-client-base";
import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import * as i18n from "db://i18n/LanguageData";
import Observer from "observer";
import { OperatorUtils } from "../../../shared/utils/operator-utils";
const { ccclass, property } = _decorator;

const { Configs } = gc;
const { observer, handle, render } = Observer;

@ccclass
export class CustomizeLogoSplash extends Component {
    @property(Sprite)
    sprLogo: Sprite = null;

    @property(Sprite)
    sprTagline: Sprite = null;

    private systemType: string = "";

    onLoad() {
        this.renderLogo();
        console.log("renderTagLine");
        this.renderTagLine(this.systemType);
    }

    @render(Configs.SiteConfigs, (store) => store.systemType)
    async showSystemSlogan(systemType: string) {
        console.log("systemType", systemType);
        this.systemType = systemType;
    }

    renderLogo() {
        const operator = OperatorUtils.getOperatorAlias();
        if (operator === "OTHER") {
            return;
        }

        const logoName = `logo_${operator.toLowerCase()}`;
        const logoPath = `${window.location.href}${logoName}.png`;
        assetManager.loadRemote<ImageAsset>(logoPath, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprLogo.spriteFrame = spriteFrameTmp;
        });
    }

    renderTagLine(systemType: string) {
        const taglineName = systemType ? "splash_text_sc1" : "splash_text_sc2";
        const lang = i18n._language;
        const taglinePath = `${window.location.href}${taglineName}_${lang}.png`;
        assetManager.loadRemote<ImageAsset>(taglinePath, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprTagline.spriteFrame = spriteFrameTmp;
        });
    }
}

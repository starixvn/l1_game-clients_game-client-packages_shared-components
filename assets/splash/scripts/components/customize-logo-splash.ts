import gc from "@sg/game-client-base";
import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import * as i18n from "db://i18n/LanguageData";
import Observer from "observer";
import { FunctionUtils } from "../../../shared/utils/function-utils";
import { OperatorAlias, OperatorUtils } from "../../../shared/utils/operator-utils";
import { isValidNode } from "./../../../shared/utils/utils";
const { ccclass, property } = _decorator;

const { Configs } = gc;
const { observer, handle, render } = Observer;

const POWEREDBY = {
    [OperatorAlias.SG]: "bong88",
    [OperatorAlias.TIP88]: "Vgaming",
};

@ccclass
export class CustomizeLogoSplash extends Component {
    @property(Sprite)
    sprLogo: Sprite = null;

    @property(Sprite)
    sprTagline: Sprite = null;

    @property(Sprite)
    sprPoweredBy: Sprite = null;

    @property
    versionImg = 1;

    protected readonly href = `${window.location.origin}${window.location.pathname}`;

    onLoad() {
        if (FunctionUtils.isLocalhost()) {
            return;
        }
        this.renderLogo();
        this.renderTagLine();
        this.renderPoweredBy();
    }

    renderLogo() {
        const operator = OperatorUtils.getOperatorAlias();
        if (operator === "OTHER") {
            return;
        }

        const logoName = `logo_${operator.toLowerCase()}`;
        const logoPath = `${this.href}images/${logoName}.webp?v=${this.versionImg}`;
        assetManager.loadRemote<ImageAsset>(logoPath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprLogo.spriteFrame = spriteFrameTmp;
            this.sprLogo.sizeMode = Sprite.SizeMode.RAW;
        });
    }

    renderTagLine() {
        const taglinePath = this.createTagLinePath();
        assetManager.loadRemote<ImageAsset>(taglinePath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprTagline.spriteFrame = spriteFrameTmp;
            this.sprTagline.sizeMode = Sprite.SizeMode.RAW;
        });
    }

    protected createTagLinePath() {
        const lang = i18n._language;
        return `${this.href}images/splash_text_${lang}.webp?v=${this.versionImg}`;
    }

    renderPoweredBy() {
        const operator = OperatorUtils.getOperatorAlias();
        const system = POWEREDBY[operator];

        if (system) {
            const poweredByPath = this.createPoweredByPath(system);
            assetManager.loadRemote<ImageAsset>(poweredByPath, (err, imageAsset) => {
                if (!isValidNode(this)) {
                    return;
                }
                const spriteFrameTmp = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrameTmp.texture = texture;
                this.sprPoweredBy.spriteFrame = spriteFrameTmp;
                this.sprPoweredBy.sizeMode = Sprite.SizeMode.RAW;
            });
        }
    }

    createPoweredByPath(system: string) {
        if (system === POWEREDBY[OperatorAlias.SG]) {
            return `${this.href}images/powered_by.webp?v=${this.versionImg}`;
        }
        const lang = i18n._language;
        return `${this.href}images/powered_by_${system}_${lang}.webp?v=${this.versionImg}`;
    }
}

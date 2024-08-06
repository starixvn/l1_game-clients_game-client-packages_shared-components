import gc from "@sg/game-client-base";
import { _decorator, Component, ImageAsset, JsonAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import { FunctionUtils } from "../../../shared/utils";
import { isValidNode } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;
const { Translator } = gc;
@ccclass
export class HtmlSiteSprite extends Component {
    @property
    folder = "splash-resources";

    @property
    key = "game_background";

    @property
    extension = "png";

    versionId = 1;

    @property
    localization = false;

    sprite: Sprite = null;

    async onLoad() {
        this.sprite = this.getComponent(Sprite);

        const info = await this.getVersionInfo();
        try {
            if (info && info[this.key]) {
                this.versionId = info[this.key];
            }
            const url = this.getUrl(this.localization, this.versionId);
            const imageAsset = (await FunctionUtils.loadRemote(url)) as ImageAsset;
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprite.spriteFrame = spriteFrameTmp;
            this.sprite.sizeMode = Sprite.SizeMode.RAW;
        } catch (e) {}
    }

    async getVersionInfo() {
        const { origin, pathname } = window.location;
        const url = `${origin}${pathname}${this.folder}/versions.json?v=${Date.now()}`;

        const jsonAsset = (await FunctionUtils.loadRemote(url)) as JsonAsset;
        try {
            if (!isValidNode(this)) {
                return null;
            }
            if (jsonAsset) {
                return jsonAsset.json;
            }
        } catch (e) {
            return null;
        }
    }

    getUrl(localization: boolean, versionImg: number): string {
        const { origin, pathname } = window.location;
        const languageId = localization ? `_${Translator.getCurrentLanguageId()}` : "";
        return `${origin}${pathname}${this.folder}/${this.key}${languageId}.${this.extension}?v=${versionImg}`;
    }
}

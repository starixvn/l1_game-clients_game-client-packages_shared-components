import gc from "@sg/game-client-base";
import { _decorator, Component, ImageAsset, JsonAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import Observer from "observer";
import { FunctionUtils } from "../../../shared/utils";
import { isValidNode } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;
const { render } = Observer;
const { Translator, Auth } = gc;
@ccclass
export class HtmlSiteSprite extends Component {
    @property
    folder = "splash-resources";

    @property
    key = "game_background";

    @property
    extension = "png";

    @property
    localization = false;

    @property
    alwaysShow = true;

    sprite: Sprite = null;

    async onLoad() {
        this.sprite = this.getComponent(Sprite);

        const info = await this.getVersionInfo();
        try {
            const fileName = this.getFileName();
            let versionId = 1;
            if (info && info[fileName]) {
                versionId = info[fileName];
            }
            const url = this.getUrl(fileName, versionId);
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

        try {
            const jsonAsset = (await FunctionUtils.loadRemote(url)) as JsonAsset;
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

    getFileName() {
        const languageId = this.localization ? `_${Translator.getCurrentLanguageId()}` : "";
        return `${this.key}${languageId}`;
    }

    getUrl(fileName: string, versionId: number): string {
        const { origin, pathname } = window.location;
        return `${origin}${pathname}${this.folder}/${fileName}.${this.extension}?v=${versionId}`;
    }

    @render(Auth.AuthStore, (store) => store.ssoErrorMessage)
    renderMessage(message: string) {
        !this.alwaysShow && (this.node.active = message === "");
    }
}

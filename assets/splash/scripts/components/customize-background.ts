import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
import { isValidNode } from "../../../shared/utils/utils";
const { ccclass, property } = _decorator;

@ccclass
export class CustomizeBackground extends Component {
    @property(Sprite)
    sprBackground: Sprite = null;

    @property
    versionImg = 1;
    onLoad() {
        const absolutePath = `${window.location.origin}${window.location.pathname}splash-resources/game_background.png?v=${this.versionImg}`;
        assetManager.loadRemote<ImageAsset>(absolutePath, (err, imageAsset) => {
            if (!isValidNode(this)) {
                return;
            }
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprBackground.spriteFrame = spriteFrameTmp;
            this.sprBackground.sizeMode = Sprite.SizeMode.RAW;
        });
    }
}

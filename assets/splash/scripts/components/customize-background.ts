import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class CustomizeBackground extends Component {
    @property(Sprite)
    sprBackground: Sprite = null;
    onLoad() {
        let absolutePath = `${window.location.href}/splash-resources/game_background.png`;
        console.log("absolutePath", absolutePath);
        assetManager.loadRemote<ImageAsset>(absolutePath, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprBackground.spriteFrame = spriteFrameTmp;
        });
    }
}

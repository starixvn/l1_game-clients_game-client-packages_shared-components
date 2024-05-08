import { _decorator, assetManager, Component, ImageAsset, Sprite, SpriteFrame, Texture2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class CustomizeBackground extends Component {
    @property(Sprite)
    sprBackground: Sprite = null;
    onLoad() {
        // let absolutePath = gc.UrlUtils.buildServerUrl("http", "/splash-resources/game_background.png", 78, siteConfigs);
        console.log("window", window.location);
        const absolutePath = "https://l1-proxy1.lumigame.com/site-78/splash-resources/game_background.png";
        assetManager.loadRemote<ImageAsset>(absolutePath, (err, imageAsset) => {
            const spriteFrameTmp = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrameTmp.texture = texture;
            this.sprBackground.spriteFrame = spriteFrameTmp;
        });
    }
}

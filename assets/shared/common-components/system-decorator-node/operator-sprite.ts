import { _decorator, Component, Sprite, SpriteFrame } from "cc";
import { OperatorUtils } from "db://shared-components/shared/utils/operator-utils";
import { bundleManager } from "../bundle-manager/bundle-manager";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent(Sprite)
export class OperatorSprite extends Component {
    @property
    bundleName = "resources";

    @property
    folderPath = "images"

    @property
    prefix = "";

    sprite: Sprite = null;

    onLoad() {
        this.sprite = this.getComponent(Sprite);
        this.loadSpriteFrame();
    }

    private async loadSpriteFrame() {
        try {
            const operator = OperatorUtils.getOperatorLowerCase();
            const fileName = `${this.folderPath}/${this.prefix}-${operator}/spriteFrame`;
            const spriteFrame = await bundleManager.loadAssetsFromBundle<SpriteFrame>(this.bundleName, fileName, SpriteFrame, null);
            this.sprite.spriteFrame = spriteFrame;
        } catch (e) { }
    }
}

import { CCString, Component, Enum, Sprite, SpriteAtlas, _decorator } from "cc";

const { ccclass, property } = _decorator;

enum DerivedType {
    BigEyeBoy,
    Smallroad,
    Cockroach,
}

@ccclass
export class PredictionItemSprite {
    @property({ type: Enum(DerivedType) })
    type: number = DerivedType.BigEyeBoy;

    @property({ type: CCString })
    names = [];
}

@ccclass
export class ScoreboardPredictionItem extends Component {
    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;
    sprites: Sprite[] = [];

    @property({ type: PredictionItemSprite })
    spriteDict: PredictionItemSprite[] = [];

    onLoad() {
        this.sprites = this.getComponentsInChildren(Sprite);
    }

    setData(data: boolean[], invert: boolean) {
        this.sprites.forEach((sprite, index) => {
            if (data[index] !== undefined) {
                const dataItem = invert ? !data[index] : data[index];
                sprite.spriteFrame = this.getSpriteFrame(dataItem, index);
                sprite.node.active = true;
            } else {
                sprite.node.active = false;
            }
        });
    }

    protected getSpriteFrame(value: boolean, type: number) {
        const dict = this.spriteDict.find((dict) => dict.type === type);
        const name = dict.names[value ? 0 : 1];
        return this.atlas.getSpriteFrame(name);
    }
}

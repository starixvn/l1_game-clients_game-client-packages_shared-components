import { _decorator, CCInteger, Color, Node, Sprite, SpriteFrame, UISkew } from "cc";
import Chip, { ChipDisplayType } from "./chip";
const { ccclass, property } = _decorator;

@ccclass("NewChip")
export class NewChip extends Chip {
    @property({ type: Sprite, visible: false, override: true })
    border: Sprite = null;

    @property({ type: SpriteFrame, visible: false, override: true })
    centerFrames: SpriteFrame[] = [];

    @property({ type: SpriteFrame, visible: false, override: true })
    borderFrames: SpriteFrame[] = [];

    @property({ type: Node, visible: false, override: true })
    typeNodes: Node[] = [];

    @property(Node)
    firstChipShadow: Node = null;

    private _rotation = 0;

    @property(CCInteger)
    public get rotation(): number {
        return this._rotation;
    }

    public set rotation(value: number) {
        this._rotation = value;
        this.updateRotation();
    }

    private _scaleX = 1;

    @property(CCInteger)
    public get scaleX(): number {
        return this._scaleX;
    }

    public set scaleX(value: number) {
        this._scaleX = value;
        this.updateScaleX();
    }

    private _scaleY = 1;

    @property(CCInteger)
    public get scaleY(): number {
        return this._scaleY;
    }

    public set scaleY(value: number) {
        this._scaleY = value;
        this.updateScaleY();
    }

    private _skewY = 0;

    @property(CCInteger)
    public get skewY(): number {
        return this._skewY;
    }

    public set skewY(value: number) {
        this._skewY = value;
        this.updateSkewY();
    }

    private _rotationNode = 0;

    @property(CCInteger)
    public get rotationNode(): number {
        return this._rotationNode;
    }

    public set rotationNode(value: number) {
        this._rotationNode = value;
        this.updateRotationNode();
    }

    setType(type: ChipDisplayType) {
        this._type = type;
    }

    protected updateRotation(): void {
        this.background.angle = -this.rotation;
        this.center.node.angle = -this.rotation;
    }

    protected updateScaleX(): void {
        this.background.setScale(this.scaleX, this.background.scale.y, this.background.scale.z);
        this.center.node.setScale(this.scaleX, this.center.node.scale.y, this.center.node.scale.z);
    }

    protected updateScaleY(): void {
        this.background.setScale(this.background.scale.x, this.scaleY, this.background.scale.z);
        this.center.node.setScale(this.center.node.scale.x, this.scaleY, this.center.node.scale.z);
    }

    protected updateSkewY(): void {
        const backgroundSkew = this.background.getComponent(UISkew);
        backgroundSkew.setSkew(backgroundSkew.skew.x, this.skewY);
        const centerSkew = this.center.node.getComponent(UISkew);
        centerSkew.setSkew(centerSkew.skew.x, this.skewY);
    }

    protected updateRotationNode() {
        this.node.angle = this.rotationNode;
    }

    initChipValue(angle, scaleX, scaleY, offset) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = angle;
        this.center.node.y = offset;
    }

    setColor(color: Color) {
        super.setColor(color);
        this.center.color = color;
    }
}

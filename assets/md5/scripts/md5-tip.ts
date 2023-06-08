import { Component, _decorator, Label, Enum, RichText } from "cc";
const { ccclass, property} = _decorator;

export enum ResultTipType {
    Label = 0,
    RichText
}
@ccclass
export default class MD5Tip extends Component {
    @property(Label)
    roundId: Label = null;

    @property({ type: Enum(ResultTipType) })
    md5type = ResultTipType.Label;

    @property({
        type: Label,
        visible: function () {
            return this.md5type === ResultTipType.Label;
        }
    })
    result: Label = null;

    @property({
        type: RichText,
        visible: function () {
            return this.md5type === ResultTipType.RichText;
        }
    })
    resultRichText: RichText = null;

    public setData(data = "") {
        this.result && (this.result.string = `${data}`);
        this.resultRichText && (this.resultRichText.string = `${data}`);
    }

    public show(show = true) {
        this.node.active = show;
    }
}

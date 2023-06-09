import { _decorator, Component, Node, Label, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PaginationItem")
export default class PaginationItem extends Component {
    @property(Node)
    bgSelect: Node = null;

    @property(Node)
    bg: Node = null;

    @property(Label)
    number: Label = null;

    textHighlightColor = Color.BLACK;

    textNormalColor = Color.WHITE;

    updateHighlight(highlight: boolean) {
        this.number.color = highlight ? this.textHighlightColor : this.textNormalColor;
        this.bg.active = !highlight;
        this.bgSelect.active = highlight;
    }
}

import { _decorator, Component, Node, Label, EventHandler, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PaginationItem")
export default class PaginationItem extends Component {
    @property(Node)
    nodeBackgroundSelect: Node = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblNumber: Label = null;

    @property(Color)
    textHighlightColor: Color = new Color();

    @property(Color)
    textNormalColor: Color = new Color();

    clickEventHandler = new EventHandler();

    updateHighlight(highlight: boolean, pageNumber: number) {
        this.lblNumber.string = pageNumber.toString();
        this.lblNumber.color = highlight ? this.textHighlightColor : this.textNormalColor;
        this.nodeBackground.active = !highlight;
        this.nodeBackgroundSelect.active = highlight;

        this.clickEventHandler.target = this.node;
        this.clickEventHandler.customEventData = pageNumber.toString();
    }
}

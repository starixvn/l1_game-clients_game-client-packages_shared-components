import { Component, _decorator, Node, Label, Button, Layout, UITransform  } from "cc";
const { ccclass, property} = _decorator;


@ccclass
export default class MD5Frame extends Component {
    @property(Label)
    md5Label: Label = null;

    @property(Button)
    md5CopyBtn: Button = null;

    @property(Node)
    md5HintCopy: Node = null;

    @property(Node)
    md5Node: Node = null;

    public clickCopyButton = () => {};

    layoutNode: Layout;

    onClickCopyButton() {
        this.clickCopyButton();
    }

    onLoad() {
        this.layoutNode = this.node.getComponent(Layout);
    }

    updateLayout(width: number) {
        const uiTransform = this.md5Node.getComponent(UITransform);
        uiTransform.width = width;
        
        this.layoutNode.updateLayout();
    }
}

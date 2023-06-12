import { Component, _decorator, Node, Label, Button, Layout, UITransform  } from "cc";
const { ccclass, property} = _decorator;


@ccclass
export default class MD5Frame extends Component {
    @property(Label)
    lblMd5: Label = null;

    @property(Button)
    btnMd5Copy: Button = null;

    @property(Node)
    nodeMd5Hint: Node = null;

    @property(Node)
    nodeMd5: Node = null;

    public clickCopyButton = () => {};

    layoutNode: Layout;

    onClickCopyButton() {
        this.clickCopyButton();
    }

    onLoad() {
        this.layoutNode = this.node.getComponent(Layout);
    }

    updateLayout(width: number) {
        const uiTransform = this.nodeMd5.getComponent(UITransform);
        uiTransform.width = width;
        
        const layoutNode = this.node.getComponent(Layout);
        layoutNode.updateLayout();
    }
}

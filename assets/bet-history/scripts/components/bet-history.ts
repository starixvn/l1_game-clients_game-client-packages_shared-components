import { _decorator, Component, Node, Label, Layout } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BetHistory")
export class BetHistory extends Component {
    @property(Node)
    closeBtn: Node | null = null;

    @property(Node)
    backWrapper: Node | null = null;

    @property(Node)
    mainFrame: Node | null = null;

    @property(Label)
    gameName: Label | null = null;

    @property(Node)
    titleBgNode: Node | null = null;

    @property(Layout)
    title: Layout | null = null;

    private backFrameLayout: Layout;

    public clickCloseButton = () => {};

    isShowTitleBetDetail: boolean;

    protected PADDING_AROUND_POPUP = 80;

    start() {}

    update(deltaTime: number) {}

    updateTitleSize(width: number) {}
    closePopup() {}
}

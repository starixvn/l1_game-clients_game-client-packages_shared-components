import { _decorator, Button, color, Component, Label, LabelShadow, Node } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import { settings } from "../../../../../../assets/game/scripts/game-settings";

const { handle, observer } = Observer;
const { App } = gc;
const { property, ccclass } = _decorator;

@ccclass("PromotionItem")
@observer(settings.name)
export default class PromotionItem extends Component {
    @property(Label)
    title: Label | null = null;

    @property(Label)
    message: Label | null = null;

    @property(Button)
    joinButton: Button | null = null;

    @property(Node)
    bgDisable: Node | null = null;

    @property(Node)
    content: Node | null = null;

    setData(data: gc.Notification.PromotionModel) {
        this.title.string = data.title["en-US"]; //NoticeUtil.getMessageByLocale(data.title);
        this.title.node.getComponent(LabelShadow).enabled = true;
        this.message.string = data.messages["en-US"]; // NoticeUtil.getMessageByLocale(data.messages);

        this.joinButton.interactable = data.isActive;
        this.bgDisable.active = !data.isActive;

        const text = this.joinButton.node.getChildByName("text");
        text.getComponent(Label).color = data.isActive ? color(209, 42, 33) : color(83, 78, 78);
        this.joinButton.node.on("click", this.onClickJoinGame.bind(this, data.gameId));
    }

    @handle(App.AppHandlers.BackToOperatorLobby, (handler, gameId: number) => {
        handler.handleOpenGame(gameId);
    })
    onClickJoinGame(gameId: number) {
        return gameId;
    }

    getGameId(gameId: number) {}
}

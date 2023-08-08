import { _decorator, Button, color, Component, Label, LabelShadow, Node } from "cc";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";

const { property, ccclass } = _decorator;

// export class PromotionModelTest {
//     _id: string;
//     time: string;
//     message: string;
//     gameName: string;
//     messages: object;
//     title: object;
//     startTime: string;
//     endTime: string;
//     promotionId: string;
//     enabled: boolean;
//     gameId: number;
//     isActive: boolean;
//     displayKind: number;
// }

@ccclass("PromotionItem")
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

    setData(data: gc.BoostedOdds.PromotionModel) {
        this.title.string = data.title["en-US"]; //NoticeUtil.getMessageByLocale(data.title);
        this.title.node.getComponent(LabelShadow).enabled = true;
        this.message.string = data.messages["en-US"]; // NoticeUtil.getMessageByLocale(data.messages);

        this.joinButton.interactable = data.isActive;
        this.bgDisable.active = !data.isActive;

        const text = this.joinButton.node.getChildByName("text");
        text.getComponent(Label).color = data.isActive ? color(209, 42, 33) : color(83, 78, 78);
        this.joinButton.node.on("click", this.onClickJoinGame.bind(this, data.gameId));
    }

    onClickJoinGame(gameId: number) {}

    getGameId(gameId: number) {}
}

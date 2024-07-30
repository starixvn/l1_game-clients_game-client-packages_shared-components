import { _decorator, Component, Label, sp, UIOpacity } from "cc";
import { AnimationUtils, FunctionUtils } from "../../shared/utils";
import { PokerCard, ServiceCard } from "./../../game/poker-cards/scripts/poker-card";
const { ccclass, property } = _decorator;
@ccclass
export class MultiplierCard extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    @property(PokerCard)
    card: PokerCard = null;

    @property(sp.Skeleton)
    spineTransformCard: sp.Skeleton = null;

    data: ServiceCard;

    setData(data: { item: ServiceCard; value: number }) {
        this.data = data.item;
        this.lblMultiplier.string = `${data.value}x`;
        this.card.setServiceCard(this.data);
        this.card.faceUp();
    }

    async playAnimCard() {
        this.node.getComponent(UIOpacity).opacity = 0;
        await AnimationUtils.fadeIn(this.node, 0.26).then(async () => {
            this.spineTransformCard.node.active = true;

            AnimationUtils.playSpine(this.spineTransformCard, "luckycard", false).then(() => {
                this.spineTransformCard.node.active = false;
            });
            await FunctionUtils.delay(100);
            this.card.setGoldenCard(true, false);
        });
    }
}

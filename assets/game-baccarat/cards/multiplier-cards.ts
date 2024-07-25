import gc from "@sg/game-client-base";
import { Label, Node, Prefab, UIOpacity, _decorator, instantiate, tween, v3 } from "cc";
import Observer from "observer";
import { ServiceCard } from "../../game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "../../shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../shared/utils";
import { MultiplierCard } from "./multiplier-card";
const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { GameBaccaratX, Rounds, FormatUtils } = gc;

@ccclass
export class MultiplierCards extends ObserverComponent {
    @property(Prefab)
    prfMultiplierCard: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Label)
    lblRangeBetLimit: Label = null;

    @property(Label)
    lblExtraFee: Label = null;

    private minBet = 0;
    private maxBet = 0;

    private multiplierCards: MultiplierCard[] = [];

    findMatchedCard(card: ServiceCard, testIndex = -1): MultiplierCard {
        if (testIndex > -1) {
            return this.multiplierCards[testIndex % this.multiplierCards.length];
        }
        return this.multiplierCards.find((comp) => comp.data.rank === card.rank && comp.data.suit === card.suit);
    }

    @render(gc.MultipliersStore, (store) => store.renderMultipliers)
    async renderMultipliers(renderMultipliers: { animated: boolean; multipliers: any[] }) {
        if (!renderMultipliers) {
            this.hideCards();
            return;
        }

        const { animated, multipliers } = renderMultipliers;

        this.content.destroyAllChildren();

        const labelContainer = new Node("label-container");
        this.node.addChild(labelContainer);
        this.multiplierCards = [];
        for (let i = 0; i < multipliers.length; i++) {
            const item = multipliers[i];
            const node = instantiate(this.prfMultiplierCard);
            this.content.addChild(node);
            const comp = node.getComponent(MultiplierCard);
            comp.setData(item);
            if (animated) {
                await this.moveCardAnimation(node, i, animated);
            } else {
                this.moveCardAnimation(node, i, false);
            }
            this.optimizedDrawCall(comp.lblMultiplier.node, labelContainer);
            this.multiplierCards.push(comp);
        }

        ComponentUtils.moveToOtherNode(labelContainer, this.content);
    }

    private optimizedDrawCall(labelNode: Node, labelContainer: Node) {
        ComponentUtils.moveToOtherNode(labelNode, labelContainer);
    }

    hideCards() {
        this.content.destroyAllChildren();

        this.multiplierCards = [];
    }

    showMultiplierCards(isShow: boolean) {
        this.content.active = isShow;
    }

    @render(Rounds.RoundStore, (store) => store.minBet)
    renderMinBet(minBet: number) {
        this.minBet = minBet;
        this.renderRangeBetLimit();
    }

    @render(Rounds.RoundStore, (store) => store.maxBet)
    renderMaxBet(maxBet: number) {
        this.maxBet = maxBet;
        this.renderRangeBetLimit();
    }

    renderRangeBetLimit() {
        this.lblRangeBetLimit.string = `${FormatUtils.numberWithCommas(this.minBet, 2)} - ${FormatUtils.numberWithCommas(this.maxBet, 2)}`;
    }

    @render(GameBaccaratX.ExtraFee.ExtraFeeStore, (store) => store.extraFee)
    renderExtraFee(extraFee: any) {
        if (extraFee) {
            const fee = extraFee.fee;
            const extraFeeString = extraFee.isRatio ? `${fee * 100}%` : `${FormatUtils.numberWithCommas(fee, 2)}`;
            this.lblExtraFee.string = extraFeeString;
        }
    }

    async moveCardAnimation(node: Node, index: number, animated: boolean) {
        const cardWidth = 52;
        const origin = index * cardWidth;

        if (!animated) {
            node.position = v3(origin, node.position.y, 0);
            return;
        }
        const opacityNode = node.getComponent(UIOpacity);
        opacityNode.opacity = 0;
        node.setPosition(origin + cardWidth / 2, node.position.y, 0);
        const duration = 0.15;

        return new Promise((resolve) => {
            tween(opacityNode)
                .to(0, {
                    opacity: 50,
                })
                .to(duration, {
                    opacity: 255,
                })
                .start();
            tween(node)
                .to(duration, { position: v3(origin, node.position.y, 0) }, { easing: "sineInOut" })
                .call(resolve)
                .start();
        });
    }
}

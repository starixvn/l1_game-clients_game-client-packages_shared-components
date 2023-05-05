import { _decorator, Color, Component, Label, Node, tween, UIRenderer, v3 } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { Rounds } = gc;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass()
export default class TwoDigitsTimer extends Component {
    @property(Label)
    lblDigitFirst: Label = null;

    @property(Label)
    lblDigitSecond: Label = null;

    @property
    heightOffset: number = 0;

    @property
    animated = true;

    protected readonly lockingColor: Color = Color.RED;
    protected readonly normalColor: Color = Color.WHITE;

    setTime(time: number) {
        const text = `${time}`.padStart(2, "0");
        const firstChar = text.slice(0, 1);
        const secondChar = text.slice(1, 2);

        if (this.lblDigitFirst.string !== firstChar) {
            this.handleBetTimeAnimation(this.lblDigitFirst.node);
        }

        if (this.lblDigitSecond.string !== secondChar) {
            this.handleBetTimeAnimation(this.lblDigitSecond.node);
        }

        this.lblDigitFirst.string = firstChar;
        this.lblDigitSecond.string = secondChar;
    }

    protected setColor(color: Color) {
        this.lblDigitFirst.getComponent(UIRenderer).color = color;
        this.lblDigitSecond.getComponent(UIRenderer).color = color;
    }

    protected handleBetTimeAnimation(node: Node) {
        if (this.animated) {
            tween(node)
                .to(0, {
                    position: v3(node.position.x, this.heightOffset),
                })
                .to(0.3, {
                    position: v3(node.position.x, 0),
                })
                .start();
        }
    }
    setState(state: string) {
        switch (state) {
            case Rounds.ROUND_STATE.BEGIN_LOCKING_BET:
            case Rounds.ROUND_STATE.LOCKING_BET:
                this.setColor(this.lockingColor);
                break;
            default:
                this.setColor(this.normalColor);
                break;
        }
    }
}

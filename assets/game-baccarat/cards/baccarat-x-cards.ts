import { Component, Label, Node, Prefab, _decorator } from "cc";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BaccaratXCards extends Component {
    @property(Prefab)
    prfCard: Prefab = null;

    @property(Node)
    cardContainer: Node = null;

    @property(Label)
    lblScore: Label = null;

    protected onLoad(): void {
        this.cardContainer.children.forEach((node) => node.children.forEach((child) => (child.active = false)));
    }

    getCardLocation(index: number) {
        return this.cardContainer.children[index];
    }

    setScore(score: number) {
        this.showScore(true);
        this.lblScore.string = score.toString();
    }

    showScore(isShow: boolean) {
        this.lblScore.node.parent.active = isShow;
    }
}

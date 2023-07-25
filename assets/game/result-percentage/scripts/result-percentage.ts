import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
const { ccclass, property } = _decorator;
const { render } = Observer;
@ccclass
export class ResultPercentage extends ObserverComponent {
    @property
    autoFindLabels = false;

    @property({
        type: Label,
        visible: function () {
            return !this.autoFindLabels;
        },
    })
    labels: Label[] = [];

    @property({
        type: Node,
        visible: function () {
            return this.autoFindLabels;
        },
    })
    labelContainer: Node = null;

    @property
    supportChoices = "dragon,tiger,tie";

    @property
    enablePercentage = true;

    originalChoices: string[] = [];
    onLoad() {
        super.onLoad();
        this.generateOriginalChoices();
        if (this.autoFindLabels && this.labelContainer) {
            this.labelContainer.children.forEach((child) => {
                const label = child.getComponent(Label);
                if (label) {
                    this.labels.push(label);
                }
            });
        }
    }

    generateOriginalChoices() {
        this.originalChoices = this.supportChoices.split(",");
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    render(histories: gc.RoundHistories.RoundHistory[]) {
        if (this.enablePercentage) {
            this.handlePercentageChoice(histories);
        } else {
            this.handleOccurrenceChoice(histories);
        }
    }

    handlePercentageChoice(histories: gc.RoundHistories.RoundHistory[]) {
        const percentage = this.calculateWinPercentage(this.originalChoices, histories);
        this.labels.forEach((label) => {
            const choice = label.node.name;
            percentage[choice] !== undefined && (label.string = `${percentage[choice]}%`);
        });
    }

    calculateWinPercentage(originalChoices: string[], roundHistory: any) {
        const count = this.calculateWin(originalChoices, roundHistory);

        const choices = [...originalChoices].sort((a, b) => count[a] - count[b]);

        let total = 0;
        const percentage = {};
        choices.forEach((choice, index) => {
            const rawValue = (count[choice] * 100) / roundHistory.length;
            const value = index === 0 ? Math.ceil(rawValue) : Math.floor(rawValue);
            percentage[choice] = `${value}`;
            if (index === choices.length - 1) {
                percentage[choice] = `${100 - total}`;
            }

            total += value;
        });

        return percentage;
    }

    calculateWin(originalChoices: string[], roundHistory: any) {
        return roundHistory.reduce((count: any, history) => {
            originalChoices.forEach((choice) => {
                count[choice] = count[choice] ?? 0;
                if (history.settlementResult[choice]) {
                    count[choice] = count[choice] + 1;
                }
            });
            return count;
        }, {});
    }

    handleOccurrenceChoice(histories: gc.RoundHistories.RoundHistory[]) {
        const countChoices = this.calculateWin(this.originalChoices, histories);
        this.labels.forEach((label) => {
            const choice = label.node.name;
            countChoices[choice] !== undefined && (label.string = countChoices[choice]);
        });
    }
}

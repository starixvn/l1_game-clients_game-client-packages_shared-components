import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { ComponentUtils } from "../../../shared/utils";
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

    @property
    showSignPercentage = true;

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
        ComponentUtils.setEmptyLabels(this.labels);
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
            label.string = `${percentage[choice] || 0}${this.showSignPercentage ? "%" : ""}`;
        });
    }

    calculateWinPercentage(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]) {
        const count = this.calculateWin(originalChoices, roundHistory);

        const choices = [...originalChoices].sort((a, b) => count[a] - count[b]);

        let total = 0;
        const percentage = {};
        choices.forEach((choice, index) => {
            if (count[choice]) {
                const rawValue = (count[choice] * 100) / roundHistory.length;
                const value = index === 0 ? Math.ceil(rawValue) : Math.floor(rawValue);
                percentage[choice] = `${value}`;
                if (index === choices.length - 1) {
                    percentage[choice] = `${100 - total}`;
                }

                total += value;
            }
        });

        return percentage;
    }

    calculateWin(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]) {
        return roundHistory.reduce((count: Record<string, number>, history) => {
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
            countChoices[choice] !== undefined && (label.string = countChoices[choice].toString());
        });
    }
}

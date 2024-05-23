import { Component, _decorator } from "cc";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { ScoreboardDataConverter } from "./scoreboard-converter";
import { DerivedScoreboardKey, ScoreboardDerivedAlgorithm } from "./scoreboard-derived-algorithm";
import { ScoreboardGridItem } from "./scoreboard-grid-item";

const { ccclass, property, requireComponent } = _decorator;

@ccclass
@requireComponent([ScoreboardDataConverter, ScoreboardDerivedAlgorithm])
export class ScoreboardDerived extends Component {
    @property(ScoreboardDataConverter)
    converter: ScoreboardDataConverter = null;

    @property(ScoreboardDerivedAlgorithm)
    algorithm: ScoreboardDerivedAlgorithm = null;

    @property({ type: GridLayout })
    protected grids: GridLayout[] = [];

    onFocusInEditor(): void {
        this.grids = this.node.getComponentsInChildren(GridLayout);
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.algorithm = this.node.getComponent(ScoreboardDerivedAlgorithm);
    }

    public render<T>(rounds: T[]) {
        const hasBlinkNode = rounds[rounds.length - 1]["settlementResult"]["blink"];
        const roundArray = [...rounds];
        if (hasBlinkNode) {
            roundArray.pop;
        }
        const converted = this.converter.convert(roundArray);
        this.algorithm.apply(converted);

        this.grids.forEach((grid) => {
            const derivedData = this.algorithm.getDerivedData(grid.node.name as DerivedScoreboardKey);
            if (hasBlinkNode && derivedData.length > 0) {
                let lastIndex = 0;
                let newColumn = false;
                for (let i = derivedData.length - 1; i > 0; i--) {
                    if (derivedData[i].status !== undefined) {
                        lastIndex = i;
                        newColumn = derivedData[i].row === grid.settings.row - 1;
                        break;
                    }
                }

                if (newColumn) {
                    const lastPoint = { ...derivedData[derivedData.length - 1] };
                    lastPoint["data"] = {
                        blink: true,
                    };

                    const newArray = [...derivedData, lastPoint];
                    const countBlink = newArray.reduce((prev, current, index) => {
                        if (newArray[index]?.data?.blink) {
                            return prev + 1;
                        }
                        return prev;
                    }, 0);
                    console.log("blink count is ", countBlink);
                    grid.render(ScoreboardGridItem, newArray);
                } else {
                    const nextPoint = derivedData[lastIndex + 1];
                    nextPoint["data"] = {
                        blink: true,
                    };

                    const countBlink = derivedData.reduce((prev, current, index) => {
                        if (derivedData[index]?.data?.blink) {
                            return prev + 1;
                        }
                        return prev;
                    }, 0);
                    console.log("blink count is ", countBlink);
                    grid.render(ScoreboardGridItem, derivedData);
                }
            } else {
                grid.render(ScoreboardGridItem, derivedData);
            }
        });
    }
}

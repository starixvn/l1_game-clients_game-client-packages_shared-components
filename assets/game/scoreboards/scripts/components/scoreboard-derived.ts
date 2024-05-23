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

    public render<T>(rounds: T[], hasBlinkNode = false) {
        const converted = this.converter.convert(rounds);
        this.algorithm.apply(converted, hasBlinkNode);

        this.grids.forEach((grid) => {
            const derivedData = this.algorithm.getDerivedData(grid.node.name as DerivedScoreboardKey);
            grid.render(ScoreboardGridItem, derivedData);
        });
    }
}

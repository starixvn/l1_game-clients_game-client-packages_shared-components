import type { BigRoadScoreboard } from "sc-scoreboards";

import { _decorator } from "cc";
import SCScoreboard from "sc-scoreboards";
import { GridLayout } from "../../../../shared/common-components/grid-layout/scripts/components/grid-layout";
import { addEmptyPoints, getColumns } from "../helpers/scoreboard-big-road-helper";
import { ScoreboardAlgorithm } from "./scoreboard-algorithm";
import { ScoreboardDataConverter } from "./scoreboard-converter";

const { ccclass, property, requireComponent } = _decorator;
const { Converter, BigRoadScoreboard: BigRoad } = SCScoreboard;

type ConverterOptions = {
    keyOfA: string;
    tieKey: string;
};

export class BigRoadConverter extends Converter<unknown> {
    constructor(protected readonly options: ConverterOptions) {
        super();
    }

    protected positiveKey() {
        return this.options.keyOfA;
    }

    protected specialKey(): string {
        return this.options.tieKey;
    }
}

@ccclass
@requireComponent(ScoreboardDataConverter)
export class ScoreboardBigRoadAlgorithm extends ScoreboardAlgorithm {
    @property(ScoreboardDataConverter)
    protected converter: ScoreboardDataConverter = null;

    @property(GridLayout)
    protected grid: GridLayout = null;

    private _bigRoad: BigRoadScoreboard<unknown>;

    private get bigRoad() {
        if (!this._bigRoad) {
            this._bigRoad = new BigRoad({
                converter: new BigRoadConverter(this.converter),
                height: this.grid.settings.row,
            });
        }

        return this._bigRoad;
    }

    apply(data: unknown[]) {
        this.bigRoad.initialize(data);

        const points = getColumns(this.bigRoad);
        const maximumPoints = this.grid.settings.row * this.grid.settings.column;

        addEmptyPoints(points, maximumPoints);

        return points;
    }

    onFocusInEditor(): void {
        this.converter = this.node.getComponent(ScoreboardDataConverter);
        this.grid = this.node.getComponent(GridLayout);
    }
}

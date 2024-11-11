import inversify from "inversify";
import mobx from "mobx";
import SCScoreboard from "sc-scoreboards";
import {
    ONE_LOUNGE_2_ROOMS_BANKER,
    ONE_LOUNGE_2_ROOMS_PLAYER,
    PATTED_EAT_BANKER,
    PATTED_EAT_PLAYER,
    PING_PONG_BANKER,
    PING_PONG_PLAYER,
    STREAK_BANKER,
    STREAK_PLAYER,
} from "../../../../game/scoreboards/scripts/components/baccarat/big-road/baccarat-big-road-good-road-patterns";
const {} = SCScoreboard;
const { injectable, inject } = inversify;

@injectable()
export class GoodRoadStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    patterns: SCScoreboard.ColumnLengthPattern[] = [];

    counter = 0;
    goodRoads = [];

    private readonly config = [
        { key: "streak_banker", pattern: STREAK_BANKER },
        { key: "streak_player", pattern: STREAK_PLAYER },

        { key: "ping_pong_banker", pattern: PING_PONG_BANKER },
        { key: "ping_pong_player", pattern: PING_PONG_PLAYER },

        { key: "patted_eat_banker", pattern: PATTED_EAT_BANKER },
        { key: "patted_eat_player", pattern: PATTED_EAT_PLAYER },

        { key: "one_lounge_two_bedrooms_banker", pattern: ONE_LOUNGE_2_ROOMS_BANKER },
        { key: "one_lounge_two_bedrooms_player", pattern: ONE_LOUNGE_2_ROOMS_PLAYER },
    ];

    selectedFlag = {};

    updateSelectedPatterns(selectedFlag: { [key: string]: boolean }) {
        this.selectedFlag = selectedFlag;
        this.updatePatterns();
    }

    updatePatterns() {
        this.patterns = Object.keys(this.selectedFlag)
            .filter((key) => this.selectedFlag[key])
            .map((key) => this.config.find((c) => key === c.key)?.pattern)
            .filter((pattern) => !!pattern);
    }

    setCounter(counter: number) {
        if (counter !== this.counter) {
            this.counter = counter;
        }
    }

    updateGoodRoadGames(goodRoads: number[]) {
        if (this.goodRoads.length !== goodRoads.length || goodRoads.some((id) => !this.goodRoads.includes(id))) {
            this.goodRoads = goodRoads;
            this.setCounter(this.goodRoads.length);
        }
    }
}

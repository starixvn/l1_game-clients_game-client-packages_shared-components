import SCScoreboard from "sc-scoreboards";

const {
    Converter,
    BigRoadScoreboard: BigRoad,
    ADJACENT_TWO_COLUMNS,
    CHASE,
    GoodRoadColumnLengthDetectorDetector,
    LONG_ROAD,
    ONE_HOME_TWO_ROOMS,
    PBHOP,
    SEPARATED,
    buildPattern,
} = SCScoreboard;

const PositiveBanker = true;
const PositivePlayer = false;

export const STREAK_BANKER = buildPattern(LONG_ROAD, PositiveBanker);
export const PING_PONG_BANKER = buildPattern(CHASE, PositiveBanker);
export const STREAK_PLAYER = buildPattern(LONG_ROAD, PositivePlayer);
export const PING_PONG_PLAYER = buildPattern(CHASE, PositivePlayer);

export const PATTED_EAT_BANKER = {
    name: "Patted Eat Banker",
    columns: [
        { exact: true, length: 2 },
        { exact: true, length: 2 },
        { exact: true, length: 2 },
        { exact: true, length: 2 },
    ],
    repeat: 0,
    positive: PositiveBanker,
};

export const PATTED_EAT_PLAYER = {
    ...PATTED_EAT_BANKER,
    name: "Patted Eat Player",
    positive: PositivePlayer,
};

export const ONE_LOUNGE_2_ROOMS_BANKER = {
    name: "One Lounge 2 Bedroom Banker",
    columns: [
        { exact: true, length: 1 },
        { exact: true, length: 2 },
        { exact: true, length: 1 },
        { exact: true, length: 2 },
    ],
    repeat: 0,
    positive: PositiveBanker,
};

export const ONE_LOUNGE_2_ROOMS_PLAYER = {
    ...ONE_LOUNGE_2_ROOMS_BANKER,
    name: "One Lounge 2 Bedroom Player",
    positive: PositivePlayer,
};

export const DEFAULT_PATTERNS = [
    STREAK_BANKER,
    STREAK_PLAYER,
    PING_PONG_BANKER,
    PING_PONG_PLAYER,
    PATTED_EAT_BANKER,
    PATTED_EAT_PLAYER,
    ONE_LOUNGE_2_ROOMS_BANKER,
    ONE_LOUNGE_2_ROOMS_PLAYER,
];

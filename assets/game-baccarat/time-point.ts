export const getTimePointCutCards = (wholeShoe: number) => {
    const NewShoeDuration = 20;
    const OffsetNewShoeDuration = 2;

    return wholeShoe - NewShoeDuration - OffsetNewShoeDuration;
};

export const getTimePointBurnCards = (wholeShoe: number) => {
    const CutCardAnimationDuration = 5;
    return getTimePointCutCards(wholeShoe) - CutCardAnimationDuration;
};

import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;
@injectable()
export class BetHistoryCacheStore {
    @inject(gc.BetHistory.BetHistoryStore) protected readonly betHistoryStore: gc.BetHistory.BetHistoryStore;
    @inject(gc.BetHistory.BetDetailHistoryStore)
    protected readonly betDetailHistoryStore: gc.BetHistory.BetDetailHistoryStore;
    @inject(gc.BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler) betHistoryCallServiceHandler: gc.BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler;
    constructor() {
        mobx.makeAutoObservable(this);

        setTimeout(() => {
            mobx.reaction(
                () => this.betHistoryStore.betHistoryModel,
                (betHistoryModel) => {
                    betHistoryModel && this.handleCacheBetHistory(betHistoryModel);
                }
            );
        }, 10);
    }

    currentPage = -1;
    totalPage = -1;
    betLogs: { [page: number]: any[] } = {};

    get currentDetailId() {
        return this.betDetailHistoryStore?.model?.betHistoryLog?.id ?? -1;
    }

    handleCacheBetHistory(betHistoryModel: gc.BetHistory.BetHistoryModel) {
        this.currentPage = betHistoryModel.page;
        this.totalPage = betHistoryModel.total;
        const betLogs = [...this.betLogs[this.currentPage] ?? [], ...betHistoryModel.betLogs];

        const filterBetLogs = betLogs.filter((log, index, array) =>
            array.findIndex(item => item.id === log.id) === index
        );

        filterBetLogs.sort((a, b) => b.id - a.id); //descending order
        this.betLogs[this.currentPage] = filterBetLogs;
    }

    isNewRound() {
        return this.currentPage === 1 && this.betLogs[this.currentPage]?.findIndex(log => log.id === this.currentDetailId) === 0;
    }

    requestDetail(isNext: boolean) {
        const currentId = this.currentDetailId;
        const page = +Object.keys(this.betLogs).find(page => this.betLogs[page].find(log => log.id === currentId));
        const index = this.betLogs[page].findIndex(log => log.id === currentId);

        const isNewest = index === 0;
        const isOldest = index === this.betLogs[page].length - 1;

        let data = null;
        if (isNext) {
            data = this.handleNext(isNewest, page, data, index);
        } else {
            data = this.handlePrevious(isOldest, page, data, index);
        }


        if (data) {
            this.betDetailHistoryStore.setData(data);
        }
    }

    private handlePrevious(isOldest: boolean, page: number, data: any, index: number) {
        if (isOldest) {
            if (page === this.totalPage) {
                console.log("isOldest");
            } else {
                const nextPage = page + 1;
                if (this.betLogs[nextPage]) {
                    data = this.betLogs[nextPage][0];
                } else {
                    this.requestPage(nextPage);
                }
            }
        } else {
            data = this.betLogs[page][index + 1];
        }
        return data;
    }

    private handleNext(isNewest: boolean, page: number, data: any, index: number) {
        if (isNewest) {
            if (page === 1) {
                console.log("isNewest");
            } else {
                const nextPage = page - 1;
                if (this.betLogs[nextPage]) {
                    data = this.betLogs[nextPage][this.betLogs[nextPage].length - 1];
                } else {
                    this.requestPage(nextPage);
                }
            }
        } else {
            data = this.betLogs[page][index - 1];
        }
        return data;
    }

    requestPage(page: number) {
        console.log("requestPage ", page);
        this.betHistoryCallServiceHandler.handle(page);
    }
}
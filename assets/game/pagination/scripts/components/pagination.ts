import { _decorator, Node, Label } from "cc";
import Observer from "observer";
import PaginationItem from "./pagination-item";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "../../../../shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { BetHistory } = gc;

@ccclass("Pagination")
export default class Pagination extends ObserverComponent {
    @property(Node)
    nodeFirst: Node = null;

    @property(Node)
    nodePrevious: Node = null;

    @property(Node)
    nodeNext: Node = null;

    @property(Node)
    nodeLast: Node = null;

    @property(PaginationItem)
    pages: PaginationItem[] = [];

    protected pageButtons: number = 5;
    protected control: any = null;
    protected totalPages = 0;
    protected pageRed = 0;
    protected currentPage = 1;

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    handleFirstPage() {
        this.currentPage = 1;
        this.fetchData();
    }

    handleLastPage() {
        this.currentPage = this.totalPages;
        this.fetchData();
    }
    hanldePreviousPage() {
        this.currentPage--;
        this.fetchData();
    }

    hanldeNextPage() {
        this.currentPage++;
        this.fetchData();
    }

    hanldePage(event: any, pageNumber: string) {
        this.currentPage = parseInt(pageNumber);
        this.fetchData();
    }

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler, pageNumber: number) => handler.handle(pageNumber))
    fetchData() {
        this.playSoundClick();
        return this.currentPage;
    }

    @render(BetHistory.BetHistoryStore, (store) => store.betHistoryModel)
    setData(model: gc.BetHistory.BetHistoryModel) {
        this.currentPage = model.page;
        this.totalPages = Math.ceil(model.total / model.pageSize);
        this.pageRed = this.totalPages > this.pageButtons ? this.totalPages - this.currentPage : 0;

        this.updateLayout();
    }

    updateArrowButtonsVisibility() {
        const conditionPrecedent = this.totalPages > this.pageButtons;

        this.nodeFirst.active = conditionPrecedent && this.currentPage > 2;
        this.nodeLast.active = conditionPrecedent && this.pageRed > 1;

        this.nodePrevious.active = conditionPrecedent && this.currentPage > 1;
        this.nodeNext.active = conditionPrecedent && this.pageRed > 0;
    }

    updateLayout() {
        if (this.totalPages === 1) {
            this.node.active = false;
            return;
        }

        const startedIndex = this.getStartedPageIndex();

        this.pages.forEach((page, index) => {
            const pageNumber = startedIndex + index;
            page.updateHighlight(pageNumber === this.currentPage, pageNumber);
            page.node.active = index < this.totalPages;
        });

        this.updateArrowButtonsVisibility();
    }

    getStartedPageIndex() {
        switch (true) {
            case this.currentPage <= 3:
                return 1;
            case this.currentPage > Math.round(this.pageButtons / 2) &&
                this.currentPage < this.totalPages - Math.round(this.pageButtons / 2):
                return this.currentPage - Math.round(this.pageButtons / 2);
            default:
                return this.totalPages - this.pageButtons + 1;
        }
    }
}

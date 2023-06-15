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
    nodePage1: Node = null;

    @property(Node)
    nodePage2: Node = null;

    @property(Node)
    nodePage3: Node = null;

    @property(Node)
    nodePage4: Node = null;

    @property(Node)
    nodePage5: Node = null;

    @property(Node)
    nodeNext: Node = null;

    @property(Node)
    nodeLast: Node = null;

    protected pageButtons: number = 5;
    protected control: any = null;
    protected totalPages = 0;
    protected pageRed = 0;
    protected currentPage = 1;

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    onClickFirst() {
        this.currentPage = 1;
        this.fectchData();
        this.playSoundClick();
    }
    onClickLast() {
        this.currentPage = this.totalPages;
        this.fectchData();
        this.playSoundClick();
    }
    onClickPrevious() {
        this.currentPage--;
        this.fectchData();
        this.playSoundClick();
    }

    onClickNext() {
        this.currentPage++;
        this.fectchData();
        this.playSoundClick();
    }

    onClickPage(event: any) {
        this.currentPage = parseInt(event.currentTarget.getComponentsInChildren(Label)[0].string);
        this.fectchData();
        this.playSoundClick();
    }

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler, pageNumber: number) => handler.handle(pageNumber))
    fectchData() {
        return this.currentPage;
    }

    @render(BetHistory.BetHistoryStore, (store) => store.data)
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

        [this.nodePage1, this.nodePage2, this.nodePage3, this.nodePage4, this.nodePage5].forEach((node, index) => {
            const pageNumber = startedIndex + index;
            node.getComponent(PaginationItem).updateHighlight(pageNumber === this.currentPage, pageNumber);
            node.active = index < this.totalPages;
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

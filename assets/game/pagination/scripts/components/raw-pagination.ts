import { _decorator, Component, EventTouch, Layout, log, Node } from "cc";
import Observer from "observer";
import { AudioUtils } from "../../../audios/utils";
import PaginationItem from "./pagination-item";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass("RawPagination")
export default class RawPagination extends Component {
    nodeFirst: Node = null;

    nodePrevious: Node = null;

    nodeNext: Node = null;

    nodeLast: Node = null;

    pages: PaginationItem[] = [];

    protected pageButtons = 5;
    protected totalPages = 0;
    protected currentPage = 1;
    private fetchedProps = false;

    public onPageChanged = (page: number) => {};

    onClickPageNumber(event: EventTouch) {
        const pageIndex = event.target.getComponent(PaginationItem)?.page ?? 0;
        if (pageIndex === this.currentPage || pageIndex === 0) {
            log("NO update with pageIndex ", pageIndex);
            return;
        }

        this.currentPage = pageIndex;
        this.pageChanged();
    }

    setData(model: { page: number; total: number; pageSize: number }) {
        if (!model) {
            return;
        }
        this.fetchProperties();
        this.currentPage = model.page;
        this.totalPages = Math.ceil(model.total / model.pageSize);

        this.updateLayout();
    }

    onLoad() {
        this.fetchProperties();
    }

    protected fetchProperties() {
        if (this.fetchedProps) {
            return;
        }
        this.fetchedProps = true;
        this.nodeFirst = this.node.getChildByName("first");
        this.nodePrevious = this.node.getChildByName("previous");
        this.nodeNext = this.node.getChildByName("next");
        this.nodeLast = this.node.getChildByName("last");
        this.pages = this.getComponentsInChildren(PaginationItem);
    }

    protected handleFirstPage() {
        this.currentPage = 1;
        this.pageChanged();
    }

    protected handleLastPage() {
        this.currentPage = this.totalPages;
        this.pageChanged();
    }
    protected handlePreviousPage() {
        this.currentPage--;
        this.pageChanged();
    }

    protected handleNextPage() {
        this.currentPage++;
        this.pageChanged();
    }

    protected pageChanged() {
        AudioUtils.playClick();
        this.onPageChanged(this.currentPage);
    }

    protected updateArrowButtonsVisibility() {
        this.nodeFirst.active = this.currentPage > 2;
        this.nodeLast.active = this.currentPage < this.totalPages - 1;

        this.nodePrevious.active = this.currentPage > 1;
        this.nodeNext.active = this.currentPage < this.totalPages;
    }

    protected updateLayout() {
        if (this.totalPages === 1) {
            this.node.active = false;
            return;
        }

        const startedIndex = this.getStartedPageIndex();

        this.pages.forEach((page, index) => {
            const pageNumber = startedIndex + index;
            page.setData(pageNumber === this.currentPage, pageNumber);
            page.node.active = index < this.totalPages;
        });

        this.updateArrowButtonsVisibility();
        this.forceLayoutUpdate();
    }

    protected forceLayoutUpdate() {
        const layout = this.node.getComponent(Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;
    }

    protected getStartedPageIndex() {
        switch (true) {
            case this.currentPage <= 3:
                return 1;
            case this.currentPage > Math.round(this.pageButtons / 2) &&
                this.currentPage < this.totalPages - Math.round(this.pageButtons / 2):
                return this.currentPage - Math.round(this.pageButtons / 2);
            default:
                return Math.max(0, this.totalPages - this.pageButtons) + 1;
        }
    }
}

import { _decorator, Component, Node, CCInteger, Layout, Label } from "cc";
import Observer from "observer";
import PaginationItem from "./pagination-item";
import gc from "game-client-base";
import { ObserverComponent } from "../../../common/observer-component/scripts/observer-component";
import { BetHistoryModel } from "../../../../../../../../dist/game/bet-history";

const { ccclass, property } = _decorator;
const { handle, observer, render } = Observer;
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

    @property({ type: CCInteger })
    page = 1;

    @property({ type: CCInteger })
    columnsOnPage = 10;

    @property({ type: CCInteger })
    total = 0;

    protected pageSelect: any = null;
    protected control: any = null;
    protected lengthNodePage: any = null;
    protected distanceNumberCenter = 0;
    protected distanceYetChaos = 0;
    protected totalPage = 0;
    protected pageRed = 0;
    protected listComponentPage: PaginationItem[] = [];
    protected listNodePage: Node[] = [];
    protected pageNumberCurrent = 1;

    init(main: any) {
        console.log("Pagination Pagination Pagination");
        const listPageName = [];
        this.listNodePage = [this.nodePage1, this.nodePage2, this.nodePage3, this.nodePage4, this.nodePage5];
        this.listNodePage.forEach((node) => {
            this.listComponentPage.push(node.getComponent(PaginationItem));
        });
        this.control = main;
        this.listComponentPage.forEach((page) => {
            listPageName.push(page.node.name);
        });
        this.lengthNodePage = listPageName.length;
        this.distanceNumberCenter = Math.floor(this.lengthNodePage / 2);
        this.distanceYetChaos = Math.round(this.lengthNodePage / 2);
    }
    onSet(page: number, columnsOnPage: number, totalRow: number) {
        this.page = page;
        this.columnsOnPage = columnsOnPage;
        this.total = totalRow;
        this.totalPage = Math.ceil(totalRow / this.columnsOnPage);
        this.pageRed = this.totalPage - this.page;
        if (totalRow > 0) {
            this.listNodePage.forEach((node) => {
                node.active = false;
            });
            this.node.active = true;
            this.handleActionPage();
        } else {
            this.node.active = false;
        }
        this.updateArrowButtonsVisibility();
        this.updateLayout1();
    }
    resetPageCurrent() {
        this.pageNumberCurrent = 1;
    }
    updateLayout1() {
        const layout = this.node.getComponent(Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;
    }
    handleActionPage() {
        let startIndex = 1;
        let isButtonActive = false;
        if (this.page === 1 || this.totalPage <= this.lengthNodePage) {
            startIndex = 1;
        } else if (this.page > 3) {
            startIndex = this.getStartPage();
        }
        this.listComponentPage.forEach((component, index) => {
            if (index <= this.totalPage && startIndex <= this.totalPage) {
                isButtonActive = false;
                // component.node.page = startIndex;
                component.number.string = startIndex.toString();
                startIndex++;
                component.node.active = true;
                if (+component.number.string === this.pageNumberCurrent) {
                    isButtonActive = true;
                    this.pageSelect = component;
                    component.node.pauseSystemEvents(true);
                }
                component.updateHighlight(isButtonActive);
            } else {
                component.node.active = false;
            }
        });
        return void 0;
    }
    getStartPage() {
        const numberSub = this.page === this.totalPage ? this.lengthNodePage - 1 : this.distanceYetChaos;
        const isCheckPage = this.page + this.distanceNumberCenter <= this.totalPage;
        return isCheckPage ? this.page - this.distanceNumberCenter : this.page - numberSub;
    }
    updateArrowButtonsVisibility() {
        this.nodeFirst.active = this.pageNumberCurrent > 2;
        this.nodeLast.active = this.pageRed > 1;
        this.nodePrevious.active = this.pageNumberCurrent > 1;
        this.nodeNext.active = this.pageRed > 0;
    }
    onClickFirst(event: any) {
        this.pageNumberCurrent = 1;
        this.getPageData();
        // AudioManager.getInstance().playClick();
    }
    onClickLast(event: any) {
        this.pageNumberCurrent = this.totalPage;
        this.getPageData();
        // AudioManager.getInstance().playClick();
    }
    onClickPrevious(event: any) {
        this.pageNumberCurrent--;
        this.getPageData();
        // AudioManager.getInstance().playClick();
    }

    onClickNext(event: any) {
        this.pageNumberCurrent++;
        this.getPageData();
        // AudioManager.getInstance().playClick();
    }

    onClickPage(event: any) {
        const selectedPage = event.currentTarget.getComponentsInChildren(Label)[0].string;
        this.pageNumberCurrent = selectedPage;
        this.getPageData();
    }

    @handle(BetHistory.BetHistoryHandlers.BetHistoryCallServiceHandler, (handler, pageNumber: number) => handler.handle(pageNumber))
    getPageData() {
        console.log(`pageNumber: ${this.pageNumberCurrent}`);
        return this.pageNumberCurrent;
    }

    @render(BetHistory.BetHistoryStore, (store) => store.data)
    setData(model: BetHistoryModel) {
        this.pageNumberCurrent = model.page;
        this.total = model.total;
        this.columnsOnPage = model.pageSize;
        this.pageSelect = model.pageSize;
        this.totalPage = Math.ceil(model.total / model.pageSize);

        this.updateLayout();
    }

    updateLayout() {
        this.listNodePage = [this.nodePage1, this.nodePage2, this.nodePage3, this.nodePage4, this.nodePage5];

        const startedIndex = this.getStartedPageIndex();
        this.pageRed = this.totalPage - this.pageNumberCurrent;

        this.listNodePage.forEach((node, index) => {
            node.getComponentsInChildren(Label)[0].string = (startedIndex + index).toString();
            node.getComponent(PaginationItem).updateHighlight(
                node.getComponentsInChildren(Label)[0].string === this.pageNumberCurrent.toString()
            );
            this.listComponentPage.push(node.getComponent(PaginationItem));
        });

        this.updateArrowButtonsVisibility();
    }

    getStartedPageIndex() {
        switch (true) {
            case this.pageNumberCurrent <= 3:
                return 1;
            case this.totalPage - this.pageNumberCurrent < 5:
                return this.totalPage - 4;
            default:
                return this.pageNumberCurrent - 3;
        }
    }
}

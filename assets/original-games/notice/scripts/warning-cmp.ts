import { _decorator } from "cc";
import { WarningCmp } from "db://shared-components/shared/common-components/notice/scripts/warning-cmp";
const { ccclass } = _decorator;

@ccclass("OriginalGameWarningCmp")
export class OriginalGameWarningCmp extends WarningCmp {
    close() {
        this.node.active = false;
    }
}

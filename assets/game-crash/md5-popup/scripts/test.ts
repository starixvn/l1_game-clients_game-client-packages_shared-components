import { _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../shared/common-components/observer-component/scripts/observer-component";
import { Md5PopupHandler } from "./handlers/md5-popup-handlers";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class Test extends ObserverComponent {
    @handle(Md5PopupHandler, (handle, info: { isCrashed: number; isOpenPopupMd5: boolean }) => handle.handleMd5Popup(info))
    onClickButton() {
        return { isCrashed: 2, isOpenPopupMd5: true };
    }
}

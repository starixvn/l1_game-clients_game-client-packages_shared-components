import { sys } from "cc";

export namespace BrowserUtils {
    export const showCursorText = () => {
        isCursorAuto() || setCursor("text");
    };

    export const showCursorPointer = () => {
        isCursorAuto() || setCursor("pointer");
    };

    export const showCursorMove = () => {
        isCursorAuto() || setCursor("move");
    };

    export const showCursorAuto = () => {
        isCursorAuto() || setCursor("auto");
    };

    export const showCursorShoot = () => {
        if (sys.isBrowser) {
            document.getElementById("GameDiv").style.cursor = "url('cursors/cursor-shot.png') 5 2, auto";
        }
    };

    export const showCursorAutoForce = () => {
        sys.isBrowser && setCursor("auto");
    };

    export const isCursorAuto = () => {
        return !!sys.isBrowser && "auto" === document.getElementById("GameDiv").style.cursor;
    };

    export const setCursor = (t) => {
        if (sys.isBrowser) {
            document.body.style.cursor = t;
        }
    };

    export const showTooltip = (t) => {
        if (sys.isBrowser) {
            document.body.title = t;
        }
    };

    export const focusGame = () => {
        sys.isBrowser && document.getElementsByTagName("canvas")[0].focus();
    };

    export const getHTMLElementByEditBox = (t) => {
        return t._impl._elem;
    };

    export const checkEditBoxFocus = (t) => {
        return t.isFocused();
    };

    export const focusEditBox = (t) => {
        t._impl._elem.focus();
        t.focus();
    };

    export const unFocusEditBox = (t) => {};

    export const inputAddEvent = (input, event, callback) => {
        input._impl._elem.addEventListener(event, callback);
    };

    export const inputRemoveEvent = (input, event, callback) => {
        input._impl._elem.removeEventListener(event, callback);
    };

    export const readOnlyEditBox = (t) => {
        t.readOnly = !0;
    };
}

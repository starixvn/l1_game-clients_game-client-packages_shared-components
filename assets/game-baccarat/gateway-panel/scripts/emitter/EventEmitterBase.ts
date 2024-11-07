import { EventTarget } from "cc";
export default class EventEmitterBase extends EventTarget {
    addListener<TFunction extends (...any: any[]) => void>(event: string, listener: TFunction) {
        this.on(event, listener);
    }

    removeListener<TFunction extends (...any: any[]) => void>(event: string, listener: TFunction) {
        this.off(event, listener);
    }
    updateUI() {}
}

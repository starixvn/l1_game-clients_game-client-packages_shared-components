import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

interface EventData {
    event: string;
}

@injectable()
export class InGameMenuStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    event: EventData = null;
}

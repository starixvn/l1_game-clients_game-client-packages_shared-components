import inversify from "inversify";
import { InGameMenuStore } from "../stores/in-game-menu-store";
const { inject, injectable } = inversify;

@injectable()
export class InGameMenuHandlers {
    @inject(InGameMenuStore) private readonly connectionStore: InGameMenuStore;

    handle(event: string) {
        this.connectionStore.event = { event };
    }
}

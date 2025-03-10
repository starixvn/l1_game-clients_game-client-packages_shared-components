import gc from "@sg/game-client-base";
import { injectable } from "inversify";

@injectable()
export class FakeChipHandlers extends gc.Chips.ChipHandlers {
    eventHandleList = [
        // {
        //     name: GameServiceMessage.Chips.eventName,
        //     handle: this.handleChips,
        // },
        {
            name: gc.GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
        {
            name: gc.GameServiceMessage.OwnChip.eventName,
            handle: this.handleOwnChip,
        },
        {
            name: gc.GameServiceMessage.ReBet.eventName,
            handle: this.handleReBet,
        },
    ];
}

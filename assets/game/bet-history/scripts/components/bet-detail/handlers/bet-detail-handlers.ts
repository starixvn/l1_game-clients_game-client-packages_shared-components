import inversify from "inversify";
import { BetDetailStore } from "../stores/bet-detail-store";

const { injectable, inject } = inversify;

@injectable()
export class BetDetailHandlers {
    @inject(BetDetailStore) private readonly store: BetDetailStore;

    async handle(balance: number) {}
}

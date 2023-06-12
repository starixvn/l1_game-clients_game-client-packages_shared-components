import { Node } from "cc";
import inversify from "inversify";
import { MainPlayerProfileStore } from "../stores/main-player-profile-store";

const { injectable, inject } = inversify;

export namespace MainPlayerProfileHandlers {
    @injectable()
    export class SetMainPlayerAvatar {
        @inject(MainPlayerProfileStore) private readonly mainPlayerProfileStore: MainPlayerProfileStore;

        async handle(avatarNode: Node) {
            this.mainPlayerProfileStore.mainPlayerAvatarNode = avatarNode;
        }
    }
}

import { Node } from "cc";
import inversify from "inversify";
import { UserProfileStore } from "../stores/user-profile-store";

const { injectable, inject } = inversify;

export namespace UserProfileHandlers {
    @injectable()
    export class SetMainPlayerAvatar {
        @inject(UserProfileStore) private readonly userProfileStore: UserProfileStore;

        async handle(avatarNode: Node) {
            this.userProfileStore.mainPlayerAvatarNode = avatarNode;
        }
    }
}

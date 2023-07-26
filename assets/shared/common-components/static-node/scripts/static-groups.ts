import { Node, _decorator } from "cc";
import { StaticGroupsModel } from "./models/static-groups-model";
import { StaticGroup } from "./static-group";
const { ccclass, property } = _decorator;

@ccclass("StaticGroups")
export class StaticGroups extends StaticGroup {
    @property({ type: Node, visible: false, override: true })
    contents: Node[] = [];

    @property({ type: Node, visible: false, override: true })
    container: Node = null;

    @property({ visible: false, override: true })
    groupId = 0;

    @property(StaticGroupsModel)
    staticGroups: StaticGroupsModel[] = [];

    scheduleMoveNodeToContainer() {
        this.staticGroups.forEach((staticGroup) => {
            staticGroup.contents.forEach((content) => {
                this.moveNodeToContainer(content, staticGroup.container, staticGroup.groupId);
            });
        });
    }
}

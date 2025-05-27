import { _decorator, instantiate, Prefab, Node } from "cc";
import SlidingChip from "./sliding-chip";
import { NewChip } from "./new-chip";
const { ccclass, property } = _decorator;

@ccclass("NewSlidingChip")
export class NewSlidingChip extends SlidingChip {
    @property(Prefab)
    newChipPrefab: Prefab = null;

    public createChip3D(value: number): Node {
        const chipNode = instantiate(this.newChipPrefab);
        if (!chipNode) {
            return null;
        }
        const newChip = chipNode.getComponent(NewChip);
        newChip.setColor(this.getChipColor(value));
        newChip.setValue(value);
        const index = this.chipValues.findIndex((chipValue) => chipValue === +value);
        newChip.setType(this.getChipDisplayType(index));
        return chipNode;
    }
}

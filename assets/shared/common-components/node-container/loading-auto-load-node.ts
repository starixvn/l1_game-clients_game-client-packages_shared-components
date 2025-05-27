import { _decorator, Node } from "cc";
import { AutoLoadNode } from "./auto-load-node";
const { ccclass, property } = _decorator;

@ccclass("LoadingAutoLoadNode")
export class LoadingAutoLoadNode extends AutoLoadNode {
    @property(Node)
    nodeLoading: Node = null;

    async onLoad() {
        if (this.nodeLoading) {
            this.nodeLoading.active = true;
        }
        
        try {
            await super.onLoad();
        } finally {
            if (this.nodeLoading) {
                this.nodeLoading.active = false;
            }
        }
    }
} 
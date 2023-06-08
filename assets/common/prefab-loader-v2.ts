import { Component, _decorator, Node, Prefab, instantiate, EventHandler } from "cc";
const { ccclass, property, menu} = _decorator;

@ccclass
@menu("Common/PrefabLoaderV2")
export default class PrefabLoaderV2 extends Component {
    @property(Prefab)
    public prefab: Prefab = null;

    @property([Component.EventHandler])
    private readonly initializationEventHandlers: EventHandler[] = [];

    public instance: Node;

    protected onLoad() {
        this.createInstance();
        this.initialize();
    }

    protected createInstance() {
        this.instance = instantiate(this.prefab);
    }

    private initialize() {
        if (this.instance) {
            this.node.addChild(this.instance);
            this.initializationEventHandlers.forEach((eventHandler) => eventHandler.emit([this.instance]));
        }
    }
}

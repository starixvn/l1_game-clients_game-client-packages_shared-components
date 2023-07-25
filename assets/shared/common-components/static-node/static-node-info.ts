export default class StaticNodeInfo {
    static readonly uiContainer = new StaticNodeInfo(1);
    static readonly textContainer = new StaticNodeInfo(2);
    static readonly chipContainer = new StaticNodeInfo(3);
    static readonly betInfoContainer = new StaticNodeInfo(4);

    private constructor(public readonly groupId: number) {}
}

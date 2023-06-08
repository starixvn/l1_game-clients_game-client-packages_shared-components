import MD5Tip from "./md5-tip";
import { Component, _decorator, Node } from "cc";
const { ccclass, property} = _decorator;

@ccclass
export default class MD5Tooltip extends Component {
    @property(MD5Tip)
    tip: MD5Tip = null;

    public data: string;

    public md5Content: Node;

    public setData(data: string) {
        this.data = data;
    }
}

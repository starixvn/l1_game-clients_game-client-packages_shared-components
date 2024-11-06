import { _decorator, Component } from "cc";
import { GameData } from "../models/game-data";
const { ccclass, property } = _decorator;

@ccclass
export default class RenderItem extends Component {
    init(data: GameData) {}
    protected onData: (data: any) => void;
}

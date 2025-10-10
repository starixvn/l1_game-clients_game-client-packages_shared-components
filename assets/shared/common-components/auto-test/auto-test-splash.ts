import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class AutoTestSplash extends Component {
    onLoad() {
        console.log("LoadScene Portrait");
    }
}
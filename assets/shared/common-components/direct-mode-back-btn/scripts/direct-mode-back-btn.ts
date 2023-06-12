import { _decorator, Component } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { handle, observer } = Observer;

const { App } = gc;

const { ccclass } = _decorator;

@ccclass
@observer
export default class DirectModeBackBtn extends Component {
    @handle(App.AppHandlers.BackToOperatorLobby)
    onClick() {}
}

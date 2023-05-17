import { _decorator, Component } from "cc";
import gc from "game-client-base";
import Observer from "observer";

const { ccclass } = _decorator;
const { observer, handle } = Observer;

@ccclass
@observer
export class SessionTimeoutComponent extends Component {
    onLoad() {
        this.sessionTimeout();
    }

    @handle(gc.Auth.AuthHandlers.SessionTimeout)
    sessionTimeout() {}
}

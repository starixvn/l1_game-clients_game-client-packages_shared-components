import { find } from "cc";
import StartupComponent from "../game/scripts/components/startup-component";

export namespace FunctionUtils {
    export const getNamespace = (defaultName?: string) => {
        const namespace = find("Canvas").getComponent(StartupComponent)?.namespace;
        return defaultName || namespace;
    };
}

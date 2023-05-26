import { find } from "cc";
import StartupComponent from "../game/scripts/components/startup-component";

export namespace FunctionUtils {
    export const getNamespace = () => {
        const namespace = find("Canvas").getComponent(StartupComponent)?.namespace;
        return namespace || "default";
    };
}

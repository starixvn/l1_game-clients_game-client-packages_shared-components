import { CCString, Enum, _decorator } from "cc";
import { EDITOR } from "cc/env";
import { L10nLabel, l10n } from "../../../../localization-editor/static/assets/l10n";
import { FormationHandler } from "./formation-handler";

const { ccclass, property } = _decorator;

@ccclass("L10nLabelWithFormat")
export class L10nLabelWithFormat extends L10nLabel {
    @property({ type: Enum(FormationHandler) })
    format = FormationHandler.UPPER;

    @property(CCString)
    suffix = "";

    render() {
        const translatedString = l10n.t(this._key, { count: this._count });
        if (typeof this.label === "undefined" || typeof translatedString === "undefined") {
            return;
        }

        const formattedString = this.handleFormat(translatedString) + this.suffix;
        if (EDITOR) {
            this.preview(formattedString);
        } else {
            this.label.string = formattedString;
        }
    }

    handleFormat(value: string) {
        switch (this.format) {
            case FormationHandler.LOWER:
                return this.lowerCase(value);
            case FormationHandler.UPPER:
                return this.upperCase(value);
            case FormationHandler.TITLE:
                return this.titleCase(value);
            default:
                return value;
        }
    }

    titleCase(value: string) {
        return value.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
    }

    upperCase(value: string) {
        return value.toUpperCase();
    }

    lowerCase(value: string) {
        return value.toLowerCase();
    }
}

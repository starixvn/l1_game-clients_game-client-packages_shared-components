import { _decorator, Component, screen, Size, sys, view } from "cc";
import { PREVIEW } from "cc/env";
const { ccclass } = _decorator;

@ccclass("FitHeightDesignResolution")
export class FitHeightDesignResolution extends Component {
    private designResolutionSize: Size;

    private timeout: NodeJS.Timeout;

    protected onLoad(): void {
        this.designResolutionSize = view.getDesignResolutionSize();
        this.adjustResolution();
        window.addEventListener("resize", this.debouncedResizeWindow);
    }

    protected onDestroy(): void {
        window.removeEventListener("resize", this.debouncedResizeWindow);
    }

    adjustResolution() {
        const { width, height } = this.designResolutionSize;

        if (!sys.isMobile && !PREVIEW) {
            const gameContainer = document.getElementById("Cocos3dGameContainer");
            gameContainer.style.position = "relative";
            // For desktop browsers, use FIT_HEIGHT
            const ratioScale = window.innerHeight / height;
            const newWidth = ratioScale * width;

            const dpr = screen.devicePixelRatio || 1;

            screen.windowSize = new Size(Math.round(newWidth * dpr), Math.round(window.innerHeight * dpr));
        }
    }

    debounce(func: any, wait: number) {
        return (...args: any[]) => {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    private resizeWindow() {
        this.adjustResolution();
    }

    private readonly debouncedResizeWindow = this.debounce(this.resizeWindow, 100);
}

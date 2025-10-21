import { _decorator, Component, screen, Size, sys, view } from "cc";
import { PREVIEW } from "cc/env";
const { ccclass } = _decorator;
class FitHeightHandler {
    private designResolutionSize: Size;
    private timeout: NodeJS.Timeout;

    public init(): void {
        this.designResolutionSize = view.getDesignResolutionSize();
        this.adjustResolution();
        window.addEventListener("resize", this.debouncedResizeWindow);
    }

    private adjustResolution() {
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

    private debounce(func: any, wait: number) {
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

@ccclass("FitHeightDesignResolution")
export class FitHeightDesignResolution extends Component {
    static handler: FitHeightHandler = null;

    onLoad(): void {
        if (FitHeightDesignResolution.handler) {
            return;
        }
        FitHeightDesignResolution.handler = new FitHeightHandler();
        FitHeightDesignResolution.handler.init();
    }
}

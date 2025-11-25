import { Slider, Node, Component, Event, _decorator } from "cc";
import { StatusButton } from "./status-button";
const { ccclass, property } = _decorator;

export enum SliderState {
    NORMAL,
    HOVER,
    PRESSED,
    DISABLED,
}

@ccclass("StatusSlider")
export class StatusSlider extends Slider {
    @property(Node)
    disableNode: Node = null;

    @property(Node)
    activeNode: Node = null;

    @property(StatusButton)
    decreaseBtn: StatusButton = null;

    @property(StatusButton)
    increaseBtn: StatusButton = null;


    @property
    minValue: number = 0;

    @property
    maxValue: number = 100;

    @property
    currentValue: number = 0;

    private _onValueChanged: ((value: number) => void) | null = null;
    private _onIncrease: (() => void) | null = null;
    private _onDecrease: (() => void) | null = null;

    /**
     * Handle slider state changes (override in subclasses if needed)
     */
    onSliderStateChange(state: SliderState) {
        if (this.activeNode) {
            this.activeNode.active = state === SliderState.HOVER || state === SliderState.PRESSED;
        }
        if (this.disableNode) {
            this.disableNode.active = state === SliderState.DISABLED;
        }
    }

    onLoad() {
        super.onLoad();
        this.updateButtonStates();
        this.updateSliderProgress();
    }

    /**
     * Set callback for value changes
     */
    setOnValueChanged(callback: (value: number) => void) {
        this._onValueChanged = callback;
    }

    /**
     * Set custom increase callback
     */
    setOnIncrease(callback: () => void) {
        this._onIncrease = callback;
    }

    /**
     * Set custom decrease callback
     */
    setOnDecrease(callback: () => void) {
        this._onDecrease = callback;
    }

    /**
     * Set min and max values
     */
    setRange(min: number, max: number) {
        this.minValue = min;
        this.maxValue = max;
        this.updateButtonStates();
        this.updateSliderProgress();
    }

    /**
     * Set current value
     */
    setValue(value: number) {
        this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, value));
        this.updateButtonStates();
        this.updateSliderProgress();
    }

    /**
     * Get current value
     */
    getValue(): number {
        return this.currentValue;
    }

    /**
     * Handle slider progress change
     */
    onSliderChange(slider: Slider | Event | any, customEventData?: string) {
        // This is called when the slider is dragged OR when buttons are clicked
        // If slider is a Slider object, it's from the slider drag
        // If it's an Event or undefined, it's from a button click
        if (slider && typeof slider.progress === "number" && !isNaN(slider.progress)) {
            // Slider drag event - slider is a Slider component with valid progress
            this.handleSliderProgressChange(slider.progress);
        } else {
            // Button click event - determine which button based on customEventData
            const isIncrease = customEventData === "increase";
            const isDecrease = customEventData === "decrease";

            if (isIncrease) {
                this.onIncreaseClick();
            } else if (isDecrease) {
                this.onDecreaseClick();
            }
        }
    }

    /**
     * Handle slider progress change from drag
     */
    private handleSliderProgressChange(progress: number) {
        // Convert slider progress (0-1) to actual value
        const value = this.minValue + (progress * (this.maxValue - this.minValue));
        this.currentValue = Math.max(this.minValue, Math.min(this.maxValue, value));

        // Update button states
        this.updateButtonStates();

        // Notify listeners
        if (this._onValueChanged) {
            this._onValueChanged(this.currentValue);
        }
    }

    /**
     * Handle increase button click
     */
    onIncreaseClick() {
        if (this._onIncrease) {
            this._onIncrease();
        } else if (this.currentValue < this.maxValue) {
            // Default increment - can be overridden by subclasses
            this.setValue(this.currentValue + 1);
        }
    }

    /**
     * Handle decrease button click
     */
    onDecreaseClick() {
        if (this._onDecrease) {
            this._onDecrease();
        } else if (this.currentValue > this.minValue) {
            // Default decrement - can be overridden by subclasses
            this.setValue(this.currentValue - 1);
        }
    }


    /**
     * Update button interactable states based on current value
     */
    private updateButtonStates() {
        const canDecrease = this.currentValue > this.minValue;
        const canIncrease = this.currentValue < this.maxValue;

        if (this.decreaseBtn) {
            this.decreaseBtn.interactable = canDecrease;
        }

        if (this.increaseBtn) {
            this.increaseBtn.interactable = canIncrease;
        }
    }

    /**
     * Update slider progress based on current value
     */
    private updateSliderProgress() {
        // Convert actual value to slider progress (0-1)
        const progress = this.maxValue > this.minValue ?
            (this.currentValue - this.minValue) / (this.maxValue - this.minValue) : 0;

        const clampedProgress = Math.max(0, Math.min(1, progress));
        const currentProgress = this.progress;
        const progressDiff = Math.abs(currentProgress - clampedProgress);

        // Update slider progress - always update to ensure it's in sync
        if (progressDiff > 0.0001) {
            this.progress = clampedProgress;
        }
    }
}

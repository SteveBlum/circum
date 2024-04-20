// Based on Canvas Clock by Marco Antonio Aguilar Acuña, https://codepen.io/Maku2202/pen/MarRgK/

import { Model } from "../../../models/model";
import { BaseController } from "../../baseController";

interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
/** Configuration attributes for the clock */
export interface ClockConfig {
    /** locale in JavaScript locales format, used for texts and date/time formatting */
    locale: Intl.LocalesArgument;
    /** Main color of the clock */
    color: RgbaColor;
}

const defaultConfig: ClockConfig = {
    locale: "de-DE",
    color: { r: 30, g: 150, b: 0, a: 1 },
};

/**
 * Controller for the circum clock, a small web app used as iframe for testing in circum
 * Belongs to /src/views/frames/Clock.html
 */
export class ClockController extends BaseController<ClockConfig> {
    protected _model: Model<() => Promise<ClockConfig>>;
    protected config: ClockConfig;
    protected interval: NodeJS.Timer | undefined;
    private canvasID = "canvas";
    // Nothing to be said about this constructor
    // eslint-disable-next-line jsdoc/require-jsdoc
    constructor(config = defaultConfig) {
        super();
        this.config = config;
        this._model = new Model(this.getData.bind(this), this.refreshView.bind(this));
        void this.refresh();
    }
    protected getRgbaString(color: RgbaColor): string {
        return `rgba(${color.r.toString()}, ${color.g.toString()}, ${color.b.toString()}, ${color.a.toString()})`;
    }
    protected darkenColor(color: RgbaColor): RgbaColor {
        return {
            r: this.darkenColorChannel(color.r),
            g: this.darkenColorChannel(color.g),
            b: this.darkenColorChannel(color.b),
            a: color.a,
        };
    }
    private darkenColorChannel(value: number): number {
        if (value === 0) return 0;
        return Math.floor(value / 3);
    }
    /** Returns a darkened variant of the main color */
    get colorDark(): RgbaColor {
        return this.darkenColor(this.config.color);
    }
    /** Returns the canvas HTML element */
    get canvas(): HTMLCanvasElement {
        return this.typedElement(this.canvasID, "canvas").get();
    }
    /** Returns the canvas context HTML element */
    get canvasContext(): CanvasRenderingContext2D {
        const canvasContext = this.canvas.getContext("2d");
        if (!canvasContext) throw new Error(`Didn't find 2D context for canvas ${this.canvasID}`);
        return canvasContext;
    }
    /** A function to get the clock configuration used to initialize the model */
    public getData(): Promise<ClockConfig> {
        return Promise.resolve(this.config);
    }
    private degToRad(degree: number): number {
        const factor = Math.PI / 180;
        return degree * factor;
    }
    protected screenResize(): void {
        if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }
    }
    protected renderTime(): void {
        this.screenResize();
        const now = new Date();
        const today = now.toLocaleDateString(this.config.locale, { year: "numeric", month: "2-digit", day: "2-digit" });
        const weekday = now.toLocaleDateString(this.config.locale, { weekday: "long" });
        const time = now.toLocaleTimeString(this.config.locale);
        const hrs = now.getHours();
        const min = now.getMinutes();
        const sec = now.getSeconds();
        const mil = now.getMilliseconds();
        const smoothsec = sec + mil / 1000;
        const smoothmin = min + smoothsec / 60;
        const radius = this.canvas.height > this.canvas.width ? this.canvas.width / 2 : this.canvas.height / 2;
        //Background
        const gradient = this.canvasContext.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            5,
            this.canvas.width / 2,
            this.canvas.height / 2,
            (radius / 25) * 30,
        );
        gradient.addColorStop(0, this.getRgbaString(this.colorDark));
        gradient.addColorStop(1, "black");
        this.canvasContext.fillStyle = gradient;
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //Strokes
        this.canvasContext.strokeStyle = this.getRgbaString(this.config.color);
        this.canvasContext.lineWidth = 17;
        this.canvasContext.shadowBlur = 15;
        this.canvasContext.shadowColor = this.getRgbaString(this.config.color);
        //Hours
        this.canvasContext.beginPath();
        this.canvasContext.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            (radius / 25) * 20,
            this.degToRad(270),
            this.degToRad(hrs * 15 - 90),
        );
        this.canvasContext.stroke();
        //Minutes
        this.canvasContext.beginPath();
        this.canvasContext.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            (radius / 25) * 17,
            this.degToRad(270),
            this.degToRad(smoothmin * 6 - 90),
        );
        this.canvasContext.stroke();
        //Seconds
        this.canvasContext.beginPath();
        this.canvasContext.arc(
            this.canvas.width / 2,
            this.canvas.height / 2,
            (radius / 25) * 14,
            this.degToRad(270),
            this.degToRad(smoothsec * 6 - 90),
        );
        this.canvasContext.stroke();
        //Weekday
        this.canvasContext.textAlign = "center";
        this.canvasContext.font = "25px Helvetica";
        this.canvasContext.fillStyle = this.getRgbaString(this.config.color);
        this.canvasContext.fillText(weekday, this.canvas.width / 2, this.canvas.height / 2 - 30);
        //Date
        this.canvasContext.textAlign = "center";
        this.canvasContext.font = "25px Helvetica";
        this.canvasContext.fillStyle = this.getRgbaString(this.config.color);
        this.canvasContext.fillText(today, this.canvas.width / 2, this.canvas.height / 2);
        //Time
        this.canvasContext.textAlign = "center";
        this.canvasContext.font = "25px Helvetica Bold";
        this.canvasContext.fillStyle = this.getRgbaString(this.config.color);
        this.canvasContext.fillText(time, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    /**
     * Updates all UI components controlled by this controller based on the given configuration
     * @param data - Configuration to display. If an Error is provided instead, it will be thrown.
     */
    public refreshView(data: ClockConfig | Error): void {
        if (data instanceof Error) throw data;
        this.interval = setInterval(this.renderTime.bind(this), 1000);
    }
    /**
     * Triggers all listeners registered for the model
     * Shorthand for this._model.refresh()
     */
    public async refresh(): Promise<void> {
        return this._model.refresh();
    }
}

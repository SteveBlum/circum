import { ConfigModel, Settings, Site } from "../models/Config";
import { BaseController, ControllerElementTyped, ControllerElements } from "./baseController";

interface Frame {
    get: () => HTMLIFrameElement;
    refresh: () => void;
    remove: () => void;
}
interface Frames {
    add: (url: Site | Site[]) => HTMLCollectionOf<HTMLIFrameElement>;
    get: () => HTMLCollectionOf<HTMLIFrameElement>;
    count: () => number;
    refresh: () => void;
    remove: () => void;
    activateFirst: () => void;
}

/**
 * Controller for circum main screen, belongs to src/views/partials/Main.html
 */
export class MainController extends BaseController<Settings> {
    private job: NodeJS.Timer | undefined;
    public frameCounter = 0;
    protected _model: ConfigModel;
    public loading: Promise<void>;
    /**
     * @param model - Instance of the configuration model, used to get settings
     */
    constructor(model: ConfigModel) {
        super();
        this.addListener();
        model.listener.add(this.refreshView.bind(this));
        this._model = model;
        this.loading = this.refresh();
    }
    /**
     * Overwrites the config within the registered config model instance, which will automatically also trigger a refresh
     * Shorthand for setting this._model.config
     * @param newConfig - New configuration
     */
    set config(newConfig: Settings) {
        this._model.config = newConfig;
        this.loading = this._model.loading;
    }
    /**
     * Returns the configuration stored within the registered config model instance without changes
     * Shorthand for getting this._model.config
     */
    get config(): Settings {
        return this._model.config;
    }
    protected addListener(): void {
        this.fullscreenButton.addListener("click", () => {
            void this.toggleFullScreen();
        });
        this.refreshOptions.addListener("click", (event) => {
            const target = event.target as HTMLLinkElement;
            const refreshRate = target.attributes.getNamedItem("refreshRate");
            if (!refreshRate) return;
            const refreshRateValue = parseInt(refreshRate.value);
            if (refreshRateValue === 0) {
                this.frames().refresh();
                return;
            }
            this.config = { ...this.config, ...{ refreshRate: refreshRateValue } };
        });
    }
    /**
     * Returns the refresh options dropdown HTML element
     */
    get refreshOptions(): ControllerElements {
        return this.elements("dropdown-item refreshOption");
    }
    /**
     * Returns the fullscreen button HTML element
     */
    get fullscreenButton(): ControllerElementTyped<"a"> {
        return this.typedElement("fullscreenButton", "a");
    }
    /**
     * Returns all items within the main carousel
     */
    get carouselItems(): HTMLCollectionOf<Element> {
        return this.elements("carousel-item").get();
    }
    /**
     * Triggers all listeners registered for the config model
     * Shorthand for this._model.refresh()
     */
    public async refresh(): Promise<void> {
        return this._model.refresh();
    }
    private getCurrentFrames(): string[] {
        const res: string[] = [];
        const frames = this.frames().get();
        Array.from(frames).forEach((frame) => {
            let src = frame.src;
            // To make sure local paths still continue to work
            src = src.replace(document.location.toString(), "./");
            res.push(src);
        });
        return res;
    }
    /**
     * Updates all UI components controlled by this controller based on the given configuration
     * @param data - Configuration to display. If an Error is provided instead, it will be thrown.
     */
    public refreshView(data: Settings | Error): void {
        if (data instanceof Error) throw data;
        // Setting Frames
        if (JSON.stringify(this.getCurrentFrames()) !== JSON.stringify(data.sites)) {
            this.frames().remove();
            this.frames().add(data.sites);
        }
        // Setting Rotation Rate
        Array.from(this.carouselItems).forEach((element) => {
            element.setAttribute("data-bs-interval", (data.rotationRate * 1000).toString());
        });
        // Setting Refresh Rate
        if (this.job) {
            clearInterval(this.job);
        }
        this.job = setInterval(this.frames().refresh.bind(this), data.refreshRate * 1000);
        // Applying WakeLock
        if (data.wakeLock) void this.wakeLock.on();
        else void this.wakeLock.off();
    }
    /**
     * This function uses many different approaches from various browsers to get fullscreen -
     * most of them don't work in this environment. No benefit in unit testing this.
     */
    /* istanbul ignore next */
    protected async toggleFullScreen(): Promise<void> {
        // https://stackoverflow.com/questions/54242775/angular-7-how-does-work-the-html5-fullscreen-api-ive-a-lot-of-errors
        const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
            mozRequestFullScreen(): Promise<void>;
            webkitRequestFullscreen(): Promise<void>;
            msRequestFullscreen(): Promise<void>;
        };
        const docWithBrowsersExitFunctions = document as Document & {
            mozCancelFullScreen(): Promise<void>;
            webkitExitFullscreen(): Promise<void>;
            msExitFullscreen(): Promise<void>;
            mozFullScreenElement: Element | null;
            webkitFullscreenElement: Element | null;
            msFullscreenElement: Element | null;
        };
        /* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/unbound-method */
        const requestFullScreen =
            docElmWithBrowsersFullScreenFunctions.requestFullscreen ||
            docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen ||
            docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen ||
            docElmWithBrowsersFullScreenFunctions.msRequestFullscreen;
        const cancelFullScreen =
            docWithBrowsersExitFunctions.exitFullscreen ||
            docWithBrowsersExitFunctions.mozCancelFullScreen ||
            docWithBrowsersExitFunctions.webkitExitFullscreen ||
            docWithBrowsersExitFunctions.msExitFullscreen;
        /* eslint-enable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/unbound-method */
        if (
            !docWithBrowsersExitFunctions.fullscreenElement &&
            !docWithBrowsersExitFunctions.mozFullScreenElement &&
            !docWithBrowsersExitFunctions.webkitFullscreenElement &&
            !docWithBrowsersExitFunctions.msFullscreenElement
        ) {
            await requestFullScreen.call(docElmWithBrowsersFullScreenFunctions);
        } else {
            await cancelFullScreen.call(docWithBrowsersExitFunctions);
        }
    }
    /**
     * Exposes management functions for an individal iframe of the carousel
     * @param id - iframe HTML element id
     */
    public frame(id: string): Frame {
        return {
            get: (): HTMLIFrameElement => {
                return this.typedElement(id, "iframe").get();
            },
            refresh: (): void => {
                const frame = this.frame(id).get();
                frame.src += "";
            },
            remove: (): void => {
                const frame = this.typedElement(id, "iframe");
                const parentDiv = frame.get().parentElement;
                frame.remove();
                // The parentDiv could be null, but jest fails if trying to test this with a manually added iframe
                // This is not a huge problem, since throwing an error is actually the expected behaviour anyways
                /* istanbul ignore next */
                parentDiv?.remove();
            },
        };
    }
    /**
     * Returns the div containing all child elements of the carousel
     */
    get carouselInner(): ControllerElementTyped<"div"> {
        return this.typedElement("myCarouselInner", "div");
    }
    /**
     * Exposes management functions for all iframes of the carousel
     */
    public frames(): Frames {
        return {
            get: (): HTMLCollectionOf<HTMLIFrameElement> => {
                return this.typedElements("iframe").get();
            },
            remove: (): void => {
                const frameDivs = this.carouselInner.get().children;
                Array.from(frameDivs).forEach((div) => {
                    div.remove();
                });
                this.frameCounter = 0;
            },
            add: (site: Site | Site[]): HTMLCollectionOf<HTMLIFrameElement> => {
                const sites = Array.isArray(site) ? site : [site];
                for (const site of sites) {
                    const inner = this.carouselInner.get();
                    const frame = window.document.createElement("iframe");
                    frame.id = `${this.frameCounter.toString()}Frame`;
                    frame.className = "vh-100";
                    // Scrolling is deprecated, but there is no alternative: https://github.com/davidjbradshaw/iframe-resizer/issues/1142
                    // eslint-disable-next-line @typescript-eslint/no-deprecated
                    frame.scrolling = "no";
                    frame.src = site.url;
                    const frameDiv = window.document.createElement("div");
                    frameDiv.className = "carousel-item vh-100";
                    frameDiv.setAttribute("data-bs-interval", (site.rotationRate * 1000).toString());
                    frameDiv.id = `${this.frameCounter.toString()}FrameDiv`;
                    frameDiv.appendChild(frame);
                    inner.appendChild(frameDiv);
                    this.frameCounter += 1;
                }
                this.frames().activateFirst();
                return this.frames().get();
            },
            count: (): number => {
                return this.frames().get().length;
            },
            activateFirst: (): void => {
                const firstElement = this.carouselInner.get().children[0];
                firstElement.className += " active";
            },
            refresh: (): void => {
                const frames = this.frames().get();
                for (const frame of frames) {
                    frame.src += "";
                }
            },
        };
    }
}

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

export class MainController extends BaseController<Settings> {
    private job: NodeJS.Timer | undefined;
    public frameCounter = 0;
    protected _model: ConfigModel;
    constructor(model: ConfigModel) {
        super();
        this.addListener();
        model.listener.add(this.refreshView.bind(this));
        this._model = model;
        void this.refresh();
    }
    set config(newConfig: Settings) {
        this._model.config = newConfig;
        void this.refresh();
    }
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
    get refreshOptions(): ControllerElements {
        return this.elements("dropdown-item refreshOption");
    }
    get fullscreenButton(): ControllerElementTyped<"a"> {
        return this.typedElement("fullscreenButton", "a");
    }
    get carouselItems(): HTMLCollectionOf<Element> {
        return this.elements("carousel-item").get();
    }
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
    // This function uses many different approaches from various browsers to get fullscreen -
    // most of them don't work in this environment. No benefit in unit testing this.
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
    get carouselInner(): ControllerElementTyped<"div"> {
        return this.typedElement("myCarouselInner", "div");
    }
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
                    frame.frameBorder = "0";
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

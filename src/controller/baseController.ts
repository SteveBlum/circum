type eventFunction = (event: Event) => void;
interface IPInfo {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    readme: string;
}

const states = ["Loading", "Success", "Error", "Normal"] as const;
type State = (typeof states)[number];

/**
 * Checks if a given string is a valid state as defined by the state array (Loading, Success, Error or Normal)
 * @param value - String value to check
 * @returns Check result as boolean
 */
function containsState(value: string): boolean {
    return (
        states.find((state) => {
            return value.toLowerCase().includes(state.toLowerCase());
        }) !== undefined
    );
}

/**
 * Functions to handle HTML elements of a view as generic HTMLElements
 */
export interface ControllerElement {
    /**
     * Returns the HTML element itself
     */
    get: () => HTMLElement;
    /**
     * Adds one or multiple event handlers to a specified event
     * @param event - Event name
     * @param listener - event handler function or array of event handler functions
     * @returns Updated HTML element
     */
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLElement;
    /**
     * Removes the HTML Element
     */
    remove: () => void;
    /**
     * Activates a state for the element.
     * All child elements which contain the states name in their id will be made visible.
     * All others will be made invisible. Capitalization in the id names is ignored for this.
     * @param state - New element state
     * @param timeToNormalMS - (optional) number of milliseconds before the elements state is set to "Normal". Can be used for temporary indicators.
     */
    triggerState: (state: State, timeToNormalMS?: number) => void;
}

/**
 * Functions to handle multiple HTML elements of a view as generic HTMLElements
 */
export interface ControllerElements {
    /**
     * Returns the HTML element itself
     */
    get: () => HTMLCollectionOf<Element>;
    /**
     * Adds one or multiple event handlers to a specified event
     * @param event - Event name
     * @param listener - event handler function or array of event handler functions
     * @returns Updated HTML element
     */
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLCollectionOf<Element>;
    /**
     * Removes the HTML Element
     */
    remove: () => void;
}

/**
 * Functions to handle HTML elements of a view as their tag-specific types
 */
export interface ControllerElementTyped<K extends keyof HTMLElementTagNameMap> {
    /**
     * Returns the HTML element itself
     */
    get: () => HTMLElementTagNameMap[K];
    /**
     * Adds one or multiple event handlers to a specified event
     * @param event - Event name
     * @param listener - event handler function or array of event handler functions
     * @returns Updated HTML element
     */
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLElementTagNameMap[K];
    /**
     * Removes the HTML Element
     */
    remove: () => void;
    /**
     * Activates a state for the element.
     * All child elements which contain the states name in their id will be made visible.
     * All others will be made invisible. Capitalization in the id names is ignored for this.
     * @param state - New element state
     * @param timeToNormalMS - (optional) number of milliseconds before the elements state is set to "Normal". Can be used for temporary indicators.
     */
    triggerState: (state: State, timeToNormalMS?: number) => void;
}

/**
 * Functions to handle multiple HTML elements of a view as their tag-specific types
 */
export interface ControllerElementsTyped<K extends keyof HTMLElementTagNameMap> {
    /**
     * Returns the HTML element itself
     */
    get: () => HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    /**
     * Adds one or multiple event handlers to a specified event
     * @param event - Event name
     * @param listener - event handler function or array of event handler functions
     * @returns Updated HTML element
     */
    addListener: (
        event: string,
        listener: eventFunction | eventFunction[],
    ) => HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    /**
     * Removes the HTML Element
     */
    remove: () => void;
}

interface WakeLock {
    on: () => Promise<void>;
    off: () => Promise<void>;
    check: () => boolean;
    compatible: () => boolean;
}

/**
 * Circum-specifc base class for a controller
 */
export abstract class BaseController<T> {
    public abstract refresh(): Promise<void>;
    private ipInfoPosition: undefined | GeolocationPosition = undefined;
    protected abstract refreshView(data: T | Error): void;
    private currentWakeLock: WakeLockSentinel | undefined;
    /**
     * Exposes management functions for the HTML element with the given id
     * @param id - HTML element id
     * @returns HTML element management functions
     */
    public element(id: string): ControllerElement {
        return {
            get: (): HTMLElement => {
                const element = window.document.getElementById(id);
                if (!element) throw new Error(`Element ${id} couldn't be found`);
                return element;
            },
            addListener: (event: string, listener: eventFunction | eventFunction[]): HTMLElement => {
                return this._addListener(this.element(id).get(), listener, event);
            },
            remove: (): void => {
                const element = this.element(id).get();
                element.remove();
            },
            triggerState: (state: State, timeToNormalMS = 0): void => {
                this.triggerState(state, this.element(id).get(), timeToNormalMS);
            },
        };
    }
    /**
     * Exposes management functions for all HTML elements with the given class name
     * @param className - class name to filter HTML elements for
     * @returns HTML element management functions
     */
    public elements(className: string): ControllerElements {
        return {
            get: (): HTMLCollectionOf<Element> => {
                return document.getElementsByClassName(className);
            },
            addListener: (event: string, listener: eventFunction | eventFunction[]): HTMLCollectionOf<Element> => {
                const elements = this.elements(className).get();
                Array.from(elements).forEach((element) => {
                    this._addListener(element, listener, event);
                });
                return elements;
            },
            remove: (): void => {
                const elements = this.elements(className).get();
                Array.from(elements).forEach((element) => {
                    element.remove();
                });
            },
        };
    }
    /**
     * Exposes management functions for the tag-specifically typed HTML element with the given id
     * @param id - HTML element id
     * @param type - HTML tag type
     * @returns HTML element management functions
     */
    public typedElement<K extends keyof HTMLElementTagNameMap>(id: string, type: K): ControllerElementTyped<K> {
        return {
            get: (): HTMLElementTagNameMap[K] => {
                const elements = window.document.getElementsByTagName(type);
                const element = elements.namedItem(id);
                if (!element) {
                    throw new Error(`Element ${id}, type ${type} couldn't be found`);
                }
                return element;
            },
            addListener: (event: string, listener: eventFunction | eventFunction[]): HTMLElementTagNameMap[K] => {
                return this._addListener(this.typedElement(id, type).get(), listener, event);
            },
            remove: (): void => {
                const element = this.typedElement(id, type).get();
                element.remove();
            },
            triggerState: (state: State, timeToNormalMS = 0): void => {
                this.triggerState(state, this.typedElement(id, type).get(), timeToNormalMS);
            },
        };
    }
    /**
     * Exposes management functions for all tag-specifically typed HTML element with the given type
     * @param type - HTML tag type
     * @returns HTML element management functions
     */
    public typedElements<K extends keyof HTMLElementTagNameMap>(type: K): ControllerElementsTyped<K> {
        return {
            get: (): HTMLCollectionOf<HTMLElementTagNameMap[K]> => {
                return document.getElementsByTagName(type);
            },
            addListener: (
                event: string,
                listener: eventFunction | eventFunction[],
            ): HTMLCollectionOf<HTMLElementTagNameMap[K]> => {
                const elements = this.typedElements(type).get();
                Array.from(elements).forEach((element) => {
                    this._addListener(element, listener, event);
                });
                return elements;
            },
            remove: (): void => {
                const elements = this.typedElements(type).get();
                Array.from(elements).forEach((element) => {
                    element.remove();
                });
            },
        };
    }
    private _addListener<K extends Element>(element: K, listener: eventFunction | eventFunction[], event: string): K {
        const aListener = Array.isArray(listener) ? listener : [listener];
        aListener.forEach((listenerFunction) => {
            element.addEventListener(event, listenerFunction);
        });
        return element;
    }
    /**
     * Uses either the browser / devices geolocation API or its public IP address to determine the clients location
     */
    public getPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                },
                (err) => {
                    console.error(`Geolocation failed: ${err.message}`);
                    resolve(this.getIPPosition());
                },
                { enableHighAccuracy: true, timeout: 5000 },
            );
        });
    }
    /* istanbul ignore next */
    /**
     * Returns the response of a GET request to https://ipinfo.io/json
     */
    get ipInfo(): Promise<Response> {
        return fetch("https://ipinfo.io/json");
    }
    protected async getIPPosition(): Promise<GeolocationPosition> {
        // Due to rate limiting by IPInfo, we should do this only once
        if (this.ipInfoPosition) return this.ipInfoPosition;
        const ipInfo = await this.ipInfo
            .then(async (res) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const parsedRes = await res.json();
                BaseController.assertIsIPInfo(parsedRes);
                return parsedRes;
            })
            .catch((err: Error) => {
                console.error(`Geolocation over IP address failed: ${err.message}`);
                throw err;
            });
        this.ipInfoPosition = BaseController.ipInfoToGeolocationPosition(ipInfo);
        return this.ipInfoPosition;
    }
    private triggerState(state: State, element: HTMLElement, timeToNormalMS = 0): void {
        const children = element.children;
        Array.from(children).forEach((child) => {
            if (child.id && child.id.toLowerCase().includes(state.toLowerCase())) {
                child.removeAttribute("hidden");
            } else if (containsState(child.id)) {
                child.setAttribute("hidden", "true");
            }
        });
        if (timeToNormalMS > 0) {
            setTimeout(() => {
                this.triggerState("Normal", element);
            }, timeToNormalMS);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static assertIsIPInfo(value: any): asserts value is IPInfo {
        if (
            !("ip" in value) ||
            !("hostname" in value) ||
            !("city" in value) ||
            !("country" in value) ||
            !("loc" in value)
        ) {
            throw new Error(`Couldn't parse IP Info response`);
        }
    }
    private static ipInfoToGeolocationPosition(ipInfo: IPInfo): GeolocationPosition {
        return {
            coords: {
                accuracy: NaN,
                altitude: NaN,
                altitudeAccuracy: NaN,
                heading: NaN,
                latitude: Number(ipInfo.loc.split(",")[0]),
                longitude: Number(ipInfo.loc.split(",")[1]),
                speed: NaN,
            },
            timestamp: new Date().getTime(),
        };
    }
    /**
     * Exposes management functions to keep the screen active on mobile devices
     */
    public get wakeLock(): WakeLock {
        return {
            on: async (): Promise<void> => {
                if (!this.wakeLock.compatible()) {
                    throw new Error("The Wake Lock API is not available on this browser / device");
                }
                this.currentWakeLock = await navigator.wakeLock.request();
            },
            off: async (): Promise<void> => {
                if (this.currentWakeLock) {
                    await this.currentWakeLock.release();
                }
            },
            check: (): boolean => {
                return this.currentWakeLock && !this.currentWakeLock.released ? true : false;
            },
            compatible: (): boolean => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                return navigator.wakeLock ? true : false;
            },
        };
    }
}

type eventFunction = (event: Event) => void;
export interface ControllerElement {
    get: () => HTMLElement;
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLElement;
    remove: () => void;
}

export interface ControllerElements {
    get: () => HTMLCollectionOf<Element>;
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLCollectionOf<Element>;
    remove: () => void;
}

export interface ControllerElementTyped<K extends keyof HTMLElementTagNameMap> {
    get: () => HTMLElementTagNameMap[K];
    addListener: (event: string, listener: eventFunction | eventFunction[]) => HTMLElementTagNameMap[K];
    remove: () => void;
}

export interface ControllerElementsTyped<K extends keyof HTMLElementTagNameMap> {
    get: () => HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    addListener: (
        event: string,
        listener: eventFunction | eventFunction[],
    ) => HTMLCollectionOf<HTMLElementTagNameMap[K]>;
    remove: () => void;
}
export abstract class BaseController<T> {
    public abstract refresh(): Promise<void>;
    protected abstract refreshView(data: T | Error): void;
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
        };
    }
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
        };
    }
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
    public getPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve(position);
            });
        });
    }
}

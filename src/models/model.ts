/** (Dynamic) Type to expect in event handler functions which were added as listeners */
export type CallbackParameter<T> = Awaited<T> | Error;
/** Event handler function type for listeners */
export type Callback<T> = (data: CallbackParameter<T>) => void;
/** Function type for getting model data. Both synchronous and async functions are supported */
export type GetterFunction<T> = () => T;
/**
 * Return type for registered getter function
 * Contains expected type or Error either as Promise or direct values
 */
export type GetterFunctionReturn<T> = T extends Promise<infer P> ? Promise<P | Error> : T | Error;

interface Listener<T> {
    id: number;
    callback: Callback<T>;
}

/**
 * Basic model class for circum
 * Can either be used directly or implemented as child
 */
export class Model<T extends GetterFunction<ReturnType<T>>> {
    protected _data: GetterFunctionReturn<ReturnType<T>>;
    protected _getData: GetterFunction<ReturnType<T>>;
    public loading: Promise<void>;
    private id = 0;
    protected _listeners: Listener<ReturnType<T>>[] = [];
    public listener = {
        add: (callback: Callback<ReturnType<T>>): number => {
            this.id++;
            this._listeners.push({ id: this.id, callback: callback });
            return this.id;
        },
        remove: (id: number): void => {
            const index = this._listeners.findIndex((listener) => {
                return listener.id === id;
            });
            if (index !== -1) {
                this._listeners = this._listeners.slice(index, 1);
            }
        },
        trigger: async (): Promise<void> => {
            const data = this.data instanceof Promise ? await this.data : this.data;
            this._listeners.forEach((listener) => {
                //@ts-expect-error Because
                listener.callback(data);
            });
        },
        count: (): number => {
            return this._listeners.length;
        },
    };

    /**
     * Basic model construtor
     * @param getData - Model data getter function (sync and async is both allowed)
     * @param callback - Listener functions to trigger in case getData is overwritten. Can also be added later using setter function listener.add()
     */
    constructor(getData: T, callback?: Callback<ReturnType<T>>) {
        if (callback) {
            this.listener.add(callback);
        }
        this._getData = getData;
        this._data = this.executeGetData();
        this.loading = this.refresh();
    }
    /**
     * Retrieves result from getterFunction and triggers all registered listeners to process the result
     */
    public async refresh(): Promise<void> {
        this._data = this.executeGetData();
        return this.listener.trigger();
    }
    /**
     * Retrieves result from the getterFunction by specifically triggering it.
     * The result is cached and can be read by the data getter function at any point.
     */
    protected executeGetData(): GetterFunctionReturn<ReturnType<T>> {
        let tempData: ReturnType<T> | Error = new Error("Function wasn't executed");
        try {
            tempData = this._getData();
        } catch (err: unknown) {
            if (err instanceof Error) {
                tempData = err;
            } else {
                tempData = new Error("Unknown error occured");
            }
        }
        if (tempData instanceof Promise) {
            //@ts-expect-error Because
            return tempData.catch((err: Error) => {
                return err;
            });
        } else {
            //@ts-expect-error Because
            return tempData;
        }
    }
    /**
     * Overwrites getter function with new one and triggers refresh afterwards
     * @param getData - New getter function
     */
    set getData(getData: GetterFunction<ReturnType<T>>) {
        this._getData = getData;
        this.loading = this.refresh();
    }
    /**
     * Retrieves result from the last execution of the getter function
     * Will NOT trigger the getter function. Use executeGetData() for that
     */
    get data(): GetterFunctionReturn<ReturnType<T>> {
        return this._data;
    }
}

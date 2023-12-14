export type CallbackParameter<T> = Awaited<T> | Error;
export type Callback<T> = (data: CallbackParameter<T>) => void;
export type GetterFunction<T> = () => T;
export type GetterFunctionReturn<T> = T extends Promise<infer P> ? Promise<P | Error> : T | Error;

interface Listener<T> {
    id: number;
    callback: Callback<T>;
}

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

    constructor(getData: T, callback?: Callback<ReturnType<T>>) {
        if (callback) {
            this.listener.add(callback);
        }
        this._getData = getData;
        this._data = this.executeGetData();
        this.loading = this.refresh();
    }
    public async refresh(): Promise<void> {
        this._data = this.executeGetData();
        return this.listener.trigger();
    }
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
    set getData(getData: GetterFunction<ReturnType<T>>) {
        this._getData = getData;
        void this.refresh();
    }
    get data(): GetterFunctionReturn<ReturnType<T>> {
        return this._data;
    }
}

type Callback<T> = (data: T | Error) => void;

interface Listener<T> {
    id: number;
    callback: Callback<T>;
}

export class Model<T> {
    protected _data: Promise<Error | T>;
    protected _getData: () => Promise<T>;
    private id = 0;
    protected _listeners: Listener<T>[] = [];
    public listener = {
        add: (callback: Callback<T>): number => {
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
            const data = await this.data;
            this._listeners.forEach((listener) => {
                listener.callback(data);
            });
        },
        count: (): number => {
            return this._listeners.length;
        },
    };
    constructor(getData: () => Promise<T>, callback?: Callback<T>) {
        if (callback) {
            this.listener.add(callback);
        }
        this._getData = getData;
        this._data = this._getData().catch((err: Error) => {
            return err;
        });
        void this.listener.trigger();
    }
    public async refresh(): Promise<void> {
        this._data = this._getData();
        return this.listener.trigger();
    }
    set getData(getData: () => Promise<T>) {
        this._getData = getData;
        void this.refresh();
    }
    get data(): Promise<T | Error> {
        return this._data;
    }
}

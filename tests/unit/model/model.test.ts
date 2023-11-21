/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Model } from "../../../src/models/model";

describe("Model class", () => {
    describe("Getter and Setter", () => {
        it("Setter and getter should work for booleans", async () => {
            const getData = (): Promise<boolean> => Promise.resolve(true);
            const model = new Model(getData);
            const res = await model.data;
            expect(res).toBe(true);
        });
        it("Setter and getter should work for strings", async () => {
            const getData = (): Promise<string> => Promise.resolve("true");
            const model = new Model(getData);
            const res = await model.data;
            expect(res).toBe("true");
        });
        it("Setter and getter should work for arrays", async () => {
            const getData = (): Promise<number[]> => Promise.resolve([1, 2, 3, 4]);
            const model = new Model(getData);
            const res = await model.data;
            expect(res instanceof Error).toBe(false);
            expect((res as number[]).length).toBe(4);
            expect((res as number[])[0]).toBe(1);
        });
        it("Setter and getter should work for complex, deep objects", async () => {
            interface test {
                int: number;
                b: string[];
                bool: boolean;
            }
            const getData = (): Promise<test> => Promise.resolve({ int: 1, b: ["c", "d"], bool: true });
            const model = new Model(getData);
            const res = await model.data;
            expect(res instanceof Error).toBe(false);
            expect((res as test).int).toBe(1);
            expect((res as test).b[1]).toBe("d");
        });
    });
    describe("Listener", () => {
        let getData: () => Promise<boolean>;
        let model: Model<boolean>;
        beforeEach(() => {
            getData = (): Promise<boolean> => Promise.resolve(true);
            model = new Model(getData);
        });
        it("Listener can be registered", () => {
            const callback1 = (): void => {
                console.log("Test 1");
            };
            const callback2 = (): void => {
                console.log("Test 2");
            };
            const listenerId1 = model.listener.add(callback1);
            const listenerId2 = model.listener.add(callback2);
            expect(listenerId1).toBe(1);
            expect(listenerId2).toBe(2);
        });
        it("Listener can be counted", () => {
            const callback1 = (): void => {
                console.log("Test 1");
            };
            const callback2 = (): void => {
                console.log("Test 2");
            };
            model.listener.add(callback1);
            model.listener.add(callback2);
            expect(model.listener.count()).toBe(2);
        });
        it("Listener can be de-registered", () => {
            const callback1 = (): void => {
                console.log("Test 1");
            };
            const callback2 = (): void => {
                console.log("Test 2");
            };
            const listenerId1 = model.listener.add(callback1);
            const listenerId2 = model.listener.add(callback2);
            expect(listenerId1).toBe(1);
            expect(listenerId2).toBe(2);
            model.listener.remove(listenerId1);
            expect(model.listener.count()).toBe(1);
        });
        it("Listener trigger when data is being changed", async () => {
            const callback = jest.fn();
            model.listener.add(callback);
            model.getData = (): Promise<boolean> => Promise.resolve(false);
            await model.data;
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(false);
        });
        it("Single listener can be provided with constructor and triggers immediately", async () => {
            const getData2 = (): Promise<boolean> => Promise.resolve(true);
            const callback = jest.fn();
            const model2 = new Model(getData2, callback);
            await model2.data;
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(true);
        });
    });
    describe("data getter function", () => {
        it("Should return data", async () => {
            const getData = (): Promise<string> => Promise.resolve("success");
            const model = new Model(getData);
            expect(await model.data).toBe("success");
        });
        it("Should forward error in case that getData function threw exception", async () => {
            const getData = (): Promise<boolean> => Promise.reject(new Error("someError"));
            const model = new Model(getData);
            const res = await model.data;
            expect(res instanceof Error).toBe(true);
        });
    });
});

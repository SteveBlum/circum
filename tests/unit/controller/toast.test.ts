/* eslint-disable @typescript-eslint/no-unsafe-call */

import { CustomToast } from "../../../src/controller/Toast";

interface ToastElementDebugInfo {
    div: HTMLDivElement;
    body: HTMLDivElement;
    header: HTMLDivElement;
    headerText: HTMLElement;
    headerDetailText: HTMLElement;
}

describe("Custom Toast", () => {
    const getToastElement = (index: number): ToastElementDebugInfo => {
        const container = document.getElementById("toastContainer");
        return {
            div: container?.children[index] as HTMLDivElement,
            body: container?.children[index].children[1] as HTMLDivElement,
            header: container?.children[index].children[0] as HTMLDivElement,
            headerText: container?.children[index].children[0].children[0] as HTMLElement,
            headerDetailText: container?.children[index].children[0].children[1] as HTMLElement,
        };
    };
    beforeEach(() => {
        document.body.innerHTML = "";
    });
    describe("constructor", () => {
        it("Toast gets added with all header and body parts", () => {
            const sample = {
                message: "Some message",
                headerText: "A header text",
                headerDetailText: "An optional header detail",
            };
            new CustomToast("info", sample.message, sample.headerText, sample.headerDetailText);
            const toastDebugInfo = getToastElement(0);
            expect(toastDebugInfo.body.innerText).toBe(sample.message);
            expect(toastDebugInfo.headerText.innerText).toBe(sample.headerText);
            expect(toastDebugInfo.headerDetailText.innerText).toBe(sample.headerDetailText);
        });
        it("Header detail text is optional", () => {
            const sample = {
                message: "Some message",
                headerText: "A header text",
            };
            new CustomToast("info", sample.message, sample.headerText);
            const toastDebugInfo = getToastElement(0);
            expect(toastDebugInfo.headerDetailText.innerText).toBe("");
        });
        it("Toasts of all types are created with their respective color scheme", () => {
            const sample = {
                message: "Some message",
                headerText: "A header text",
            };
            new CustomToast("info", sample.message, sample.headerText);
            new CustomToast("warning", sample.message, sample.headerText);
            new CustomToast("error", sample.message, sample.headerText);
            new CustomToast("success", sample.message, sample.headerText);
            const infoToastDebugInfo = getToastElement(0);
            const warningToastDebugInfo = getToastElement(1);
            const errorToastDebugInfo = getToastElement(2);
            const successToastDebugInfo = getToastElement(3);
            expect(infoToastDebugInfo.body.className).toContain("bg-dark");
            expect(warningToastDebugInfo.body.className).toContain("bg-warning");
            expect(errorToastDebugInfo.body.className).toContain("bg-danger");
            expect(successToastDebugInfo.body.className).toContain("bg-success");
        });
    });
});

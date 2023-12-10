import * as bootstrap from "bootstrap";

interface ToastContainer {
    element: HTMLDivElement;
    add: (toast: HTMLDivElement) => void;
}

const MessageTypeMetadata = {
    info: {
        backgroundclass: "bg-dark bg-gradient",
        textclass: "text-light",
    },
    warning: {
        backgroundclass: "bg-warning bg-gradient",
        textclass: "text-dark",
    },
    error: {
        backgroundclass: "bg-danger bg-gradient",
        textclass: "text-light",
    },
    success: {
        backgroundclass: "bg-success bg-gradient",
        textclass: "text-light",
    },
};

type MessageType = keyof typeof MessageTypeMetadata;

export class CustomToast {
    private toastContainerName = "toastContainer";
    private toast: HTMLDivElement;
    private toastAdded = false;
    constructor(type: MessageType, message: string, header: string, headerDetail?: string) {
        this.toast = this.assemble(
            this.createDiv(type),
            this.createHeader(type, header, headerDetail),
            this.createBody(type, message),
        );
        this.show();
    }

    protected assemble(div: HTMLDivElement, header: HTMLDivElement, body: HTMLDivElement): HTMLDivElement {
        div.appendChild(header);
        div.appendChild(body);
        return div;
    }

    private get containerDiv(): ToastContainer {
        const elements = window.document.getElementsByTagName("div");
        let element = elements.namedItem(this.toastContainerName);
        if (!element) {
            element = document.createElement("div");
            element.id = this.toastContainerName;
            element.className = "toast-container position-fixed bottom-0 end-0 p-3";
            document.body.appendChild(element);
        }
        return {
            element: element,
            add: (toast: HTMLDivElement): void => {
                this.containerDiv.element.appendChild(toast);
            },
        };
    }

    protected createDiv(type: MessageType): HTMLDivElement {
        const element = document.createElement("div");
        element.className = "toast";
        element.role = "alert";
        element.ariaLive = "assertive";
        element.ariaAtomic = "Close";
        if (type === "error") {
            element.setAttribute("data-bs-autohide", "false");
        }
        return element;
    }

    protected createBody(type: MessageType, message: string): HTMLDivElement {
        const element = document.createElement("div");
        element.className = `toast-body ${MessageTypeMetadata[type].backgroundclass} ${MessageTypeMetadata[type].textclass}`;
        element.innerText = message;
        return element;
    }

    protected createHeader(type: MessageType, text: string, detailText?: string): HTMLDivElement {
        const element = document.createElement("div");
        element.className = `toast-header ${MessageTypeMetadata[type].backgroundclass} ${MessageTypeMetadata[type].textclass}`;
        const textElement = document.createElement("strong");
        textElement.className = "me-auto";
        textElement.innerText = text;
        const detailElement = document.createElement("small");
        detailElement.innerText = detailText ? detailText : "";
        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "btn-close";
        closeButton.ariaLabel = "Close";
        closeButton.setAttribute("data-bs-dismiss", "toast");
        element.appendChild(textElement);
        element.appendChild(detailElement);
        element.appendChild(closeButton);
        return element;
    }

    public show(): void {
        if (!this.toastAdded) {
            this.containerDiv.add(this.toast);
            this.toastAdded = true;
        }
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toast);
        toastBootstrap.show();
    }
}

import { ConfigModel, Settings } from "../models/Config";
import { CustomToast } from "./Toast";
import { BaseController, ControllerElementTyped } from "./baseController";

/**
 * Controller for the settings popup of circum, belongs to src/views/partials/Settings.html
 */
export class SettingsPopupController extends BaseController<Settings> {
    protected _model: ConfigModel;
    protected unsavedConfig: Settings;
    public loading: Promise<void>;
    /**
     * In addition to regular controller activities, will create a copy of the applied configuration as unsaved configuration
     * @param model - Instance of the configuration model, used to get settings
     */
    constructor(model: ConfigModel) {
        super();
        this.addListener();
        model.listener.add(this.refreshView.bind(this));
        this._model = model;
        this.unsavedConfig = structuredClone(this.config);
        this.loading = this.refresh();
    }
    /**
     * Overwrites the config within the registered config model instance, which will automatically also trigger a refresh
     * The new configuration is also saved to local storage
     * Shorthand for setting this._model.config
     */
    set config(newConfig: Settings) {
        this._model.config = newConfig;
        this.loading = this._model.loading;
        this._model.save();
    }
    /**
     * Returns the configuration stored within the registered config model instance without changes
     * Shorthand for getting this._model.config
     */
    get config(): Settings {
        return this._model.config;
    }
    protected addListener(): void {
        this.modal.addListener("show.bs.modal", () => {
            this.refreshView(this.unsavedConfig);
        });
        this.refreshRateSlider.addListener("load", (event) => {
            const target = event.target as HTMLInputElement;
            this.unsavedConfig.refreshRate = parseInt(target.value);
            this.refreshView(this.unsavedConfig);
        });
        this.refreshRateSlider.addListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            this.unsavedConfig.refreshRate = parseInt(target.value);
            this.refreshView(this.unsavedConfig);
        });
        this.rotationRateSlider.addListener("load", (event) => {
            const target = event.target as HTMLInputElement;
            this.unsavedConfig.rotationRate = parseInt(target.value);
            this.refreshView(this.unsavedConfig);
        });
        this.rotationRateSlider.addListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            this.unsavedConfig.rotationRate = parseInt(target.value);
            this.refreshView(this.unsavedConfig);
        });
        this.addFrameButton.addListener("click", () => {
            this.unsavedConfig.sites.push({ url: "", rotationRate: this.config.rotationRate });
            this.refreshView(this.unsavedConfig);
        });
        this.discardConfigButton.addListener("click", () => {
            this.unsavedConfig = structuredClone(this.config);
        });
        this.saveConfigButton.addListener("click", () => {
            this.config = structuredClone(this.unsavedConfig);
        });
        this.importConfigButton.addListener("click", () => {
            this.importConfigInput.get().click();
        });
        this.importConfigInput.addListener("change", (event) => {
            const timeToNormalError = 30000;
            const timeToNormalSuccess = 10000;
            const target = event.target as HTMLInputElement;
            this.importConfigButton.triggerState("Loading");
            if (!target.files || target.files.length !== 1) {
                this.importConfigButton.triggerState("Error", timeToNormalError);
                return;
            }
            this.loading = target.files[0]
                .text()
                .then((rawConfig) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const config = JSON.parse(rawConfig);
                    ConfigModel.assertIsSettings(config);
                    this.unsavedConfig = structuredClone(config);
                    this.config = structuredClone(config);
                    this.refreshView(this.unsavedConfig);
                    this.importConfigButton.triggerState("Success", timeToNormalSuccess);
                    new CustomToast("success", "Import of settings was successful", "Settings import", "Success");
                })
                .catch((err: Error) => {
                    console.error(err.message);
                    new CustomToast(
                        "error",
                        "The uploaded file doesn't contain the expected settings structure. Use the settings Export to get a correct template.",
                        "Settings import",
                        "Error occured",
                    );
                    this.importConfigButton.triggerState("Error", timeToNormalError);
                });
        });
        this.useGlobalRotationRateCheckBox.addListener("click", () => {
            this.unsavedConfig.useGlobalRotationRate = !this.unsavedConfig.useGlobalRotationRate;
            this.unsavedConfig.sites.forEach((site) => {
                site.rotationRate = this.unsavedConfig.rotationRate;
            });
            this.refreshView(this.unsavedConfig);
        });
        this.wakeLockCheckBox.addListener("click", () => {
            // = if we are currently trying to activate the wake lock, since it's not already engaged
            if (!this.unsavedConfig.wakeLock && !this.wakeLock.compatible()) {
                this.wakeLockCheckBox.get().checked = false;
                this.wakeLockCheckBox.get().disabled = true;
                new CustomToast(
                    "error",
                    "The Wake Lock API is not available on your browser or device - the screen can not be kept on automatically",
                    "Keep screen active",
                    "Error occured",
                );
            } else {
                this.unsavedConfig.wakeLock = !this.unsavedConfig.wakeLock;
            }
        });
    }
    /**
     * Updates all UI components controlled by this controller based on the given configuration
     * @param data - Configuration to display. If an Error is provided instead, it will be thrown.
     */
    public refreshView(data: Settings | Error): void {
        if (data instanceof Error) throw data;
        this.updateRefreshRate();
        this.updateUseGlobalRotationRate();
        this.updateRotationRate();
        this.updateFrameItems();

        const data_string = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        this.exportConfigButton.get().setAttribute("href", data_string);
    }
    private updateUseGlobalRotationRate(): void {
        this.useGlobalRotationRateCheckBox.get().checked = this.unsavedConfig.useGlobalRotationRate;
    }
    private updateFrameItems(): void {
        const newBody = document.createElement("tbody");
        this.unsavedConfig.sites.forEach((site, index) => {
            const row = newBody.insertRow(-1);
            row.id = `frame${index.toString()}`;
            const urlCell = row.insertCell(this.getTableColumnIndex("frameUrlHeader"));
            urlCell.id = `frame${index.toString()}-url`;
            urlCell.className = "pt-3-half urlCell";
            urlCell.contentEditable = "true";
            urlCell.textContent = site.url;
            urlCell.addEventListener("input", (event) => {
                const target = event.target as HTMLTableCellElement;
                let index = Array.from(this.frameTable.get().rows).findIndex((row) => {
                    // Due to the way this cell is added, it always has a parentElement
                    /* istanbul ignore next */
                    return row.id === target.parentElement?.id;
                });
                if (!target.textContent) {
                    return;
                }
                // We need to substract 1 from the index since the "header row" of the table counts as first row
                index -= 1;
                this.unsavedConfig.sites[index].url = target.textContent;
            });
            const rotationRateCell = row.insertCell(this.getTableColumnIndex("frameRotationRateHeader"));
            rotationRateCell.id = `frame${index.toString()}-rotationRate`;
            rotationRateCell.className = "pt-3-half";
            rotationRateCell.contentEditable = "true";
            rotationRateCell.textContent = site.rotationRate.toString();
            rotationRateCell.addEventListener("input", (event) => {
                const target = event.target as HTMLTableCellElement;
                let index = Array.from(this.frameTable.get().rows).findIndex((row) => {
                    // Due to the way this cell is added, it always has a parentElement
                    /* istanbul ignore next */
                    return row.id === target.parentElement?.id;
                });
                if (!target.textContent) {
                    return;
                }
                // We need to substract 1 from the index since the "header row" of the table counts as first row
                index -= 1;
                this.unsavedConfig.sites[index].rotationRate = parseInt(target.textContent);
            });
            rotationRateCell.hidden = this.unsavedConfig.useGlobalRotationRate;
            const statusCell = row.insertCell(this.getTableColumnIndex("frameStatusHeader"));
            statusCell.id = `frame${index.toString()}-status`;
            statusCell.className = "pt-3-half";
            statusCell.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
            const moveCell = row.insertCell(this.getTableColumnIndex("frameMoveHeader"));
            moveCell.id = `frame${index.toString()}-move`;
            moveCell.className = "pt-3-half";
            const moveUpButton = document.createElement("button");
            moveUpButton.id = `frame${index.toString()}-moveUpButton`;
            const moveUpIcon = document.createElement("i");
            moveUpIcon.id = `frame${index.toString()}-moveUpIcon`;
            moveUpIcon.className = "bi bi-arrow-up indigo-text";
            moveUpButton.appendChild(moveUpIcon);
            const moveDownButton = document.createElement("button");
            moveDownButton.id = `frame${index.toString()}-moveDownButton`;
            const moveDownIcon = document.createElement("i");
            moveDownIcon.id = `frame${index.toString()}-moveDownIcon`;
            moveDownIcon.className = "bi bi-arrow-down indigo-text";
            moveDownButton.appendChild(moveDownIcon);
            moveUpButton.addEventListener("click", (event) => {
                const target = event.currentTarget as HTMLAnchorElement;
                let index = Array.from(this.frameTable.get().rows).findIndex((row) => {
                    // Due to the way this cell is added, it always has a parentElement
                    /* istanbul ignore next */
                    return row.id === target.parentElement?.parentElement?.id;
                });
                // We need to substract 1 from the index since the "header row" of the table counts as first row
                index -= 1;
                // if we are already at the top, or if there is only one item, than we are done here
                if (index <= 0 || this.unsavedConfig.sites.length < 2) {
                    return;
                }
                [this.unsavedConfig.sites[index - 1], this.unsavedConfig.sites[index]] = [
                    this.unsavedConfig.sites[index],
                    this.unsavedConfig.sites[index - 1],
                ];
                this.refreshView(this.unsavedConfig);
            });
            moveDownButton.addEventListener("click", (event) => {
                const target = event.currentTarget as HTMLAnchorElement;
                let index = Array.from(this.frameTable.get().rows).findIndex((row) => {
                    // Due to the way this cell is added, it always has a parentElement
                    /* istanbul ignore next */
                    return row.id === target.parentElement?.parentElement?.id;
                });
                // We need to substract 1 from the index since the "header row" of the table counts as first row
                index -= 1;
                // if we are already at the bottom, or if there is only one item, than we are done here
                if (index >= this.unsavedConfig.sites.length - 1 || this.unsavedConfig.sites.length < 2) {
                    return;
                }
                [this.unsavedConfig.sites[index], this.unsavedConfig.sites[index + 1]] = [
                    this.unsavedConfig.sites[index + 1],
                    this.unsavedConfig.sites[index],
                ];
                this.refreshView(this.unsavedConfig);
            });
            moveCell.appendChild(moveUpButton);
            moveCell.appendChild(moveDownButton);
            const removeCell = row.insertCell(this.getTableColumnIndex("frameRemoveHeader"));
            removeCell.id = `frame${index.toString()}-remove`;
            removeCell.className = "pt-3-half";
            const removeButton = document.createElement("button");
            removeButton.id = `frame${index.toString()}-removeButton`;
            removeButton.className = "btn btn-danger btn-rounded btn-sm my-0";
            removeButton.innerText = "Remove";
            removeButton.addEventListener("click", (event) => {
                const target = event.currentTarget as HTMLButtonElement;
                let index = Array.from(this.frameTable.get().rows).findIndex((row) => {
                    // Due to the way this cell is added, it always has a parentElement
                    /* istanbul ignore next */
                    return row.id === target.parentElement?.parentElement?.id;
                });
                // We need to substract 1 from the index since the "header row" of the table counts as first row
                index -= 1;
                this.unsavedConfig.sites.splice(index, 1);
                this.refreshView(this.unsavedConfig);
            });
            removeCell.appendChild(removeButton);
        });
        const table = this.frameTable.get();
        table.tBodies[0].replaceWith(newBody);
    }
    /**
     * Triggers all listeners registered for the config model
     * Shorthand for this._model.refresh()
     */
    public async refresh(): Promise<void> {
        return this._model.refresh();
    }
    /** Returns the table which contains all websites to display as iframes */
    get frameTable(): ControllerElementTyped<"table"> {
        return this.typedElement("frameTable", "table");
    }
    /** Returns button which adds a new line to the iframe settings table */
    get addFrameButton(): ControllerElementTyped<"button"> {
        return this.typedElement("addFrameButton", "button");
    }
    /** Returns button to save the configuration */
    get saveConfigButton(): ControllerElementTyped<"button"> {
        return this.typedElement("saveConfigButton", "button");
    }
    /** Returns the checkbox to use the global rotation rate */
    get useGlobalRotationRateCheckBox(): ControllerElementTyped<"input"> {
        return this.typedElement("useGlobalRotationRateCheckBox", "input");
    }
    /** Returns the global rotation rate header element */
    get frameRotationRateHeader(): ControllerElementTyped<"th"> {
        return this.typedElement("frameRotationRateHeader", "th");
    }
    /** Returns the div containing the global rotation rate elements */
    get rotationRateDiv(): ControllerElementTyped<"div"> {
        return this.typedElement("rotationRateDiv", "div");
    }
    /** Returns the button to discard unsaved changes to the configuration */
    get discardConfigButton(): ControllerElementTyped<"button"> {
        return this.typedElement("discardConfigButton", "button");
    }
    /** Returns the popup (modal) */
    get modal(): ControllerElementTyped<"div"> {
        return this.typedElement("settings", "div");
    }
    /** Returns refresh rate slider element */
    get refreshRateSlider(): ControllerElementTyped<"input"> {
        return this.typedElement("refreshRateSlider", "input");
    }
    /** Returns global rotation rate slider element */
    get rotationRateSlider(): ControllerElementTyped<"input"> {
        return this.typedElement("rotationRateSlider", "input");
    }
    /** Returns refresh rate text element */
    get refreshRateText(): HTMLParagraphElement {
        return this.typedElement("refreshRate", "p").get();
    }
    /** Returns the global rotation rate text element */
    get rotationRateText(): HTMLParagraphElement {
        return this.typedElement("rotationRate", "p").get();
    }
    /** Returns button to export the configuraton */
    get exportConfigButton(): ControllerElementTyped<"a"> {
        return this.typedElement("exportConfigButton", "a");
    }
    /** Returns button to import the configuraton */
    get importConfigButton(): ControllerElementTyped<"button"> {
        return this.typedElement("importConfigButton", "button");
    }
    /** Returns the hidden input element to import the configuration */
    get importConfigInput(): ControllerElementTyped<"input"> {
        return this.typedElement("importConfigInput", "input");
    }
    /** Returns button the checkbox to keep the screen active */
    get wakeLockCheckBox(): ControllerElementTyped<"input"> {
        return this.typedElement("wakeLockCheckBox", "input");
    }
    private updateRefreshRate(): void {
        const value = this.unsavedConfig.refreshRate;
        this.refreshRateText.innerText = value.toString();
        this.refreshRateSlider.get().value = value.toString();
    }
    private updateRotationRate(): void {
        const value = this.unsavedConfig.rotationRate;
        this.rotationRateText.innerText = value.toString();
        this.rotationRateSlider.get().value = value.toString();
        this.rotationRateDiv.get().hidden = !this.unsavedConfig.useGlobalRotationRate;
        this.frameRotationRateHeader.get().hidden = this.unsavedConfig.useGlobalRotationRate;
        if (this.unsavedConfig.useGlobalRotationRate) {
            this.unsavedConfig.sites.forEach((site) => {
                site.rotationRate = this.unsavedConfig.rotationRate;
            });
        }
    }
    protected getTableColumnIndex(headerId: string): number {
        const headerCell = this.typedElement(headerId, "th").get();
        const headerRow = headerCell.parentElement;
        if (!headerRow) {
            throw new Error(`No parent found for header cell ${headerId}`);
        }
        const headers = Array.from(headerRow.children);
        return headers.findIndex((header) => {
            return header.id === headerId;
        });
    }
}

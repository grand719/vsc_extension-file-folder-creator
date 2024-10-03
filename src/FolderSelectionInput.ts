import { QuickPickItem, window } from "vscode";
import {
  createQuickPickFoldersItems,
  createQuickPickItems,
  getWorkspacePaths,
  Stack,
} from "./utils";
import { FileCreationInput } from "./FileCreationInput";

const enum CreationOptions {
  GO_BACK = "../",
  FOLDER_CREATION_DONE = "Done",
  BLANK = "----------------------------------",
}

const joinPath = (data: string[]) => {
  return data.join("/");
};

export class FolderSelectionInput {
  private static instance?: FolderSelectionInput;
  private quickPickInstance;
  private fileCreationInputInstance;
  private selectedInitialFolder?: string;

  private folderPath = new Stack<string>([], joinPath);

  private creationOptions = [
    CreationOptions.FOLDER_CREATION_DONE,
    CreationOptions.BLANK,
    CreationOptions.GO_BACK,
  ];

  private initialPathCreationOptions = [
    CreationOptions.FOLDER_CREATION_DONE,
    CreationOptions.BLANK,
  ];

  private constructor() {
    this.quickPickInstance = window.createQuickPick();
    this.fileCreationInputInstance = new FileCreationInput();

    const workspacePaths = getWorkspacePaths();

    if (typeof workspacePaths === "string") {
      this.selectedInitialFolder = workspacePaths;
      this.initQuickPickInitialState();
    } else if (workspacePaths && typeof workspacePaths.length) {
      window
        .showQuickPick(createQuickPickItems(workspacePaths), {
          placeHolder: "Select the workspace folder",
        })
        .then(selectedPath => {
          this.selectedInitialFolder = selectedPath?.label || "";
          this.initQuickPickInitialState();
        });
    } else {
      this.selectedInitialFolder = "";
      window.showErrorMessage("No workspace folders found");
    }
  }

  public openQuickPick() {
    this.quickPickInstance.show();
  }
  private initQuickPickInitialState = () => {
    this.updateQuickPickItems();
    this.registerQuickPickListeners();
    this.openQuickPick();
  };
  private registerQuickPickListeners = () => {
    this.quickPickInstance.onDidChangeSelection(this.onDidChangeSelection);
    this.quickPickInstance.onDidHide(this.onDidHide);
  };

  private updateQuickPickItems = () => {
    this.updatePlaceHolder();
    if (this.selectedInitialFolder) {
      this.quickPickInstance.items = createQuickPickFoldersItems(
        this.selectedInitialFolder + "/" + this.folderPath.toString(),
        this.folderPath.length === 0
          ? this.initialPathCreationOptions
          : this.creationOptions,
      );
    } else {
      this.quickPickInstance.items = createQuickPickItems(this.creationOptions);
    }
  };

  private onDidHide = () => {
    FolderSelectionInput.instance = undefined;
  };

  private updatePlaceHolder = () => {
    this.quickPickInstance.placeholder = `Current path: ${this.folderPath.toString()}`;
  };

  private handleCreationSteps(value?: string) {
    switch (value) {
      case CreationOptions.GO_BACK:
        this.folderPath.pop();
        this.updateQuickPickItems();
        return undefined;
      case CreationOptions.FOLDER_CREATION_DONE:
        this.onDonePressed();
        return undefined;
      case CreationOptions.BLANK:
        break;
      default:
        return value;
    }
  }

  private onDonePressed = () => {
    this.quickPickInstance.hide();
    this.fileCreationInputInstance.openInput(
      this.selectedInitialFolder + "/" + this.folderPath.toString(),
    );
  };

  private onDidChangeSelection = (event: readonly QuickPickItem[]) => {
    const selectedItem = event[0].label;
    const value = this.handleCreationSteps(selectedItem);
    if (value) {
      this.folderPath.push(value);
      this.updateQuickPickItems();
    }
  };

  public static getInstance() {
    if (!FolderSelectionInput.instance) {
      FolderSelectionInput.instance = new FolderSelectionInput();
    }

    return FolderSelectionInput.instance;
  }

  public getQuickPickInstance() {
    return this.quickPickInstance;
  }
}

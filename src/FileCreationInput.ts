import { InputBox, window } from "vscode";
import {
  createFiles,
  createQuickPickItems,
  getCurrentPath,
  getWorkspacePaths,
  prepareFileCreationData,
} from "./utils";

export class FileCreationInput {
  private inputInstance: InputBox;
  private selectedFolder?: string;
  private workspacePath?: string;
  private currentFilePath?: string;
  private inputValue?: string;

  constructor() {
    this.inputInstance = window.createInputBox();
  }

  public openInput = async (selectedFolder?: string) => {
    if (!selectedFolder) {
      const shouldBrake = await this.preparePaths();

      if (shouldBrake) {
        return Promise.reject("No workspace and current file folder found");
      }
      this.selectedFolder = this.currentFilePath ?? this.workspacePath;
    } else {
      this.selectedFolder = selectedFolder;
    }
    this.initInput();
    this.inputInstance.show();
  };

  private preparePaths = async () => {
    this.currentFilePath = getCurrentPath();
    if (!this.currentFilePath) {
      this.workspacePath = await this.setupInitialWorkspaceFolder();
    }
    if (!this.workspacePath && !this.currentFilePath) {
      window.showErrorMessage("No workspace and current file folder found");
      return true;
    }
  };

  private setupInitialWorkspaceFolder = async () => {
    const workspacePaths = getWorkspacePaths();

    if (typeof workspacePaths === "string") {
      return workspacePaths;
    } else if (workspacePaths && typeof workspacePaths.length) {
      const selectedPath = await window.showQuickPick(
        createQuickPickItems(workspacePaths),
        {
          placeHolder: "Select the workspace folder",
        },
      );
      return selectedPath ? selectedPath.label : undefined;
    } else {
      return undefined;
    }
  };

  private initInput = () => {
    this.inputInstance.placeholder = `Current folder: ${this.selectedFolder}`;
    this.registerInputListeners();
  };

  private registerInputListeners = () => {
    this.inputInstance.onDidAccept(this.onAccept);
    this.inputInstance.onDidChangeValue(this.onDidChangeValue);
  };

  private onAccept = () => {
    if (!this.inputValue || !this.selectedFolder) {
      window.showErrorMessage("Please provide a file name");
      return;
    }

    const data = prepareFileCreationData(this.inputValue);

    if (!data) {
      window.showErrorMessage("Invalid file name");
      return;
    }

    this.inputInstance.busy = true;
    createFiles(this.selectedFolder, data)
      .catch(error => {
        window.showErrorMessage(error.message);
      })
      .then(() => {
        this.inputInstance.value = "";
      })
      .finally(() => {
        this.inputInstance.busy = false;
      });
  };

  private onDidChangeValue = (value: string) => {
    this.inputValue = value;
  };
}

import * as vscode from "vscode";
import { FolderSelectionInput } from "./FolderSelectionInput";
import { FileCreationInput } from "./FileCreationInput";
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "file-creator.createInSelectedFolder",
    () => {
      FolderSelectionInput.getInstance();
    },
  );

  const disposable2 = vscode.commands.registerCommand(
    "file-creator.createInCurrentFolder",
    () => {
      const fileCreationInput = new FileCreationInput();
      fileCreationInput.openInput();
    },
  );

  context.subscriptions.push(disposable, disposable2);
}

export function deactivate() {}

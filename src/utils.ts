import * as fs from "fs";
import * as vscode from "vscode";

export const getWorkspacePaths = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return undefined;
  }
  if (workspaceFolders.length === 1) {
    return workspaceFolders[0].uri.fsPath;
  }

  return workspaceFolders.map((folder) => folder.uri.fsPath);
};

export const getCurrentPath = () => {
  const activeEditor = vscode.window.activeTextEditor;

  if (!activeEditor) {
    return undefined;
  }

  const document = activeEditor.document;
  return document.uri.fsPath.replace(/[^\/]*$/, "");
};

const getFolderContent = (folderPath: string) => {
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((directory) => directory.name);
};

export const createQuickPickItems = (folders: string[]) => {
  return folders.map((folder) => ({
    label: folder,
  }));
};

export const createQuickPickFoldersItems = (
  pathToFolder: string,
  additionalParams?: string[]
) => {
  const folderContent = [
    ...(additionalParams ? additionalParams : []),
    ...getFolderContent(pathToFolder),
  ];
  return createQuickPickItems(folderContent);
};

export class Stack<T> {
  private stack: T[] = [];

  constructor(
    initialValues: T[] = [],
    private overrideToStringFn?: (value: T[]) => string
  ) {
    this.stack.push(...initialValues);
  }

  push(value: T) {
    this.stack.push(value);
  }

  pop() {
    return this.stack.pop();
  }

  get length() {
    return this.stack.length;
  }

  toString = () => {
    return this.overrideToStringFn
      ? this.overrideToStringFn(this.stack)
      : this.stack.join(", ");
  };
}

export const prepareFileCreationData = (dataString: string) => {
  const object: Record<string, string[]> = {};

  const paths = dataString.split(";");

  for (const data of paths) {
    const splitData = data.split(/\/(?!.*\/)/);

    const isInvalid = splitData.some((value) => value === "");

    if (splitData.length !== 2) {
      object["."] = data.split(",");
    } else if (splitData.length === 2 && isInvalid) {
      const [key, _value] = data.split(/\/(?!.*\/)/);
      object[key] = [];
    } else {
      const [key, value] = data.split(/\/(?!.*\/)/);
      object[key] = value.split(",");
    }
  }

  return object;
};

const mkdirAsync = (
  path: string,
  options?: fs.MakeDirectoryOptions | fs.Mode
) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, options, (err) => {
      if (err) {
        reject(err);
      }
      resolve(undefined);
    });
  });
};

const writeFileAsync = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, "", (err) => {
      if (err) {
        reject(err);
      }
      resolve(undefined);
    });
  });
};

export const createFiles = async (
  corePath: string,
  data: Record<string, string[]>
) => {
  for (const [folder, files] of Object.entries(data)) {
    console.log(folder, files);
    const folderPath = `${corePath}/${folder === "." ? "" : folder}`;
    try {
      await mkdirAsync(folderPath, { recursive: true });
      if (files.length !== 0) {
        const promises = files.map((file) => {
          return writeFileAsync(`${folderPath}/${file}`);
        });

        await Promise.all(promises);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating folder: ${folderPath}, Files: ${files}`);
    }
  }
};

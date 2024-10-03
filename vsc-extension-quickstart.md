# File/Folder Creator

## Features

- **Multi-Step Input Flow**: Guide users through a series of prompts to collect information for file creation.
- **Workspace Folder Selection**: Allows users to select a workspace folder for file creation.
- **File Name Input**: Prompts users to input the name of the file to be created.
- **Automatic Directory Creation**: Ensures that necessary directories are created before creating files.
- **Support for Multiple Files and Folders**: Create multiple files and folders in a specified directory.

## Usage

### Creating Multiple Files

To create multiple files, you can specify the file paths separated by commas. For example:

- **Example 1**: Creating multiple files in the same directory: <br>
```file1.txt, file2.txt, file3.txt```
> **Note**: Any new file should be separated with comma.
- **Example 2**: Creating multiple files in different directories. <br>
```path/to/folder1/file1.txt ; path/to/folder2/file2.txt ; path/to/folder3/file3.txt```
> **Note**: Any new path should be separated with semicolon.

## Requirements

- Visual Studio Code v1.50.0 or higher
- Node.js v12.0.0 or higher

## Known Issues

- None reported at the moment. Please report any issues on the [GitHub repository](https://github.com/grand719/vscode-file-folder-creator).

## Release Notes

### 1.0.0

- Initial release with basic file creation functionality.

## Following Extension Guidelines

This extension follows the [Visual Studio Code extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines) to ensure a consistent and high-quality user experience.

## For More Information

- [Visual Studio Code API](https://code.visualstudio.com/api)
- [Node.js Documentation](https://nodejs.org/en/docs/)

**Enjoy!**
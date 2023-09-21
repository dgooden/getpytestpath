# getpytestpath README

## Features
vscode extension that adds a command and context menu `Get pytest path` and `Get pytest path with prefix` to get the full path to a pytest function and adds it to the clipboard. Useful for pasting to the command line or if running tests via `Run and Debug`

![context_menu](https://github.com/dgooden/getpytestpath/assets/353080/5e2431de-b604-47e7-8b19-219eb89b2d57)


Just right click on the function name of the test you want to run:

![select_function](https://github.com/dgooden/getpytestpath/assets/353080/f432c85a-8fb8-487a-a1be-b0e7f80aec57)


Path format with class:

`<path_to_test_file_from_root_of_project>::<class_name>::<test_function>`

Example: `tests/test_file.py::test_class_name::test_function_name`

Path format without class:

`<path_to_test_file_from_root_of_project>::<test_function>`

Example: `tests/test_file.py::test_function_name`

## Prefix:
You can set a prefix in the settings:

![settings_prefix_good](https://github.com/dgooden/getpytestpath/assets/353080/fd44ee63-cece-4d64-aa75-6557d60e8185)

If you choose the `Get pytest path with prefix` command the prefix you set will be prepended to the path.

## Installation

Install vsce:

`npm install -g @vscode/vsce`

In the root of the this repo, run:

`vsce package`

This will create a .vsix file that can be imported into vscode

## Known issues

Will most probably not work in a file with sub classes, as it looks backwards from the function to find the class it's a part of.

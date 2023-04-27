# getpytestpath README

## Features
vscode extension that adds a command and context menu `Get pytest path` to get the full path to a pytest function and adds it to the clipboard. Useful for pasting to the command line or if running tests via `Run and Debug`

![Screen Shot 2023-04-09 at 10 03 52 AM](https://user-images.githubusercontent.com/353080/230777363-84d66109-41f3-4f48-8fa1-f3b91a9a2263.png)

Just right click on the function name of the test you want to run:

![Screen Shot 2023-04-27 at 3 48 41 PM](https://user-images.githubusercontent.com/353080/234975363-c65eeb7f-ef53-4bcc-a382-96d0c19ed114.png)

Path format with class:

`<path_to_test_file_from_root_of_project>::<class_name>::<test_function>`

Example: `tests/test_file.py::test_class_name::test_function_name`

Path format without class:

`<path_to_test_file_from_root_of_project>::<test_function>`

Example: `tests/test_file.py::test_function_name`

## Installation

Install vsce:

`npm install -g @vscode/vsce`

In the root of the this repo, run:

`vsce package`

This will create a .vsix file that can be imported into vscode

## Known issues

Will most probably not work in a file with sub classes, as it looks backwards from the function to find the class it's a part of.

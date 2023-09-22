# getpytestpath README

## Features
vscode extension that adds a few commands and context menus to get the path to a pytest/unittest function and add it to the clipboard. 

Useful for pasting to the command line or if running tests via `Run and Debug`

![context](https://github.com/dgooden/getpytestpath/assets/353080/8c1fddc8-ef3c-43b6-a156-42e8b4c76fae)

Just right click on the function name of the test you want to run and choose the appropriate option:

![select](https://github.com/dgooden/getpytestpath/assets/353080/de63b0b5-4e45-437f-89a8-e2f87ae82e71)

## With path

Path format with class:

`<path_to_test_file_from_root_of_project>::<class_name>::<test_function>`

Example: `tests/test_file.py::test_class_name::test_function_name`

Path format without class:

`<path_to_test_file_from_root_of_project>::<test_function>`

Example: `tests/test_file.py::test_function_name`

## No path
format with class:

`::<class_name>::<test_function>`

Example: `::test_class_name::test_function_name`

Format without class:

`<::<test_function>`

Example: `::test_function_name`

## Prefix:
You can set a prefix in the settings:

![settings_prefix_good](https://github.com/dgooden/getpytestpath/assets/353080/fd44ee63-cece-4d64-aa75-6557d60e8185)

If you choose the `Get test name with path with prefix` command the prefix you set will be prepended to the path.

## Installation

Install vsce:

`npm install -g @vscode/vsce`

In the root of the this repo, run:

`vsce package`

This will create a .vsix file that can be imported into vscode

## Known issues

Will most probably not work in a file with sub classes, as it looks backwards from the function to find the class it's a part of.

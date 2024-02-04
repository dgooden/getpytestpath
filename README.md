# getpytestpath README

## Features
vscode extension that adds a few commands and context menus to run a test automatically, or to get the path to a pytest/unittest function and add it to the clipboard. 

![context](https://github.com/dgooden/getpytestpath/assets/353080/09991963-fdba-4384-b5ba-e6b8855981de)

Just right click on the method name of the test you want to run and choose the appropriate option:

![select](https://github.com/dgooden/getpytestpath/assets/353080/44d7554f-d377-46b9-84f8-a1a909e141c2)

## Configuration/Settings:
You can set various options in the settings:

![settings](https://github.com/dgooden/getpytestpath/assets/353080/4575f52a-f4a9-47ce-a212-eaa4e8e841c5)

`Launch Config Name` sets which `launch.json` configuration you want to run if you choose the `Run test in debugger` option.

If you choose the `Get test name with path and prefix` command the prefix you set will be prepended to the path.

`Use relative path` adds the relative path in front of the class and method name.

## Path format

The final path output depends on which option you choose and the configuration settings.

format with class:

`<relative_path_to_test_file_from_root_of_project>::<class_name>::<test_function>`

Example: `tests/test_file.py::test_class_name::test_function_name`

format without class:

`<relative_path_to_test_file_from_root_of_project>::<test_function>`

Example: `tests/test_file.py::test_function_name`

If `Use Relative Path` is not set, the format will exclude it.

If `Prefix` is set, it will prepend the prefix in front of everything
  * Note the `Get test name with path` option will ignore the `prefix` setting

## Automatically execute debugger

In order to be able to automatically execute the debugger with the chosen path, you will need to add configurations to your `launch.json` and `task.json` files.

### tasks.json:


Add this to the inputs section:

```json
{
  "id": "pytestDynamicPath",
  "type": "command",
  "command": "getpytestpath.getDynamicPath"
}
```

Add a task in your configurations section to execute what you want. The important part is to make sure the path comes from `${input:pytestDynamicPath}`

Here is an example of running a docker container:

```json
{
  "label": "docker-run-extension-test",
  "command": "docker-compose -f docker-compose.yml -f docker-compose.test.yml run --publish 1235:1235 --rm test fab \"${input:pytestDynamicPath} -vvv\"",
  "type": "shell",
  "isBackground": true,
  "problemMatcher": [
    {
      "pattern": {
        "regexp": ".",
        "file": 1,
        "location": 2,
        "message": 3
      },
      "background": {
        "beginsPattern": ".",
        "endsPattern": "VSCode debugging - waiting for attach on port"
      }
    }
  ]
}
```
### launch.json

Add an entry in your configurations, just make sure the `name` matches what you set in the extension setting `Launch Config Name`

Here is the companion example to the Docker task from above:

```json
{
  "name": "Execute From getPytestPath",
  "type": "python",
  "request": "attach",
  "connect": {
    "host": "localhost",
    "port": 1235
  },
  "preLaunchTask": "docker-run-extension-test",
  "pathMappings": [
    {
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "."
    }
  ]
}
```

## Installation

Install vsce:

`npm install -g @vscode/vsce`

In the root of the this repo, run:

`vsce package`

This will create a .vsix file that can be imported into vscode

## Known issues

None known.

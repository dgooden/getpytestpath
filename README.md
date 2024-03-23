# getpytestpath README

## Features
vscode extension that adds a few commands and context menus to run a test automatically, or to get the path to a pytest/unittest function and add it to the clipboard. 

<!-- ![context](https://github.com/dgooden/getpytestpath/assets/353080/09991963-fdba-4384-b5ba-e6b8855981de) -->

![context_menu](https://github.com/dgooden/getpytestpath/assets/353080/e09e87d8-bcb2-4cd1-8ad3-514350670eea)

Just right click on the method or class name of the test you want to run and choose the appropriate option:

![select](https://github.com/dgooden/getpytestpath/assets/353080/600428a7-964a-40b2-b1b4-c50fd84797a4)

If you right click on the class name, all tests in that class will be run.

## Configuration/Settings:
You can set various options in the settings:

![settings](https://github.com/dgooden/getpytestpath/assets/353080/af64dd1e-95f9-4aa6-91fa-4fb9573da292)

`Copy Path` allows you to set the path used when copying to the clipboard.

`Debug Path` allows you to set the path used when running the debugger.

Both of the above take the following tokens:

`${absolute_path}` - The absolute path of the file you have open in the editor

`$(relative_path)` - Relative path of the file you have open in the editor

**Examples:**

`${absolute_path}` = `/home/your_name/project_name/tests/test_file.py::TestClassName::TestMethodName`

`${relative_path}` = `tests/test_file.py::TestClassName::TestMethodName`

`some_prefix:${relative_path}` = `some_prefix:tests/test_file_py::TestClassname::TestMethodName`

---

`Launch Config Name` sets which `launch.json` configuration you want to run if you choose the `Run test in debugger` option.

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

You can download the release or build it manually.

Install vsce:

`npm install -g @vscode/vsce`

In the root of the this repo, run:

`vsce package`

This will create a .vsix file that can be imported into vscode

## Known issues

None known.

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function strEndsWith(str,char)
{
	const regex = new RegExp(char + "\\s*$");
	return regex.test(str);
}

function isMethod(editor,lineNumber) {
	let methodName = null;
	let hasSelf = false;

	let lineText = editor.document.lineAt(lineNumber).text;
	const methodNameMatches = lineText.match(/^\s*def\s+(\w+)/);
	if ( methodNameMatches != null ) {
		methodName = methodNameMatches[1];
		let foundEnd = false;
		let tempLines = "";
		let curLineNumber = lineNumber;
		while( !foundEnd ) {
			if ( curLineNumber >= editor.document.lineCount-1 ) {
				foundEnd = true;
				continue;
			}
			let curLine = editor.document.lineAt(curLineNumber).text;
			tempLines += curLine;
			if ( strEndsWith(curLine,':') ) {
				let selfMatch = tempLines.match(/^\s*def\s+\w+\s*\(\s*(self)?/);
				if ( selfMatch != null ) {
					hasSelf = selfMatch[1] !== undefined ? true : false;
				}
				foundEnd = true;
			}
			curLineNumber++;
		}
	}
	return {methodName,hasSelf}
}

function getClass(document,lineNumber) {
	for ( let i = lineNumber; i >= 0; i-- ) {
		let line = document.lineAt(i).text;
		let match = line.match(/^\s*class\s+(\w+)/);
		if ( match != null ) {
			return match[1];
		}
	}
	return null;
}

function getPytestPath(add_relative_path,prefix) {
	let editor = vscode.window.activeTextEditor;

	if ( editor ) {
		let pos = editor.selection.active;
		let lineNumber = pos.line;

		const {methodName,hasSelf} = isMethod(editor,lineNumber);
		if ( methodName != null ) {
			let output = "";
			if ( add_relative_path ) {
				output = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
			}
			if ( hasSelf ) {
				const className = getClass(editor.document,lineNumber);
				if ( className != null ) {
					output += "::" + className;
				}
			}
			output += "::"+methodName;
			if ( prefix ) {
				output = prefix + output;
			}
			vscode.env.clipboard.writeText(output);
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableNoPrefix= vscode.commands.registerCommand('getpytestpath.getPath', function () {
		// The code you place here will be executed every time your command is executed
		getPytestPath(true,"");
	});

	let disposableWithPrefix = vscode.commands.registerCommand('getpytestpath.getPathWithPrefix', function () {
		// The code you place here will be executed every time your command is executed
		const config = vscode.workspace.getConfiguration("getpytestpath");
		const prefix = config.get("prefix");
		getPytestPath(true,prefix);
	});

	let disposableNoPath = vscode.commands.registerCommand('getpytestpath.getNoPath', function () {
		getPytestPath(false,"");
	});

	context.subscriptions.push(disposableNoPrefix);
	context.subscriptions.push(disposableWithPrefix);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

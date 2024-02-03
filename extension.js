// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function strEndsWithStripComments(str,char)
{
	// Need to strip any possible comments
	const regex = /^([^#]*)/;
	const match = str.match(regex);

	if ( match ) {
		const code = match[1].trim();
		if ( code.length > 0 ) {
			const lastCharacter = code.charAt(code.length -1);
			if ( lastCharacter == char ) {
				return true;
			}
		}
	}
	return false
}

function indentationLevel(lineText) {
	let numSpaces = 0;
	// convert tabs to 4 spaces for consistency
	lineText = lineText.replace(/\t/g, ' '.repeat(4));
	const leadingSpace = lineText.match(/^\s*/);
	if ( leadingSpace ) {
		numSpaces = leadingSpace[0].length;
	}
	return numSpaces;
}

function isMethod(editor,lineNumber) {
	let methodName = null;
	let hasSelf = false;
	let methodSpaces = 0;

	let lineText = editor.document.lineAt(lineNumber).text;
	const methodNameMatches = lineText.match(/^\s*def\s+(\w+)/);
	if ( methodNameMatches != null ) {
		methodName = methodNameMatches[1];
		methodSpaces = indentationLevel(lineText);
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
			if ( strEndsWithStripComments(curLine,':') ) {
				let selfMatch = tempLines.match(/^\s*def\s+\w+\s*\(\s*(self)?/);
				if ( selfMatch != null ) {
					hasSelf = selfMatch[1] !== undefined ? true : false;
				}
				foundEnd = true;
			}
			curLineNumber++;
		}
	}
	return {methodName,hasSelf,methodSpaces} 
}

function getClassByIndent(document,lineNumber,methodSpaces) {

	for ( let i = lineNumber; i >= 0; i-- ) {
		let lineText = document.lineAt(i).text;
		let match = lineText.match(/^\s*class\s+(\w+)/);
		if ( match != null ) {
			let classSpaces = indentationLevel(lineText);
			if (( methodSpaces - classSpaces ) == 4 ) {
				return match[1];
			}
		}
	}
	return null;
}

function getPytestPath(add_relative_path,prefix) {
	let editor = vscode.window.activeTextEditor;

	if ( editor ) {
		let pos = editor.selection.active;
		let lineNumber = pos.line;

		const {methodName,hasSelf,methodSpaces} = isMethod(editor,lineNumber);
		if ( methodName != null ) {
			let output = "";
			if ( add_relative_path ) {
				output = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
			}
			if ( hasSelf ) {
				const className = getClassByIndent(editor.document,lineNumber,methodSpaces);
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
		const filePath = getPytestPath(true,"");

		// For "local", we need to us executeTask or some such when using docker
		// For preprod/prestage use startDebugging
		// Make this an option
		/*const debugConfig = {
			"type": "python",
			"name": "Test Extension",
			"request: "attach"
		}
		vscode.debug.startDebugging(undefined, debugConfig);*/
		//getPytestPath(false,"");
	});


	/* 
		launch.json:
		// "inputs": [ { "id": ???, "type": "command", "command": "getpytestpath.getDynamicPath"}]

		Use the above in tasks.json, like "input:getdynamicpath or whatever"
	*/

	let getDynamicPath = vscode.commands.registerCommand('getpytestpath.getDynamicPath', function() {
		return "test test test";
	});

	context.subscriptions.push(disposableNoPrefix);
	context.subscriptions.push(disposableWithPrefix);
	context.subscriptions.push(disposableNoPath);
	context.subscriptions.push(getDynamicPath);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
	strEndsWithStripComments,
	indentationLevel,
	isMethod,
	getClassByIndent,
}

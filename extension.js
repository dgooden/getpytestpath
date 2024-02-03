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

function indentationLevel(lineText)
{
	let numSpaces = 0;
	// convert tabs to 4 spaces for consistency
	lineText = lineText.replace(/\t/g, ' '.repeat(4));
	const leadingSpace = lineText.match(/^\s*/);
	if ( leadingSpace ) {
		numSpaces = leadingSpace[0].length;
	}
	return numSpaces;
}

function isMethod(editor,lineNumber)
{
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

function getClassByIndent(document,lineNumber,methodSpaces)
{
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

function getPytestPath(add_relative_path,prefix)
{
	let editor = vscode.window.activeTextEditor;
	let output = "";

	if ( editor ) {
		let pos = editor.selection.active;
		let lineNumber = pos.line;

		const {methodName,hasSelf,methodSpaces} = isMethod(editor,lineNumber);
		if ( methodName != null ) {
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
		}
	}
	return output;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context)
{
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	const config = vscode.workspace.getConfiguration("getpytestpath");
	const prefix = config.get("prefix");
	const add_relative_path = config.get("add_relative_path");

	let disposableExecuteDebugger = vscode.commands.registerCommand('getpytestpath.executeDebugger', async function () {
		debugName = config.get("launchConfigName");
		const workspaceFolder = vscode.workspace.workspaceFolders[0];
		await vscode.debug.startDebugging(workspaceFolder, debugName);
	});

	let disposableGetPath = vscode.commands.registerCommand('getpytestpath.getPath', function () {
		const finalPath = getPytestPath(add_relative_path,"");
		vscode.env.clipboard.writeText(finalPath);
	});

	let disposableGetPathAndPrefix = vscode.commands.registerCommand('getpytestpath.getPathAndPrefix', function () {
		const finalPath = getPytestPath(add_relative_path,prefix);
		vscode.env.clipboard.writeText(finalPath);
	});

	let disposableGetDynamicPath = vscode.commands.registerCommand('getpytestpath.getDynamicPath', function() {
		return getPytestPath(add_relative_path,prefix);
	});

	context.subscriptions.push(disposableExecuteDebugger);
	context.subscriptions.push(disposableGetPath);
	context.subscriptions.push(disposableGetPathAndPrefix);
	context.subscriptions.push(disposableGetDynamicPath);
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

const assert = require('assert');
const vscode = require('vscode');
const { resolve } = require('path')
const myExtension = require('../../extension');

suite('getpytestpath Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('strEndsWithStripComments Tests', () => {
		test('end token with no comment', () => {
			const testString = "def foo():";
			const result = myExtension.strEndsWithStripComments(testString,":");
			assert.strictEqual(result,true);
		});

		test('no end token with no comment', () => {

			const testString = "class foo()";
			const result = myExtension.strEndsWithStripComments(testString,":");
			assert.strictEqual(result,false);
		});

		test('end token with comment', () => {

			const testString = "def foo(): # some comment here";
			const result = myExtension.strEndsWithStripComments(testString,":");
			assert.strictEqual(result,true);
		});

		test('no end token with comment', () => {

			const testString = "def foo() # some comment here";
			const result = myExtension.strEndsWithStripComments(testString,":");
			assert.strictEqual(result,false);
		});
	});

	suite('indentationLevel tests', () => {
		test('zero indentation', () => {
			const testLine = "class testClass():";
			const result = myExtension.indentationLevel(testLine);
			assert.strictEqual(result,0);
		});

		test('four spaces indentation', () => {
			const testLine = "    class testClass():";
			const result = myExtension.indentationLevel(testLine);
			assert.strictEqual(result,4);
		});

		test('tab indentation (four spaces)', () => {
			const testLine = "\tclass testClass():";
			const result = myExtension.indentationLevel(testLine);
			assert.strictEqual(result,4);
		});
	});

	suite('isMethod tests', () => {
		test('single line method name', async() => {
			const testFilePath = resolve(__dirname, 'data', 'test_python_file_with_class.py');
			const document = await vscode.workspace.openTextDocument(vscode.Uri.file(testFilePath));
			await vscode.window.showTextDocument(document);
			const editor = vscode.window.activeTextEditor;
			const {methodName,hasSelf,methodSpaces} = myExtension.isMethod(editor,1);

			assert.strictEqual(methodName,"test_method");
			assert.strictEqual(hasSelf, true);
			assert.strictEqual(methodSpaces,4);
		});

		test('multi line method name', async() => {
			const testFilePath = resolve(__dirname, 'data', 'test_python_file_with_class.py');
			const document = await vscode.workspace.openTextDocument(vscode.Uri.file(testFilePath));
			await vscode.window.showTextDocument(document);
			const editor = vscode.window.activeTextEditor;
			const {methodName,hasSelf,methodSpaces} = myExtension.isMethod(editor,4);

			assert.strictEqual(methodName,"test_multiline_method");
			assert.strictEqual(hasSelf, true);
			assert.strictEqual(methodSpaces,4);
		});

		test('has no class', async() => {
			const testFilePath = resolve(__dirname, 'data', 'test_python_file_no_class.py');
			const document = await vscode.workspace.openTextDocument(vscode.Uri.file(testFilePath));
			await vscode.window.showTextDocument(document);
			const editor = vscode.window.activeTextEditor;
			const {methodName,hasSelf,methodSpaces} = myExtension.isMethod(editor,0);

			assert.strictEqual(methodName,"test_method_name_no_class");
			assert.strictEqual(hasSelf, false);
			assert.strictEqual(methodSpaces,0);
		});
	});

	suite('isClass tests', () => {

		test('returns correct class name', async () => {
			const testFilePath = resolve(__dirname, 'data', 'test_python_file_with_class.py');
			const document = await vscode.workspace.openTextDocument(vscode.Uri.file(testFilePath));
			await vscode.window.showTextDocument(document);
			const editor = vscode.window.activeTextEditor;
			const result = myExtension.isClass(editor,0);
			assert.strictEqual(result,"testClassName");
		});
	});
});


const assert = require('assert');
const vscode = require('vscode');
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

	/*suite('isMethod tests', () => {
		const vsCodeInstance = await vscode.test.setup();
		test('one line method name', () => {

		});
		test('multi line method name', () => {

		});
	});
	suite('isClass tests', async () => {
		const vsCodeInstance = await vscode.test.setup();

		test('returns correct class name', async () => {
			testFilePath = resolve(__dirname, 'data', 'test_python_file_with_class.py');
			await vscode.window.showTextDocument(vscode.Uri.file(testFilePath));
			const editor = vscode.window.activeTextEditor;
			const result = myExtension.isClass(editor,1);
			assert.strictEqual(result,"testClassName");
		})
	});*/
	suite('getClassByIndent tests', () => {
	});
});


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

		test('tab indentation (four spaces)',() => {
			const testLine = "\tclass testClass():";
			const result = myExtension.indentationLevel(testLine);
			assert.strictEqual(result,4);
		});
	});

	suite('isMethod tests', () => {
	});
	suite('getClassByIndent tests', () => {

	});
});


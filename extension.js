// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const MarkdownIt = require('markdown-it');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "readme-previewr" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('readme-previewr.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from README_PREVIEWR!');
	// 	var panel = vscode.window.createWebviewPanel(
	// 		'previewr',
	// 		'vs code extension',
	// 		vscode.ViewColumn.One,
	// 		{}
	// 	)
	// });

	const disposable = vscode.commands.registerCommand('readme-previewr.showPreview', function () {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showInformationMessage('Please open a README file first');
            return;
        }

        const document = editor.document;
        
        // Check if current file is a README
        if (!path.basename(document.fileName).toLowerCase().includes('readme')) {
            vscode.window.showInformationMessage('This is not a README file');
            return;
        }

        // // Create and show preview panel
        // const panel = vscode.window.createWebviewPanel(
        //     'readmePreview',
        //     'README Preview',
        //     vscode.ViewColumn.Beside,
        //     {
        //         enableScripts: true,
        //         retainContextWhenHidden: true
        //     }
        // );
		var panel = vscode.window.createWebviewPanel(
					'previewr',
					'ReadMe Previewer',
					vscode.ViewColumn.One,
					{}
				)

        // Function to update preview content
        function updatePreview() {
            const content = document.getText();
            panel.webview.html = getWebviewContent(content);
        }

        // Initial preview
        updatePreview();

        // Update preview when document changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updatePreview();
            }
        });

        // Clean up when panel is closed
        panel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
    });

	context.subscriptions.push(disposable);
}


function getWebviewContent(markdown) {
    // const htmlContent = marked(markdown);

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        // Use GitHub-flavored Markdown
        commonmark: true
    });
    
    const htmlContent = md.render(markdown);

    
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>README Preview</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 900px;
                    margin: 0 auto;
                }

                h1, h2, h3, h4, h5, h6 {
                    margin-top: 24px;
                    margin-bottom: 16px;
                    font-weight: 600;
                    line-height: 1.25;
                }

                h1 { font-size: 2em; }
                h2 { font-size: 1.5em; }
                h3 { font-size: 1.25em; }

                a {
                    color: #0366d6;
                    text-decoration: none;
                }

                a:hover {
                    text-decoration: underline;
                }

                code {
                    background-color: rgba(27, 31, 35, 0.05);
                    border-radius: 3px;
                    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                    font-size: 85%;
                    margin: 0;
                    padding: 0.2em 0.4em;
                }

                pre {
                    background-color: #f6f8fa;
                    border-radius: 3px;
                    font-size: 85%;
                    line-height: 1.45;
                    overflow: auto;
                    padding: 16px;
                }

                pre code {
                    background-color: transparent;
                    border: 0;
                    display: inline;
                    line-height: inherit;
                    margin: 0;
                    overflow: visible;
                    padding: 0;
                    word-wrap: normal;
                }

                blockquote {
                    border-left: 0.25em solid #dfe2e5;
                    color: #6a737d;
                    padding: 0 1em;
                    margin: 0;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 16px 0;
                }

                table th, table td {
                    border: 1px solid #dfe2e5;
                    padding: 6px 13px;
                }

                table tr:nth-child(2n) {
                    background-color: #f6f8fa;
                }

                img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const _extId :string       = 'Paratype.clincher-code-font';
const _fontsFolderName     = 'fonts';
const _infoFileName        = 'INFO.md';
const _fontFamilyName      = 'Clincher Code';
const _fontRegularFileName = 'Clincher-Code_Regular.ttf';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let extUri    :vscode.Uri = vscode.extensions.getExtension(_extId)?.extensionUri as vscode.Uri;
	let fontsUri  :vscode.Uri = vscode.Uri.joinPath(extUri, _fontsFolderName);
	let fontsPath :string     = fontsUri.fsPath;
	
	// This line of code will only be executed once when your extension is activated
	const message = `Clincher Code fonts files are in: ${fontsPath}`; 
	console.log(message);
	
	// The commands have been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposableSelect = vscode.commands.registerCommand('clincher-code-font.Select', () => {
		const sepSplit = ',', sepJoin = ', ';
		const placeholder = 'Select Editor Font';
		let editorCfg :vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('editor');
		let editorFontFamilies = editorCfg.fontFamily as string;

		let fontFamilies = editorFontFamilies.split(sepSplit);
		fontFamilies.forEach((item, index, arr) => { arr[index] = item.trim(); } );
		if (editorFontFamilies.indexOf(_fontFamilyName) < 0) fontFamilies = fontFamilies.concat(`'${_fontFamilyName}'`); 

		vscode.window.showQuickPick(fontFamilies, { placeHolder: placeholder }).then(selection => {
			if (selection) {
				let index = fontFamilies.indexOf(selection);
				fontFamilies.splice(index, 1);
				fontFamilies.splice(0, 0, selection);
				editorFontFamilies = fontFamilies.join(sepJoin);
				editorCfg.update('fontFamily', editorFontFamilies, true);
			}
		});
	}); // end of vscode.commands.registerCommand('clincher-code-font.Select'
	context.subscriptions.push(disposableSelect);

	let disposableInfo = vscode.commands.registerCommand('clincher-code-font.Info', () => {
		openFile(extUri, _infoFileName);
		showFontFilesInTerminal(fontsPath);	
		// vscode.window.showInformationMessage(message);
		// revealFileInOS(fontsUri, _fontRegularFileName);
	});
	context.subscriptions.push(disposableInfo);

	let disposableUri = vscode.window.registerUriHandler({
		handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
			if (uri.authority.toLowerCase() === _extId.toLowerCase()) {
				if (uri.path.toLowerCase() === '/' + _fontsFolderName) {
					revealFileInOS(fontsUri, _fontRegularFileName);
				}
			}
		  }	  
	});
	context.subscriptions.push(disposableUri);

} // end of export function activate(context: vscode.ExtensionContext) 

// this method is called when your extension is deactivated
export function deactivate() {
}

function showFontFilesInTerminal(fontsPath :string) {
	let terminal = vscode.window.createTerminal(_fontFamilyName);
	terminal.show();
	terminal.sendText('cd ' + fontsPath);
	terminal.sendText('ls');
	//terminal.sendText('start ' + 'Clincher-Code_Regular.ttf');
}

function revealFileInOS(folderUri :vscode.Uri, fileName :string) {
	let uri = vscode.Uri.joinPath(folderUri as vscode.Uri, fileName);
	vscode.commands.executeCommand('revealFileInOS', uri);
}

function openFile(folderUri :vscode.Uri, fileName :string) {
	let uri = vscode.Uri.joinPath(folderUri as vscode.Uri, fileName);
	vscode.commands.executeCommand('markdown.showPreview', uri);
}


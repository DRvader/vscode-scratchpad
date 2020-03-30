import * as vscode from 'vscode';
import * as filePath from 'path';
import * as fs from 'fs';

async function open(full_path: string) {
	if (!fs.existsSync(full_path)) {
		fs.mkdirSync(filePath.dirname(full_path), { recursive: true });
		fs.appendFileSync(full_path, "");
	}

	const textDocument = await vscode.workspace.openTextDocument(full_path);
	if (!textDocument) {
		throw new Error("Could not open file!");
	}

	vscode.window.showTextDocument(textDocument);
}

function mkdirp(dir_path: string) {
	var fixed_dir_path: string = dir_path.replace('\\', '/');
	var path: string = "";
	for (var path_slice in fixed_dir_path.split('/')) {
		path = filePath.join(path, path_slice);
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Scratchpad loaded');

	var name: string = "scratchPad.md";

	let globalOpenCommand = vscode.commands.registerCommand('scratchpad.openGlobal', () => {
		open(filePath.join(context.globalStoragePath, name));
	});
	context.subscriptions.push(globalOpenCommand);

	let localOpenCommand = vscode.commands.registerCommand('scratchpad.openLocal', () => {
		var storagePath = context.storagePath;
		if (storagePath === undefined) {
			vscode.window.showErrorMessage("Local storage not found, opening global instead.");
			open(filePath.join(context.globalStoragePath, name));
		} else {
			open(filePath.join(storagePath, "scartchPad.md"));
		}
	});
	context.subscriptions.push(localOpenCommand);
}

export function deactivate() { }

import { workspace, window, ExtensionContext } from 'vscode';
import * as child_process from 'child_process';
import {
	LanguageClient,
	LanguageClientOptions,
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'yaml' }],
		outputChannelName: 'xpls',
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'xpls',
		'Crossplane Language Server',
		spawnServer,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

async function spawnServer(): Promise<child_process.ChildProcess> {
  let settings = getSettings()
  let serverProcess = child_process.spawn(settings.upPath, ['xpls', 'serve', '--verbose'])
	serverProcess.on('error', (err: { code?: string; message: string }) => {
		window.showWarningMessage(
			`Failed to spawn xpls: \`${err.message}\``
		)
	})
    return serverProcess
}

function getSettings(): {upPath: any} {
	const configUpPath = workspace.getConfiguration().get('xpls.up.path');
	return {
		upPath: configUpPath ? configUpPath : "up"
	}
}
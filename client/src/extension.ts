/*
	Copyright (C) 2018-2019 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

'use strict';

import * as path from 'path';
import * as vscode from 'vscode';

import { 
	workspace, 
	commands,
	window,
	ExtensionContext 
} from 'vscode';

import ConfigUtils from "./utils/ConfigUtils"

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

import { CommandBuild } from "./commands/CommandBuild"
import { CommandRun } from "./commands/CommandRun"
import { CommandDebug } from './commands/CommandDebug';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	var _outputChannel: vscode.OutputChannel;
	_outputChannel = window.createOutputChannel('Kick Assembler Build');

	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: ['kickassembler'],
		synchronize: {
			configurationSection: 'kickassembler',
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(configChanged));

	// Create the language client and start the client.
	let client = new LanguageClient('kickassembler', 'Kick Assembler', serverOptions, clientOptions);

	// Start the client. This will also launch the server
	let disposable = client.start();

	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);

	//	wait for the language server to be ready
	client.onReady().then(() => {

		//	catch notifications from the language server
		client.onNotification("ERROR", (message: string) => {
			vscode.window.showErrorMessage(message);
		});
	});

	//	create command for assembling
	let cmdBuild = commands.registerCommand("kickassembler.build", function () {
		commandBuild(context, _outputChannel);
	});

	//	create command to build & run
	let cmdBuildRun = commands.registerCommand("kickassembler.buildandrun", function () {
		commandBuildRun(context, _outputChannel);
	});

	let cmdBuildDebug = commands.registerCommand("kickassembler.buildanddebug", function () {
		commandBuildDebug(context, _outputChannel);
	});

	let cmdRun = commands.registerCommand("kickassembler.run", function () {
		commandRun(context, _outputChannel);
	});

	let cmdDebug = commands.registerCommand("kickassembler.debug", function () {
		commandDebug(context, _outputChannel);
	});

	context.subscriptions.push(cmdBuild);
	context.subscriptions.push(cmdBuildRun);
	context.subscriptions.push(cmdBuildDebug);
	context.subscriptions.push(cmdRun);
	context.subscriptions.push(cmdDebug);

	console.log("- kick-assembler-vscode-ext client has started")
}

export function deactivate(): Thenable<void> {
	if (!client) {
		return undefined;
	}
	console.log("kickass-vscode-ext extension has been deactivated.");
	return client.stop();
}

function commandBuild(context: ExtensionContext, output: vscode.OutputChannel): number {
	if (!ConfigUtils.validateBuildSettings()) {
		vscode.window.showErrorMessage("We were unable to Build your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	var cb = new CommandBuild(context, output);
	return cb.build(output);
}

function commandBuildRun(context: ExtensionContext, output: vscode.OutputChannel) {
	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	window.activeTextEditor.document.save().then(function (reponse) {
		if (commandBuild(context, output) == 0) {
			commandRun(context, output);
		}
	});
}

function commandBuildDebug(context: ExtensionContext, output: vscode.OutputChannel) {
	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	window.activeTextEditor.document.save().then(function (reponse) {
		if (commandBuild(context, output) == 0) {
			commandDebug(context, output);
		}
	});
}

function commandRun(context: ExtensionContext, output: vscode.OutputChannel) {
	console.log("[ClientExtension] commandRun");
	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("Cannot Run - Check Settings");
		return;
	}
	var cr = new CommandRun(context, output);
	cr.run(output);
}

function commandDebug(context: ExtensionContext, output: vscode.OutputChannel) {
	console.log("[ClientExtension] commandDebug");
	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("Cannot Debug - Check Settings");
		return;
	}
	var cr = new CommandDebug(context, output);
	cr.run(output);
}

function configChanged() {
	ConfigUtils.validateBuildSettings();
}
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

	let cmdBuild = commands.registerCommand("kickassembler.build", function () {
		commandBuild(context, _outputChannel);
	});

	let cmdBuildStartup = commands.registerCommand("kickassembler.buildstartup", function () {
		commandBuildStartup(context, _outputChannel);
	});

	let cmdBuildRun = commands.registerCommand("kickassembler.buildandrun", function () {
		commandBuildRun(context, _outputChannel);
	});

	let cmdBuildRunStartup = commands.registerCommand("kickassembler.buildandrunstartup", function () {
		commandBuildRunStartup(context, _outputChannel);
	});

	let cmdBuildDebug = commands.registerCommand("kickassembler.buildanddebug", function () {
		commandBuildDebug(context, _outputChannel);
	});

	let cmdBuildDebugStartup = commands.registerCommand("kickassembler.buildanddebugstartup", function () {
		commandBuildDebugStartup(context, _outputChannel);
	});

	context.subscriptions.push(cmdBuild);
	context.subscriptions.push(cmdBuildStartup);
	context.subscriptions.push(cmdBuildRun);
	context.subscriptions.push(cmdBuildRunStartup);
	context.subscriptions.push(cmdBuildDebug);
	context.subscriptions.push(cmdBuildDebugStartup);

	console.log("- kick-assembler-vscode-ext client has started")
}

export function deactivate(): Thenable<void> {
	if (!client) {
		return undefined;
	}
	console.log("kickass-vscode-ext extension has been deactivated.");
	return client.stop();
}

/**
 * Build a Program From Source
 * @param context 
 * @param output 
 */
function commandBuild(context: ExtensionContext, output: vscode.OutputChannel): number {

	if (!ConfigUtils.validateBuildSettings()) {
		vscode.window.showErrorMessage("We were unable to Build your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	var cb = new CommandBuild(context, output);
	return cb.buildOpen();
}

function commandBuildStartup(context: ExtensionContext, output: vscode.OutputChannel): number {

	if (!ConfigUtils.validateBuildSettings()) {
		vscode.window.showErrorMessage("We were unable to Build your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	var cb = new CommandBuild(context, output);
	return cb.buildStartup();
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

function commandBuildRunStartup(context: ExtensionContext, output: vscode.OutputChannel) {
	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	window.activeTextEditor.document.save().then(function (reponse) {
		if (commandBuildStartup(context, output) == 0) {
			commandRunStartup(context, output);
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

function commandBuildDebugStartup(context: ExtensionContext, output: vscode.OutputChannel) {
	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}
	window.activeTextEditor.document.save().then(function (reponse) {
		if (commandBuildStartup(context, output) == 0) {
			commandDebugStartup(context, output);
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
	cr.runOpen();
}

function commandRunStartup(context: ExtensionContext, output: vscode.OutputChannel) {
	console.log("[ClientExtension] commandRun");
	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("Cannot Run - Check Settings");
		return;
	}
	var cr = new CommandRun(context, output);
	cr.runStartup();
}

function commandDebug(context: ExtensionContext, output: vscode.OutputChannel) {
	console.log("[ClientExtension] commandDebug");
	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("Cannot Debug - Check Settings");
		return;
	}
	var cd = new CommandDebug(context, output);
	cd.runOpen();
}

function commandDebugStartup(context: ExtensionContext, output: vscode.OutputChannel) {
	console.log("[ClientExtension] commandDebug");
	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("Cannot Debug - Check Settings");
		return;
	}
	var cd = new CommandDebug(context, output);
	cd.runStartup();
}

function configChanged() {
	ConfigUtils.validateBuildSettings();
}
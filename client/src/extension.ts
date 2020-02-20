/*
	Copyright (C) 2018-2019 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { TextLine, Range } from 'vscode';

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
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(fileOpened));	
	context.subscriptions.push(vscode.debug.onDidChangeBreakpoints(breakpointsChanged));

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

function fileOpened(text:vscode.TextDocument) {
	var line:TextLine;
	var breakExpressionInfo:RegExpMatchArray;

//find all existing breakpoints and create them in vscode	
	let newBreakpoints: vscode.Breakpoint[] = [];
	for(var i=0;i<text.lineCount;i++){
		line = text.lineAt(i);
		let checkLine = line.text.trim();
		let existingBreak = checkLine.match(/^(\/\/\s*)*\.break/);
		if(existingBreak) {
			//TODO already in the bp list?
			breakExpressionInfo = checkLine.substr(existingBreak[0].length).trim().match(/".*"/);
			console.log('break in line '+i+' with info:',breakExpressionInfo)
			newBreakpoints.push(new vscode.SourceBreakpoint(
				new vscode.Location(text.uri, new vscode.Position(i, 0)),
				checkLine.substr(0,2) != "//",
				breakExpressionInfo ? breakExpressionInfo[0] : ''
			));
		}
	}
	if(newBreakpoints.length>0) {
		vscode.debug.addBreakpoints(newBreakpoints);
	}
}

function breakpointsChanged(breakpointChanges:vscode.BreakpointsChangeEvent){
	let editor = vscode.window.activeTextEditor;
	if (editor) {

		let document = editor.document;

		breakpointChanges.added.forEach((bp:vscode.SourceBreakpoint) => {
			if(bp.location.uri.path == document.uri.path) {
				let bpLine = document.lineAt(bp.location.range.start.line);
				if(bpLine) {
					let lineText = bpLine.text.trim();
					if(!lineText.match(/^(\/\/\s*)*\.break/)){
						editor.edit(editBuilder => {
							editBuilder.insert(
								bp.location.range.start,
								(bp.enabled===false ? "// ":"")+".break"+(bp.condition ? '"'+bp.condition+'"':"")+"\n"
							);
						});
					// just in case remembered breakpoints by vscode and file content does not match anymore
					} else if(bp.enabled===false && lineText.substr(0,2) !== "//") {
						editor.edit(editBuilder => {
							editBuilder.insert(
								bp.location.range.start,
								"// "
							);
						});
					} else if(bp.enabled!==false && lineText.substr(0,2) === "//") {
						editor.edit(editBuilder => {
							editBuilder.delete(<Range>{
								start: bp.location.range.start,
								end: {
									line: bp.location.range.start.line,
									character: lineText.indexOf(".break")
								}
							});
						});
					}
				}
			}
		});
		breakpointChanges.removed.forEach((bp:vscode.SourceBreakpoint) => {
			if(bp.location.uri.path == document.uri.path) {
				console.log(1111);
				let bpLine = document.lineAt(bp.location.range.start.line);
				if(bpLine && bpLine.text.trim().match(/^(\/\/\s*)*\.break/)){
					console.log(2222,bp.location.range.start);
					editor.edit(editBuilder => {
						editBuilder.delete(<Range>{
							start: bp.location.range.start,
							end: {
								line: bp.location.range.start.line+1,
								character: 0
							}
						});
					});
				} else {
					console.log(999,bpLine.text);
				}
			}
		});
		breakpointChanges.changed.forEach((bp:vscode.SourceBreakpoint) => {
			if(bp.location.uri.path == document.uri.path) {
				let bpLine = document.lineAt(bp.location.range.start.line);
				if(bpLine && bpLine.text.trim().match(/^(\/\/\s*)*\.break/)){
					editor.edit(editBuilder => {
						editBuilder.replace(bp.location.range,".break" + ' "changedit"');
					});
				}
			}
		});
	}
}
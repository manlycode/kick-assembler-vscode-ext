/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { TextLine, Range, SourceBreakpoint } from 'vscode';

import { 
	workspace, 
	commands,
	window,
	ExtensionContext,
	extensions 
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
	let extension = extensions.getExtension('paulhocker.kick-assembler-vscode-ext');
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
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(fileChanged));	
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

	window.showInformationMessage(`Kick AssemblerExtension  ${extension.packageJSON.version}${extension.packageJSON.status} is Ready.`);
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

/**
 * Build and then Run the currently Open file in the Editor.
 * @param context 
 * @param output 
 */
function commandBuildRun(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	saveOpenDocument();

	if (commandBuild(context, output) == 0) {
		commandRun(context, output);
	}
}

/**
 * Build and Run the Startup program
 * @param context 
 * @param output 
 */
function commandBuildRunStartup(context: ExtensionContext, output: vscode.OutputChannel) {
	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	saveOpenDocument()

	if (commandBuildStartup(context, output) == 0) {
		commandRunStartup(context, output);
	}
}

/**
 * Build and Debug the Currently Open Document
 * @param context 
 * @param output 
 */
function commandBuildDebug(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	saveOpenDocument();

	if (commandBuild(context, output) == 0) {
		commandDebug(context, output);
	}
}

/**
 * Build and Debug the Startup Program
 * @param context 
 * @param output 
 */
function commandBuildDebugStartup(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	saveOpenDocument();

	if (commandBuildStartup(context, output) == 0) {
		commandDebugStartup(context, output);
	}
}

/**
 * Run the Currently Open Program
 * @param context 
 * @param output 
 */
function commandRun(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	var cr = new CommandRun(context, output);
	cr.runOpen();
}

/**
 * Run The Startup Program
 * @param context 
 * @param output 
 */
function commandRunStartup(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateRunSettings()) {
		vscode.window.showErrorMessage("We were unable to Run your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	var cr = new CommandRun(context, output);
	cr.runStartup();
}

function commandDebug(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	var cd = new CommandDebug(context, output);
	cd.runOpen();
}

function commandDebugStartup(context: ExtensionContext, output: vscode.OutputChannel) {

	if (!ConfigUtils.validateDebugSettings()) {
		vscode.window.showErrorMessage("We were unable to Debug your program because there was a problem validating your Settings. Please check your Settings and Try Again.");
		return;
	}

	var cd = new CommandDebug(context, output);
	cd.runStartup();
}

function configChanged() {
	ConfigUtils.validateBuildSettings();
}

function fileChanged(e:vscode.TextDocumentChangeEvent){

	let isSameChangeLine = e.contentChanges[0].range.start.line === e.contentChanges[0].range.end.line;
	let rangeToCheck = isSameChangeLine && !e.contentChanges[0].text.includes("\n") ? e.contentChanges[0].range.start.line : undefined;
	fileOpened(e.document,rangeToCheck);
}

/**
 * Save the currently open document if available. * 
 */
function saveOpenDocument() {

	// only when open active document is available

	if (!window)
		return;

	if (!window.activeTextEditor)
		return;

	if (window.activeTextEditor.document) {
		// save the active document and return
		window.activeTextEditor.document.save().then(function (reponse) {
			return;
		});
	}
	return;
}

function fileOpened(text:vscode.TextDocument, checkLineNumber?:number) {
	var line:TextLine;
	var breakExpressionInfo:RegExpMatchArray;

	//find all existing breakpoints and create them in vscode	

	let newBreakpoints: vscode.Breakpoint[] = [];

	for(var i=(checkLineNumber || 0),iL=(checkLineNumber ? checkLineNumber+1 : text.lineCount);i<iL;i++){
		line = text.lineAt(i);
		let checkLine = line.text.trim();
		let existingBreak = checkLine.match(/^(\/\/\s*)*\.break/);
		let existingPrint = checkLine.match(/^(\/\/\s*)*\.print(\s+[\(\"]*|\s*[\(\"]+)[\w")]+/);		
		if(existingBreak || existingPrint) {
			breakExpressionInfo = existingBreak ? checkLine.substr(existingBreak[0].length).trim().match(/".*"/) : undefined;
			newBreakpoints.push(new vscode.SourceBreakpoint(
				new vscode.Location(text.uri, new vscode.Position(i, 0)),
				checkLine.substr(0,2) != "//",
				breakExpressionInfo ? breakExpressionInfo[0] : '',
				'',
				existingPrint ? checkLine.substr(checkLine.indexOf(".print")+6).trim() : ''
			));
		} else {
			// remove a possible existing breakpoint
			let bpexists = vscode.debug.breakpoints.filter((bp:SourceBreakpoint) => {
				return bp.location.uri.path == text.uri.path && bp.location.range.start.line === i;
			});
			if(bpexists.length > 0){
				vscode.debug.removeBreakpoints(bpexists);
			}
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
					if(!lineText.match(/^(\/\/\s*)*\.(break|print)/)){
						editor.edit(editBuilder => {
							editBuilder.insert(
								bp.location.range.start,
								(bp.enabled===false ? "// ":"")+(bp.logMessage ? ".print "+bp.logMessage : ".break"+(bp.condition ? ' "'+bp.condition+'"':""))+"\n"
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
							editBuilder.delete(
								new Range(bp.location.range.start.line,0,bp.location.range.start.line,lineText.indexOf(bp.logMessage ? ".print" : ".break"))
							);
						});
					}
				}
			}
		});
		breakpointChanges.removed.forEach((bp:vscode.SourceBreakpoint) => {
			if(bp.location.uri.path == document.uri.path) {
				let bpLine = document.lineAt(bp.location.range.start.line);
				if(bpLine && bpLine.text.trim().match(/^(\/\/\s*)*\.(break|print)/)){
					editor.edit(editBuilder => {
						editBuilder.delete(
							new Range(bp.location.range.start.line,0,bp.location.range.start.line+1,0)
						);
					});
				}
			}
		});
		breakpointChanges.changed.forEach((bp:vscode.SourceBreakpoint) => {
			if(bp.location.uri.path == document.uri.path) {
				let bpLine = document.lineAt(bp.location.range.start.line);
				if(bpLine && bpLine.text.trim().match(/^(\/\/\s*)*\.(break|print)/)){
					editor.edit(editBuilder => {
						editBuilder.replace(
							new Range(bp.location.range.start.line,0,bp.location.range.start.line,bpLine.text.length),
							(bp.enabled===false ? "//" : "") + (bp.logMessage ? ".print "+bp.logMessage : ".break" + (bp.condition ? ' "'+bp.condition+'"' : ''))
						);
					});
				}
			}
		});
	}
}
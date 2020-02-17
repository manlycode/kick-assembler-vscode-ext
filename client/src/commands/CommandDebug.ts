/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, Uri } from 'vscode';
import PathUtils from '../utils/PathUtils';
import ClientUtils from '../utils/ClientUtils';
import * as vscode from 'vscode';
import * as path from 'path';


export class CommandDebug {

    private configuration: vscode.WorkspaceConfiguration;
    private output:vscode.OutputChannel;

    constructor(context: ExtensionContext, output: vscode.OutputChannel) {
        this.configuration = workspace.getConfiguration('kickassembler');
        this.output = output;
    }

    public runOpen() {
        let sourceFile = ClientUtils.GetOpenDocumentUri();
        let base = path.basename(sourceFile.fsPath);
        let program = path.join(ClientUtils.GetOutputPath(), ClientUtils.CreateProgramFilename(base));
        this.run(program);
    }

    public runStartup() {
        let sourceFile = ClientUtils.GetStartupUri();
        let base = path.basename(sourceFile.fsPath);
        let program = path.join(ClientUtils.GetOutputPath(), ClientUtils.CreateProgramFilename(base));
        this.run(program);
    }

    private run(program:string) {

        // is the emulator path set?
        let debuggerRuntime: string = this.configuration.get("debuggerRuntime");

        // enclose in quotes to accomodate filenames with spaces on non-windows platforms
        if (process.platform == "darwin") {
            debuggerRuntime = '"' + debuggerRuntime + '"';
		    debuggerRuntime = debuggerRuntime.replace("\\", "");
        }

        let debuggerOptionsString: string = this.configuration.get("debuggerOptions");
        let debuggerOptions = debuggerOptionsString.match(/\S+/g) || [];
        
        console.log(`- looking for program ${program}`);

        var fs = require('fs');
        if (!fs.existsSync(program)) {
            window.showWarningMessage(`Could not Locate the Program to Debug.`,`${program}`);
            return;
        }

        let vsf = program.replace(".prg", ".vs");

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", program, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: false
            });

            console.log(emu);
            emu.unref();
            return;
        }

        //  spawn child process for osx
        if (process.platform == "darwin") {
            let emu = spawn("open", [debuggerRuntime, "--args", "-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", program, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", program, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: false
            });

            emu.unref();
            return;
        }
        //  create new output channel
        window.showErrorMessage(`Platform ${process.platform} is not Supported.`);
    }
}
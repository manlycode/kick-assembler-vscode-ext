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

    private _configuration: vscode.WorkspaceConfiguration;

    constructor(context: ExtensionContext, output: vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public run(output: vscode.OutputChannel) {

        // is the emulator path set?
        let debuggerRuntime: string = this._configuration.get("debuggerRuntime");

        // enclose in quotes to accomodate filenames with spaces on non-windows platforms
        if (process.platform != "win32") {
            debuggerRuntime = '"' + debuggerRuntime + '"';
		    debuggerRuntime = debuggerRuntime.replace("\\", "");
        }

        let debuggerOptionsString: string = this._configuration.get("debuggerOptions");
        let debuggerOptions = debuggerOptionsString.match(/\S+/g) || [];
        
        // get the program filename and path
        let prg = ClientUtils.GetWorkspaceProgramFilename();

        console.log(`- looking for file ${prg}`);

        var fs = require('fs');
        if (!fs.existsSync(prg)) {
            window.showWarningMessage(`Could not Locate the Program to Debug.`,`${prg}`);
            return;
        }

        let vsf = prg.replace(".prg", ".vs");

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", prg, ...debuggerOptions], {
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
            let emu = spawn("open", [debuggerRuntime, "--args", "-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", prg, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-symbols", vsf, "-prg", prg, ...debuggerOptions], {
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
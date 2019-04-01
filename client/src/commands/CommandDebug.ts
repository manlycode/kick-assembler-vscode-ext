/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, Uri } from 'vscode';
import PathUtils from '../utils/PathUtils';
import * as vscode from 'vscode';

export class CommandDebug {

    private _configuration: vscode.WorkspaceConfiguration;

    constructor(context: ExtensionContext, output: vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public run(output: vscode.OutputChannel) {

        //  is the emulator path set?
        let debuggerRuntime: string = this._configuration.get("debuggerRuntime");

        let debuggerOptionsString: string = this._configuration.get("debuggerOptions")
        let debuggerOptions = debuggerOptionsString.split(" ").filter((val: any) => val)
        
        //  locate file, does it exist?
        let file = PathUtils.uriToFileSystemPath(window.activeTextEditor.document.uri.toString());

        //  thie below code is dumb, but will work for now
        let prg = file.replace(".asm", ".prg");
        prg = prg.replace(".kick", ".prg");
        prg = prg.replace(".a", ".prg");
        prg = prg.replace(".ka", ".prg");
        let vsf = prg.replace(".prg", ".vs");
        console.log(`- looking for file ${prg}`);

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
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
            let emu = spawn("open", [debuggerRuntime, "--args", "-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
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
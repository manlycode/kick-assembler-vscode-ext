/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, Uri, WorkspaceConfiguration } from 'vscode';
import PathUtils from '../utils/PathUtils';
import * as vscode from 'vscode';
import * as path from 'path';
import ClientUtils from '../utils/ClientUtils';


export class CommandRun {

    private _configuration: WorkspaceConfiguration;

    constructor(context: ExtensionContext, output: vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public run(output: vscode.OutputChannel) {

        //  is the emulator path set?
        let emulatorRuntime: string  = this._configuration.get("emulatorRuntime");

        // get the program filename and path
        let prg = ClientUtils.GetWorkspaceProgramFilename();

        console.log(`- looking for file ${prg}`);

        var fs = require('fs');
        if (!fs.existsSync(prg)) {
            window.showWarningMessage(`Could not Locate the Program to Run.`,`${prg}`);
            return;
        }

        let vsf = prg.replace(".prg", ".vs");

        let emulatorOptionsString: string = this._configuration.get("emulatorOptions");
        let emulatorOptions = emulatorOptionsString.match(/\S+/g) || [];

        if (this._configuration.get("emulatorViceSymbols")){
            emulatorOptions.push('-moncommands',vsf);
        }

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(emulatorRuntime, ["-autostartprgmode", "1", "-autostart", prg, ...emulatorOptions], {
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
            let emu = spawn("open", [emulatorRuntime, "--args", "-autostartprgmode", "1", "-autostart", prg, ...emulatorOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(emulatorRuntime, ["-autostartprgmode", "1", "-autostart", prg, ...emulatorOptions], {
                detached: true,
                stdio: 'inherit',
                shell: false
            });

            emu.unref();
            return;
        }

        //  create new output channel
        window.showInformationMessage(`Platform ${process.platform} is not Supported.`);
    }
}
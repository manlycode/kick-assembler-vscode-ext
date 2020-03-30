/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/


import { spawn } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, Uri, WorkspaceConfiguration } from 'vscode';
import PathUtils from '../utils/PathUtils';
import * as vscode from 'vscode';
import * as path from 'path';
import ClientUtils from '../utils/ClientUtils';


export class CommandRun {

    private configuration: WorkspaceConfiguration;
    private output: vscode.OutputChannel;

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

    public run(program:string) {

        //  is the emulator path set?
        let emulatorRuntime: string  = this.configuration.get("emulatorRuntime");

        // enclose in quotes to accomodate filenames with spaces on non-windows platforms
        if (process.platform == "darwin") {
            emulatorRuntime = '"' + emulatorRuntime + '"';
		    emulatorRuntime = emulatorRuntime.replace("\\", "");
        }

        console.log(`- looking for program ${program}`);

        var fs = require('fs');
        if (!fs.existsSync(program)) {
            window.showWarningMessage(`Could not Locate the Program to Run`,`${program}`);
            return;
        }

        let vsf = program.replace(".prg", ".vs");

        let emulatorOptionsString: string = this.configuration.get("emulatorOptions");
        let emulatorOptions = emulatorOptionsString.match(/\S+/g) || [];

        if (this.configuration.get("emulatorViceSymbols")){
            emulatorOptions.push('-moncommands',vsf);
        }

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(emulatorRuntime, ["-autostartprgmode", "1", "-autostart", program, ...emulatorOptions], {
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
            let emu = spawn("open", [emulatorRuntime, "--args", "-autostartprgmode", "1", "-autostart", program, ...emulatorOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(emulatorRuntime, ["-autostartprgmode", "1", "-autostart", program, ...emulatorOptions], {
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
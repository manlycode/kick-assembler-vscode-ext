/*
	Copyright (C) 2018-2019 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import * as vscode from 'vscode';
import * as fs from 'fs';

export default class ConfigUtils {

	public static validateBuildSettings():boolean {

		let settings = vscode.workspace.getConfiguration("kickassembler");

		if (!fs.existsSync(settings.get("assemblerJar"))) {
			vscode.window.showErrorMessage("Could Not Find the KickAss Jar in the assemblerJar setting.");
			return false;
		}
		
		if (!fs.existsSync(settings.get("javaRuntime"))) {
			vscode.window.showErrorMessage("Could Not Find the Java Runtime in the javaRuntime setting.");
			return false;
		}

        return true;
	}

	public static validateRunSettings():boolean {

		let settings = vscode.workspace.getConfiguration("kickassembler");

		if (!fs.existsSync(settings.get("emulatorRuntime"))) {
			vscode.window.showErrorMessage("Could Not Find the Emulator Runtime in the emulatorRuntime setting.");
			return false;
		}

        return true;
	}

	public static validateDebugSettings():boolean {

		let settings = vscode.workspace.getConfiguration("kickassembler");

		if (!fs.existsSync(settings.get("debuggerRuntime"))) {
			vscode.window.showErrorMessage("Could Not Find the C64Debugger Runtime in the emulatorRuntime setting.");
			return false;
		}

        return true;
	}

}
/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { Uri } from "vscode"; 

export default class PathUtils {

	/**
	 * Converts "file:///d%3A/blaba/a.x" to "d:\blaba\a.x"
	 */
	public static uriToFileSystemPath(uri:string):string {
		let newuri = Uri.parse(uri);
		return newuri.fsPath;
	}
}
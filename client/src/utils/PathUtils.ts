/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { dirname } from 'path';
import { Uri } from "vscode"; 

export default class PathUtils {

	/**
	 * Converts "file:///d%3A/blaba/a.x" to "d:\blaba\a.x"
	 */
	public static uriToFileSystemPath(uri:string):string {
		let newuri = Uri.parse(uri);
		return newuri.fsPath;
	}

	/**
	 * Converts "file:///d%3A/blaba/a.x" to "d:\blaba\a.x"
	 */
    public static uriToPlatformPath(uri: string): string {
        let newuri = Uri.parse(uri);
        return newuri.fsPath;
	}
	
	/**
     * Returns the Path from a Filename
     * @param filename 
     */
    public static getPathFromFilename(filename: string) {
        return dirname(filename);
    }
}
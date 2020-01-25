/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { Uri, WorkspaceConfiguration, window, workspace} from 'vscode';
import * as fs from 'fs';
import PathUtils from "./PathUtils"
import * as path from "path";

/**
 * A Collection of Useful Client Functions
 */
export default class ClientUtils {

    /**
     * Return a Valid Uri for a Compiled Program
     * 
     * This helper method will create the valid
     * Uri for the program file that will be
     * compiled by KickAssembler.
     * 
     * 
     * Example 1:
     * 
     * With an Output setting of 
     * 
     *      "" (blank) 
     * 
     * and a source filename of 
     * 
     *      /home/user/workspace/coolgame.asm
     * 
     * this method will return
     * 
     *      /home/user/workspace/coolgame.prg
     * 
     * 
     * Example 2:
     * 
     * with an output of 
     * 
     *      "output"
     * 
     * and a source filename of
     * 
     *      /home/user/workspace/coolgame.asm
     * 
     * this method will return
     * 
     * 
     *      /home/user/workspace/output/coolgame.prg
     * 
     * 
     * Example 3:
     * 
     * with an output of
     * 
     *      "/home/user/build"
     * 
     * and a source filename of 
     * 
     *      /home/user/workspace/coolgame.asm
     * 
     * this method will return
     * 
     *      /home/user/build/coolgame.asm
     */
    public static GetWorkspaceProgramUri():Uri {

        // get the output path
        var outputPath:string = this.GetOutputPath();
        var sourceFile: string = this.GetSourceUri().toString();

        // hack to make the extension a PRG file
        // TODO: make this betterer
        let prg = path.basename(sourceFile);
        prg = prg.replace(".asm", ".prg");
        prg = prg.replace(".kick", ".prg");
        prg = prg.replace(".a", ".prg");
        prg = prg.replace(".ka", ".prg");

        // build the filename
        var outputFile:string = outputPath + path.sep + prg;

        // convert to uri and return
        var uri:Uri = Uri.parse(outputFile);
        return uri;

    }

    /**
     * Return an Path for Output
     * 
     * This method will return a valid string
     * path for the output specified on the
     * extension setting
     * 
     *      kickassembler.output
     * 
     */
	public static GetOutputPath():string {


        var outputDirectory:string = this.GetSettings().get("outputDirectory");
        var sourceDirectory:string  = PathUtils.GetPathFromFilename(this.GetSourceUri().path);

        if (outputDirectory == "") {
            outputDirectory = sourceDirectory;
        }

        outputDirectory = path.resolve(outputDirectory);

        var fs = require('fs');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        return outputDirectory;
    }

    /**
     * Return the Active Text Editor Uri
     * 
     * This method is a simple helper method
     * to retrieve the currently open 
     * editor file in the Workspace.
     * 
     */
    public static GetSourceUri():Uri {
        return window.activeTextEditor.document.uri;
    }

    /**
     * Return The Extension Settings
     * 
     * A simple helper method to return
     * the settings for this extension
     * 
     *      kickassembler
     */
    public static GetSettings():WorkspaceConfiguration {
		return workspace.getConfiguration("kickassembler");
    }
}

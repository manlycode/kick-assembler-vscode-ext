/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { Uri, WorkspaceConfiguration, window, workspace, TextDocument, TextEditor } from 'vscode';
import * as fs from 'fs';
import PathUtils from "./PathUtils"
import * as path from "path";
//import { TextDocument } from 'vscode-languageclient';

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
    public static GetWorkspaceProgramFilename():string {

        // get the output path
        var outputPath:string = this.GetOutputPath();
        var sourceFile: string = this.GetOpenDocument().fsPath;

        // get the final program filename
        var prg = this.CreateProgramFilename(path.basename(sourceFile));

        // build the filename
        var outputFile:string = outputPath + path.sep + prg;

        return outputFile;
    }

    public static CreateProgramFilename(filename:string): string | undefined {

        // hack to make the extension a PRG file
        // TODO: make this betterer
        filename = filename.replace(".asm", ".prg");
        filename = filename.replace(".kick", ".prg");
        filename = filename.replace(".a", ".prg");
        filename = filename.replace(".ka", ".prg");

        return filename;

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
        var sourceDirectory:string  = PathUtils.GetPathFromFilename(this.GetOpenDocument().toString());

        var outputParse = path.parse(outputDirectory);
        var outputDir:string = path.dirname(outputDirectory);
        var outputPath:string = path.join(sourceDirectory, outputDirectory);

        // starts at base folder
        if (outputParse.root.length > 0) {
            outputPath = outputDirectory;
        }

        // when left blank use the source directory
        if (outputDirectory.trim() == "") {
            outputPath = sourceDirectory;            
        }

        // outputPath = path.resolve(outputPath);

        var fs = require('fs');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        return outputPath;
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
     * Find the Active Open Document
     */
    public static GetOpenDocument():Uri | undefined{

        // get the build master
        let buildMaster:string = this.GetSettings().get("buildMaster");

        var document:TextDocument;

        /*
            first try the active window text editor

            if it has a valid viewColumn (! undefined) then
            we can pretty safely assume it is one of the
            open source code windows
        */

        let activeEditor = window.activeTextEditor;

        // get the document and return it to the caller
        if (activeEditor.viewColumn != undefined) {
            document = activeEditor.document;
            // return document;
        }

        let textEditors = window.visibleTextEditors;

        if (textEditors.length < 0) {
            document = undefined;
        }

        if (!document) {
            for (var i = 0; i < textEditors.length; i++ ) {
                var editor:TextEditor = textEditors[i];
                if (editor.viewColumn == 1) {
                    document = editor.document;
                    // return document;
                }
            }
        }

        var uri;

        if (document) {

            uri = Uri.parse(document.fileName);

            if (buildMaster) {
                let filename:string = document.fileName;
                let dir:string = path.dirname(filename);
                uri = Uri.parse(dir + path.sep + buildMaster);
            }
        }

        return uri;

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

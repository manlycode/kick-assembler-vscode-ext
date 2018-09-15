
/*
    Class:  Project

    Represents the Currently Open Source File

    Remarks:

        In this Extension, each source file is
        treated as it own independent project.

        In the future, the definition of a project
        may change.

        The Project knows everything about the
        open document, its imported files, the
        last time it was compiled.

        Information about a project will be
        cached so that the developer does not
        have to wait for compiles when
        moving between documents. This is, 
        of course, taken care of by the
        ProjectManager.

*/

import Uri from "vscode-uri"; 
import { AssemblerInfo } from "../assembler/AssemblerInfo";
import { Settings } from "../providers/settingsProvider";
import { TextDocumentItem } from "vscode-languageserver";
import { Assembler, AssemblerResults } from "../assembler/Assembler";
import { ProjectFile } from "./ProjectFile";
import { print } from "util";

export default class Project {

    private source:Uri;
    private imports:{};
    private assemblerResults:AssemblerResults;
    private assemblerInfo:AssemblerInfo;
    private projectFiles:ProjectFile[];

    constructor() {
    }

    public assemble(settings:Settings, textDocument:TextDocumentItem) {
        let assembler = new Assembler();
        this.assemblerResults = assembler.assemble(settings, textDocument);
        for (var file of this.assemblerResults.assemblerInfo.getFiles()) {
            var projectFile = new ProjectFile(file.uri, "")
        }
    }

    public getAssemblerInfo():AssemblerInfo {
        return this.assemblerInfo;
    }

    public getAssemblerResults():AssemblerResults {
        return this.assemblerResults;
    }
}
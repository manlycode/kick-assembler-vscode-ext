
/*
    Class: ProjectFile

        Represents on File in the Project

    Remarks:

        A Project can consist of one large
        source file, or many source files
        using the #import directives.

        Kick Assembler will combine the
        files and summarize them at the
        end of the compile process.

        Each of those files and their source
        will be put into its own project
        file that can be used.
*/

import URI from "vscode-uri";

export class ProjectFile {

    //  the location of the file
    private uri:URI;

    //  has it been changed? - we should probably compile again
    private isDirty:boolean;

    //  is this the main file in a project?
    private isMain:boolean;

    //  returns the source code as one large string
    public getSource():string|undefined {
        return undefined;
    }

    //  returns the source code as an array of strings or rows
    public getSourceLines():string[]|undefined {
        return undefined;
    }
}
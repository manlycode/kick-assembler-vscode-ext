
/*
    Class: ProjectFile

        Represents one File in the Project

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
import StringUtils from "../utils/StringUtils";

export class ProjectFile {

    //  the uri of the document
    private uri:URI;

    //  the text of the document
    private text:string;

    public constructor(uri:string, text:string) {
        this.uri = URI.parse(uri);
        this.text = text;
    }

    //  returns the source code as one large string
    public getSource():string|undefined {
        return this.text;
    }

    //  returns the source code as an array of strings(rows)
    public getSourceLines():string[]|undefined {
        return StringUtils.splitIntoLines(this.text);
    }
}
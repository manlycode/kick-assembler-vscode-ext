
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
import { Line } from "./Project";
import LineUtils from "../utils/LineUtils";

export class ProjectFile {

    //  the uri of the document
    private uri: URI;

    //  the text of the document
    private text: string;

    private lines:Line[];

    public constructor(uri: string, text: string) {
        this.uri = URI.parse(uri);
        this.text = text;
        this.lines = this.createLines(text);
    }

    //  returns the source code as one large string
    public getSource(): string | undefined {
        return this.text;
    }

    //  returns the source code as an array of strings(rows)
    public getSourceLines(): string[] | undefined {
        return StringUtils.splitIntoLines(this.text);    
    }

    public getLines(): Line[]|undefined {
        return this.lines;
    }

    private createLines(source:string):Line[] {

        let lines = [];
        let sourceLines = this.getSourceLines();
        let next = 0;
        let last = [];
        let scope = 0;
        let scopeName = "";

        if (source) {
            
            for (var i = 0; i < sourceLines.length; i++) {

                var sourceLine = LineUtils.removeComments(sourceLines[i]); 

                let line = <Line>{};
                line.number = i;
                line.scope = scope;
                line.scopeName = scopeName;
                line.text = sourceLines[i];

                if (sourceLine) {

                    //	search for { - add to scope
                    if (sourceLine.indexOf("{") >= 0) {
                        last.push(scope);
                        next += 1;
                        scope = next;
                    }
                    
                    //	search for } - remove from scope
                    if (sourceLine.indexOf("}") >= 0) {
                        scope = last.pop();
                    }
                }

                lines.push(line);
            }
        }
        return lines;
    }
}
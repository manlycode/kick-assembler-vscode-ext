import Uri from "vscode-uri";
import { dirname } from "path";
import StringUtils from "../utils/stringUtils";

/*
    Class: AssemblerInfo

        Represents the Information Returns from the Kick Assembler

    Remarks:

        When Kick Assembler is run with the -asminfo option, it will
        produce a file called 'asminfo.txt'.

        This file contains important information about the 
        build of the assembled source files. It is used by
        the Server to return information back to the Client
        like Errors. But it can also be useful when parsing
        the symbols in the Code.
*/

export interface SourceRange {
    startLine:number;
    startPosition:number;
    endLine:number;
    endPosition:number;
    fileIndex:number;
}

export enum Sections {
    Libraries,
    Directives,
    Preprocessor,
    Files,
    Syntax,
    Errors,
}

export enum EntryType {
    Constant,
    Function,
}

export interface Library {
    name:string;
    entryType:EntryType;
    data:{};
}

export interface Directive {
    name:string;
    example:string;
    description:string;
}

export interface PPDirectives {
    name:string;
    example:string;
    description:string;
}

export interface File {
    index:number;
    system:boolean;
    uri:string;
}

export interface Syntax {
    type:string;
    sourceRange:SourceRange
    line:number;
    scope:number;
}

export interface Error {
	level: string;
	range: SourceRange;
	message: string;
}

export class AssemblerInfo {

    private libraries:Library[] = [];
    private directives:Directive[] = [];
    private preprocessor:PPDirectives[] = [];
    private files:File[] = [];
    private syntax:Syntax[] = [];
    private errors:Error[] = [];

    constructor(file:string) {

        //  load file
        var fs = require('fs');
        let uri = Uri.parse(file);
        let dir = dirname(uri.fsPath);
        let asminfo = dir + '\\\asminfo.txt';
        var data = fs.readFileSync(asminfo, 'utf8');

        //  process sections
        this.processData(data);
    }

    private processData(data:string) {

        var lines = StringUtils.splitIntoLines(data); 
        var section:Sections;

        for (var i = 0; i < lines.length; i++) {

            var line:string = lines[i];

            if (line.length <= 0)
                continue;

            if (line.toLowerCase() == "[libraries]") {
                section = Sections.Libraries;
                continue;
            }

            if (line.toLowerCase() == "[directives]") {
                section = Sections.Directives;
                continue;
            }

            if (line.toLowerCase() == "[ppdirectives]") {
                section = Sections.Preprocessor;
                continue;
            }

            if (line.toLowerCase() == "[errors]") {
                section = Sections.Preprocessor;
                continue;
            }

            if (line.toLowerCase() == "[syntax]") {
                section = Sections.Preprocessor;
                continue;
            }

            if (line.toLowerCase() == "[files]") {
                section = Sections.Preprocessor;
                continue;
            }

            switch(section) {

                case Sections.Libraries: 
                    this.libraries.push(this.processLibrary(line));
            }

        }
    }

    private processLibrary(line:string):Library {
        var parms = line.split(";");
        var library = <Library>{};
        library.name = parms[0];
        library.entryType = parms[1].toLowerCase() == "constant" ? EntryType.Constant : EntryType.Function;
        library.data = parms[2];
        return library;
    }
}


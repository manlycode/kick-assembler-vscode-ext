import Uri from "vscode-uri";
import { dirname } from "path";
import StringUtils from "../utils/StringUtils";

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

export interface PPDirective {
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
    private ppdirectives:PPDirective[] = [];
    private files:File[] = [];
    private syntax:Syntax[] = [];
    private errors:Error[] = [];

    constructor(data:string) {

        //  process the contents of the asminfo file
        this.processData(data);
    }

    public getLibraries():Library[] {
        return this.libraries;
    }

    public getDirectives():Directive[] {
        return this.directives;
    }

    public getPPDirectives():PPDirective[] {
        return this.ppdirectives;
    }

    public getFiles():File[] {
        return this.files;
    }

    public getSyntax():Syntax[] {
        return this.syntax;
    }

    public getErrors():Error[] {
        return this.errors;
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
                section = Sections.Errors;
                continue;
            }

            if (line.toLowerCase() == "[syntax]") {
                section = Sections.Syntax;
                continue;
            }

            if (line.toLowerCase() == "[files]") {
                section = Sections.Files;
                continue;
            }

            switch(section) {

                case Sections.Libraries: 
                    this.addLibrary(line);
                    break;

                case Sections.Directives:
                    this.addDirective(line);
                    break;

                case Sections.Preprocessor:
                    this.addPreprocessor(line);
                    break;

                case Sections.Errors:
                    this.addError(line);
                    break;

                case Sections.Syntax:
                    this.addSyntax(line);
                    break;

                case Sections.Files:
                    this.addFile(line);
                    break;
            }

        }
    }

    private addLibrary(line:string) {
        var parms = line.split(";");
        var library = <Library>{};
        library.name = parms[0];
        library.entryType = parms[1].toLowerCase() == "constant" ? EntryType.Constant : EntryType.Function;
        library.data = parms[2];
        this.libraries.push(library);
    }

    private addDirective(line:string) {
        var parms = line.split(";");
        let directive = <Directive>{};
        directive.name = parms[0];
        directive.example = parms[1];
        directive.description = parms[2];
        this.directives.push(directive);
    }

    private addPreprocessor(line:string) {
        var parms = line.split(";");
        let ppdirective = <PPDirective>{};
        ppdirective.name = parms[0];
        ppdirective.example = parms[1];
        ppdirective.description = parms[2];
        this.ppdirectives.push(ppdirective);
    }
    
    private addError(line:string) {
        var parms = line.split(";");
        let error = <Error>{};
        error.level = parms[0];
        error.range = this.parseRange(parms[1]);
        error.message = parms[2];
        this.errors.push(error);
    }
    
    private addSyntax(line:string) {
        var parms = line.split(";");
        let syntax = <Syntax>{};
        syntax.type = parms[0];
        syntax.sourceRange = this.parseRange(parms[1]);
        syntax.line = syntax.sourceRange.startLine;
        this.syntax.push(syntax);
    }
    
    private addFile(line:string) {
        var parms = line.split(";");
        let file = <File> {};
        file.index = parseInt(parms[0]);
        file.uri = parms[1];

        //  don't include the kick autoinclude file
        if (file.uri.indexOf('autoinclude') > 0)
            return;

        this.files.push(file);
    }
    
    private parseRange(text:string):SourceRange {
        let parms = text.split(",");
        let range = <SourceRange>{};
        range.startLine = Number(parms[0]) - 1;
        range.startPosition = Number(parms[1]) - 1;
        range.endLine = Number(parms[2]) - 1;
        range.endPosition = Number(parms[3]);
        range.fileIndex = Number(parms[4]);
        return range;
    }

}


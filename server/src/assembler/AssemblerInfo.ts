import Uri from "vscode-uri";
import { dirname } from "path";
import StringUtils from "../utils/StringUtils";

/*
    Class: AssemblerInfo

        Represents the Information Returns from the Kick Assembler

    Remarks:

        When Kick Assembler is run with the -asminfo option, it will
        produce a AssemblerFile called 'asminfo.txt'.

        This AssemblerFile contains important information about the 
        build of the assembled source AssemblerFiles. It is used by
        the Server to return information back to the Client
        like AssemblerErrors. But it can also be useful when parsing
        the symbols in the Code.
*/

export interface AssemblerSourceRange {
    startLine:number;
    startPosition:number;
    endLine:number;
    endPosition:number;
    fileIndex:number;
}

export enum AssemblerSections {
    Libraries,
    AssemblerDirectives,
    Preprocessor,
    AssemblerFiles,
    AssemblerSyntax,
    AssemblerErrors,
}

export enum AssemblerEntryType {
    Constant,
    Function,
}

export interface AssemblerLibrary {
    name:string;
    AssemblerEntryType:AssemblerEntryType;
    data:{};
}

export interface AssemblerDirective {
    name:string;
    example:string;
    description:string;
}

export interface AssemblerPreProcessorDirective {
    name:string;
    example:string;
    description:string;
}

export interface AssemblerFile {
    index:number;
    system:boolean;     //  is this an internal system file?
    main:boolean;    //  is this the main project file?
    uri:Uri;
}

export interface AssemblerSyntax {
    type:string;
    range:AssemblerSourceRange
    line:number;
    scope:number;
    fileIndex:number;
}

export interface AssemblerError {
	level: string;
	range: AssemblerSourceRange;
	message: string;
}

export class AssemblerInfo {

    private libraries:AssemblerLibrary[] = [];
    private AssemblerDirectives:AssemblerDirective[] = [];
    private AssemblerPreProcessorDirectives:AssemblerPreProcessorDirective[] = [];
    private AssemblerFiles:AssemblerFile[] = [];
    private AssemblerSyntax:AssemblerSyntax[] = [];
    private AssemblerErrors:AssemblerError[] = [];

    constructor(data:string) {
        this.processData(data); 
    }

    public getLibraries():AssemblerLibrary[] {
        return this.libraries;
    }

    public getAssemblerDirectives():AssemblerDirective[] {
        return this.AssemblerDirectives;
    }

    public getAssemblerPreProcessorDirectives():AssemblerPreProcessorDirective[] {
        return this.AssemblerPreProcessorDirectives;
    }

    public getAssemblerFiles():AssemblerFile[] {
        return this.AssemblerFiles;
    }

    public getAssemblerSyntax():AssemblerSyntax[] {
        return this.AssemblerSyntax;
    }

    public getAssemblerErrors():AssemblerError[] {
        return this.AssemblerErrors;
    }

    private processData(data:string) {

        var lines = StringUtils.splitIntoLines(data); 
        var section:AssemblerSections;

        for (var i = 0; i < lines.length; i++) {

            var line:string = lines[i];

            if (line.length <= 0)
                continue;

            if (line.toLowerCase() == "[libraries]") {
                section = AssemblerSections.Libraries;
                continue;
            }

            if (line.toLowerCase() == "[directives]") {
                section = AssemblerSections.AssemblerDirectives;
                continue;
            }

            if (line.toLowerCase() == "[ppdirectives]") {
                section = AssemblerSections.Preprocessor;
                continue;
            }

           if (line.toLowerCase() == "[errors]") {
                section = AssemblerSections.AssemblerErrors;
                continue;
            }

           if (line.toLowerCase() == "[syntax]") {
                section = AssemblerSections.AssemblerSyntax;
                continue;
            }

           if (line.toLowerCase() == "[files]") {
                section = AssemblerSections.AssemblerFiles;
                continue;
            }

            switch(section) {

                case AssemblerSections.Libraries: 
                    this.addAssemblerLibrary(line);
                    break;

                case AssemblerSections.AssemblerDirectives:
                    this.addAssemblerDirective(line);
                    break;

                case AssemblerSections.Preprocessor:
                    this.addPreprocessor(line);
                    break;

                case AssemblerSections.AssemblerErrors:
                    this.addAssemblerError(line);
                    break;

                case AssemblerSections.AssemblerSyntax:
                    this.addAssemblerSyntax(line);
                    break;

                case AssemblerSections.AssemblerFiles:
                    this.addAssemblerFile(line);
                    break;
            }

        }
    }

    private addAssemblerLibrary(line:string) {
        var parms = line.split(";");
        var assemblerLibrary = <AssemblerLibrary>{};
        assemblerLibrary.name = parms[0];
        assemblerLibrary.AssemblerEntryType = parms[1].toLowerCase() == "constant" ? AssemblerEntryType.Constant : AssemblerEntryType.Function;
        assemblerLibrary.data = parms[2];
        this.libraries.push(assemblerLibrary);
    }

    private addAssemblerDirective(line:string) {
        var parms = line.split(";");
        let assemblerDirective = <AssemblerDirective>{};
        assemblerDirective.name = parms[0];
        assemblerDirective.example = parms[1];
        assemblerDirective.description = parms[2];
        this.AssemblerDirectives.push(assemblerDirective);
    }

    private addPreprocessor(line:string) {
        var parms = line.split(";");
        let assemblerPreProcessorDirective = <AssemblerPreProcessorDirective>{};
        assemblerPreProcessorDirective.name = parms[0];
        assemblerPreProcessorDirective.example = parms[1];
        assemblerPreProcessorDirective.description = parms[2];
        this.AssemblerPreProcessorDirectives.push(assemblerPreProcessorDirective);
    }
    
    private addAssemblerError(line:string) {
        var parms = line.split(";");
        let assemblerError = <AssemblerError>{};
        assemblerError.level = parms[0];
        assemblerError.range = this.parseRange(parms[1]);
        assemblerError.message = parms[2];
        this.AssemblerErrors.push(assemblerError);
    }
    
    private addAssemblerSyntax(line:string) {
        var parms = line.split(";");
        let assemblerSyntax = <AssemblerSyntax>{};
        assemblerSyntax.type = parms[0];
        assemblerSyntax.range = this.parseRange(parms[1]);
        assemblerSyntax.line = assemblerSyntax.range.startLine;
        this.AssemblerSyntax.push(assemblerSyntax);
    }
    
    private addAssemblerFile(line:string) {
        var parms = line.split(";");
        let assemblerFile = <AssemblerFile> {};
        assemblerFile.index = parseInt(parms[0]);
        assemblerFile.uri = Uri.file(parms[1])

        //  don't include the kick autoinclude AssemblerFile
        if (assemblerFile.uri.fsPath.indexOf('autoinclude') > 0)
            assemblerFile.system = true;

        //  is this the main project file?
        if (assemblerFile.uri.fsPath.indexOf('.source.txt') > 0)
            assemblerFile.main = true;

        this.AssemblerFiles.push(assemblerFile);
    }
    
    private parseRange(text:string):AssemblerSourceRange {
        let parms = text.split(",");
        let range = <AssemblerSourceRange>{};
        range.startLine = Number(parms[0]) - 1;
        range.startPosition = Number(parms[1]) - 1;
        range.endLine = Number(parms[2]) - 1;
        range.endPosition = Number(parms[3]);
        range.fileIndex = Number(parms[4]);
        return range;
    }

}


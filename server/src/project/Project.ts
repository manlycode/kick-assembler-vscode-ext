/*
    Class:  Project

    Represents the Currently Open Source File.

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

import StringUtils from "../utils/StringUtils";

import { AssemblerInfo, AssemblerSyntax, AssemblerSourceRange } from "../assembler/AssemblerInfo";
import { Settings } from "../providers/SettingsProvider";
import { Assembler, AssemblerResults } from "../assembler/Assembler";
import { ProjectFile } from "./ProjectFile";
import { Directive } from "../definition/KickDirectives";
import { readFileSync } from "fs";
import { KickInternalSymbols, Property, Method } from "../definition/KickInternalSymbols";
import { createHash } from "crypto";
import { CompletionItemKind, SymbolKind, Range, Position, Connection } from "vscode-languageserver";
import NumberUtils from "../utils/NumberUtils";
import LineUtils from "../utils/LineUtils";
import { Parameter } from "../definition/KickPreprocessors";
import { KickLanguage } from "../definition/KickLanguage";
import Uri from "vscode-uri";

export interface Line {
    number: number;
    scope: number;
    scopeName: string;
    text: string;
}

export enum SymbolType {
    NamedLabel,
    Label,
    Constant,
    Function,
    Macro,
    PseudoCommand,
    Variable,
    Namespace,
    Parameter,
    Boolean
}

export interface Symbol {
    name: string;
    type: SymbolType;
    library?: string;
    description?: string;
    value: number;
    originalValue: string;
    kind?: SymbolKind;
    completionKind?: CompletionItemKind;
    line?: Line;
    range?: Range;
    fileIndex?: number;
    scope?: number;
    comments?: string;
    parameters?: Parameter[];
    properties?: Property[];
    methods?: Method[];
    isExternal?: boolean;
    isGlobal?: boolean;     //  is this a global symbol?
    isMain?: boolean;       //  is this a main project symbol?
    isBuiltin?: boolean;    //  is this built-ion
    data?: any;
    snippet?: string;
}

export default class Project {

    private id: string;
    private uri: string;
    private source: string;
    private imports: {};
    private assemblerResults: AssemblerResults;
    private assemblerInfo: AssemblerInfo;
    private projectFiles: ProjectFile[];
    private symbols: Symbol[];
    connection: Connection;

    constructor(uri: string) {
        this.uri = uri;
        this.id = createHash('md5').update(uri).digest('hex');
    }

    public assemble(settings: Settings, text: string) {

        if (!settings.valid) return;

        if (settings.buildMaster.trim().length > 0) {
            this.connection.window.showWarningMessage(`Build Master [${settings.buildMaster}] has been Specified.`);
        }

        let assembler = new Assembler();
        this.assemblerResults = assembler.assemble(settings, this.uri, text);
        this.assemblerInfo = this.assemblerResults.assemblerInfo;
        this.source = text;

        this.projectFiles = [];

        for (var file of this.assemblerInfo.getAssemblerFiles()) {
            if (!file.system) {
                
                var _uri: Uri = file.uri;
                var _text: string  = readFileSync(file.uri.fsPath).toString();
                var _main: boolean = file.main;

                var projectFile = new ProjectFile(_uri, _text, _main);

                this.projectFiles[file.index] = projectFile;
            }
        }

        this.symbols = this.createSymbols();
    }

    public getId(): string {
        return this.id;
    }

    public getUri(): string {
        return this.uri;
    }

    /**
     * Returns the Assembler Information
     * 
     * @param test the number
     * 
     */
    public getAssemblerInfo(): AssemblerInfo {
        return this.assemblerInfo;
    }

    /**
     * Returns the Assembler Results
     */
    public getAssemblerResults(): AssemblerResults {
        return this.assemblerResults;
    }

    /**
     * Does not return a comment
     */
    public getSource(): string {
        return this.source;
    }

    public setSource(text: string) {
        this.source = text;
    }

    public getSourceLines(): string[] {
        return StringUtils.splitIntoLines(this.source);
    }

    public getDirectives(): Directive[] {
        return KickLanguage.Directives;
    }

    /**
     * Returns all Code generated and Build-In Symbols
     */
    public getAllSymbols(): Symbol[] {
        return this.getSymbols().concat(this.getBuiltInSymbols());
    }

    public getSymbols(): Symbol[] {
        return this.symbols || [];
    }

    public getBuiltInSymbols(): Symbol[] {
        return KickInternalSymbols.getBuiltInSymbols();
    }

    public getSourceFiles(): ProjectFile[] {
        return this.projectFiles;
    }

    private createSymbols(): Symbol[] | undefined {

        var symbols = [];
        var autoIncludeFileIndex = 0;

        for (var file of this.assemblerInfo.getAssemblerFiles()) {
            if (file.system) {
                autoIncludeFileIndex = file.index;
            }
        }

        for (var syntax of this.getAssemblerResults().assemblerInfo.getAssemblerSyntax()) {
            if (syntax.range.fileIndex != autoIncludeFileIndex) {
                var symbol = this.createSymbol(syntax, this.projectFiles[syntax.range.fileIndex]);
                if (symbol) {
                    symbols.push(symbol);
                }
            }
        }

        return symbols;
    }

    private createSymbol(syntax: AssemblerSyntax, projectFile: ProjectFile): Symbol | undefined {

        var type = syntax.type.toLowerCase();
        var range = syntax.range;
        var lines = projectFile.getSourceLines();
        var line = lines[syntax.range.startLine];
        var text = line;

        var symbol: Symbol;

        if (type == "label") {
            symbol = this.createFromLabel(range, text, projectFile.isMain());
        }

        if (type == "directive" || type == "ppdirective") {
            symbol = this.createFromDirective(range, text, projectFile.isMain());
        }

        if (symbol) {

            // make any symbol starting with @ global
            
            if (symbol.name.substr(0, 1) == "@") {
                symbol.scope = 0;
                symbol.name = symbol.name.substr(1);
                symbol.isGlobal = true;
            }

            if (!symbol.data)
                symbol.data = {};

            symbol.data["uri"] = projectFile.getUri();

            symbol.line = projectFile.getLines()[syntax.range.startLine];
            symbol.range = Range.create(
                Position.create(syntax.range.startLine,syntax.range.startPosition),
                Position.create(syntax.range.endLine,syntax.range.endPosition)
            );
            symbol.fileIndex = syntax.range.fileIndex;
            symbol.comments = this.getComments(range, projectFile.getLines());

            //check for param descriptions (@param (type) parameter description)
            if(symbol.parameters && symbol.comments && (symbol.type === SymbolType.Macro || symbol.type === SymbolType.Function)) {
                let paramDocs = symbol.comments.match(/@param(eter)*.*(\r\n|\r|\n|)/g);
                if (paramDocs) {
                    paramDocs.forEach((pDoc) => {
                        let paraDocsToken = StringUtils.splitIntoTokens(pDoc.replace(/(@param(eter)*\s+|\r)/,""));
                        let setStringKind = false;
                        if(paraDocsToken[0].match(/(string|number|value)/)) {
                            paraDocsToken.shift();
                            if(paraDocsToken[0] == "string") {
                                setStringKind = true;
                            }
                        }
                        symbol.parameters.forEach( (p,i) => {
                            if (p.name == paraDocsToken[0]){
                                symbol.parameters[i].description = paraDocsToken.slice(1).join(" ");
                                if(setStringKind) symbol.parameters[i].kind = SymbolKind.String;
                            }
                        });
                    });
                }
            }
            return symbol;
        }
    }

    private createFromLabel(sourceRange: AssemblerSourceRange, text: string, main: boolean): Symbol {
        var name = text.substr(sourceRange.startPosition, (sourceRange.endPosition - 1) - sourceRange.startPosition);
        var symbol = <Symbol>{};

        symbol.name = name;
        symbol.kind = SymbolKind.Object;
        symbol.type = SymbolType.NamedLabel;
        symbol.isMain = main;
        //symbol.scope = this._kickAssemblerResults.sourceFiles[sourceRange.fileIndex].lines[sourceRange.startLine].scope;
        return symbol;
    }

    private createFromDirective(sourceRange: AssemblerSourceRange, text: string, main: boolean): Symbol {

        const directive = text.substr(sourceRange.startPosition, sourceRange.endPosition - sourceRange.startPosition).toLowerCase();
        var afterDirectiveString = text.substr(sourceRange.endPosition).trim();

        if (directive == "#define") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Boolean;
            symbol.type = SymbolType.Boolean;
            symbol.isMain = main;
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        var isEvalVar = (directive == ".eval" && afterDirectiveString.substr(0,4)=="var ");
        if (directive == ".var" || isEvalVar) {
            var symbol = this.createFromSimpleValue(isEvalVar ? afterDirectiveString.substr(4): afterDirectiveString);
            symbol.kind = SymbolKind.Variable;
            symbol.type = SymbolType.Variable;
            symbol.isMain = main;
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive == ".const") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Constant;
            symbol.type = SymbolType.Constant;
            symbol.isMain = main;
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive == ".label") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Object;
            symbol.type = SymbolType.Label;
            symbol.isMain = main;
            //return this.createFromLabel(sourceRange, text, main);
            return symbol;
        }

        if (directive == ".macro" || directive == ".function") {

            var split = StringUtils.splitFunction(text);

            if (split.length > 1) {
                var name = split[1];
                var symbol = <Symbol>{};
                
                // this was preventing internal macros from showing
                
                //if (name.startsWith("_")) return;

                if(directive == ".function"){
                    symbol.type = SymbolType.Function;
                    symbol.kind = SymbolKind.Function;
                    symbol.completionKind = CompletionItemKind.Function;

                } else {
                    symbol.type = SymbolType.Macro;
                    symbol.kind = SymbolKind.Method;
                    symbol.completionKind = CompletionItemKind.Method;
                }
                symbol.name = name;
                symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
                symbol.isMain = main;
                var parms = [];

                for (var i = 2; i < split.length; i++) {
                    var parm = <Parameter> {
                        name: split[i],
                        kind: SymbolKind.Number
                     };

                    parms.push(parm);

                    var parm_symbol = <Symbol>{};
                    parm_symbol.name = split[i];
                    parm_symbol.type = SymbolType.Parameter;
                    parm_symbol.kind = SymbolKind.Variable;
                    parm_symbol.scope = symbol.scope;
                    parm_symbol.isMain = main;
                    
                }
                if(parms.length > 0) {
                    symbol.parameters = parms;
                    symbol.snippet = '($0)';
                } else {
                    symbol.snippet = '()';
                }

                return symbol;
            }
        }
    }

    private createFromSimpleValue(text: string): Symbol {

        var symbol = <Symbol>{};

        if (text.indexOf("=") >= 0) {
            let parms = text.split("=");
            let name = parms[0].trim();
            let value = parms[1].split("//")[0].trim();
            symbol.name = name;
            symbol.type = SymbolType.Variable;
            symbol.value = NumberUtils.toDecimal(value);
            symbol.originalValue = value;
        } else {
            symbol.name = text.trim();
        }

        return symbol;
    }

    /**
     * Given a Range and Text return the comments above the Line.
     * 
     * @param range 
     * @param text 
     */
    private getComments(range: AssemblerSourceRange, lines: Line[]): string | undefined {
        return LineUtils.getRemarksAboveLine(lines, range.startLine);
    }


}
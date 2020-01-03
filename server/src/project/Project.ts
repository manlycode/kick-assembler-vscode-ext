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

import StringUtils from "../utils/StringUtils";

import { AssemblerInfo, AssemblerDirective, AssemblerSyntax, AssemblerSourceRange } from "../assembler/AssemblerInfo";
import { Settings } from "../providers/SettingsProvider";
import { Assembler, AssemblerResults } from "../assembler/Assembler";
import { ProjectFile } from "./ProjectFile";
import { Directive } from "../definition/KickDirectives";
import { readFileSync } from "fs";
import { KickInternalSymbols } from "../definition/KickInternalSymbols";
import { createHash } from "crypto";
import { CompletionItemKind, SymbolKind, Location } from "vscode-languageserver";
import NumberUtils from "../utils/NumberUtils";
import LineUtils from "../utils/LineUtils";
import { Parameter } from "../definition/KickPreprocessors";

export interface Line {
    number: number;
    scope: number;
    scopeName: string;
    text: string;
}

export enum SymbolType {
    Label,
    Constant,
    Function,
    Macro,
    PseudoCommand,
    Variable,
    Namespace,
    Parameter,
}

export interface Symbol {
    name: string;
    type: SymbolType;
    library?: string;
    description?: string;
    value: number;
    originalValue: string;
    kind?: SymbolKind;
    line?: Line;
    scope?: number;
    comments?: string;
    parameters?: Parameter[];
    isExternal?: boolean;
    isGlobal?: boolean;      //  is this a global symbol?
    isMain?: boolean;        //  is this a main project symbol?
    data?: any;
}

export default class Project {

    private id: string;
    private uri: string;
    private source: string;
    private imports: {};
    private assemblerResults: AssemblerResults;
    private assemblerInfo: AssemblerInfo;
    private projectFiles: ProjectFile[];
    private directives: Directive[];
    private symbols: Symbol[];

    constructor(uri: string) {
        this.uri = uri;
        this.id = createHash('md5').update(uri).digest('hex');
    }

    public assemble(settings: Settings, text: string) {

        if (!settings.valid) return;

        let assembler = new Assembler();
        this.assemblerResults = assembler.assemble(settings, this.uri, text);
        this.assemblerInfo = this.assemblerResults.assemblerInfo;
        this.source = text;

        this.projectFiles = [];

        for (var file of this.assemblerResults.assemblerInfo.getAssemblerFiles()) {
            if (!file.system) {
                const projectFile = new ProjectFile(file.uri, readFileSync(file.uri, 'utf8'), file.main);
                this.projectFiles[file.index] = projectFile;
            }
        }

        if (!this.directives) {
            this.directives = [];
            for (var assemblerDirective of this.assemblerResults.assemblerInfo.getAssemblerDirectives()) {
                var directive = <Directive>{};
                directive.name = assemblerDirective.name;
                directive.description = assemblerDirective.description;
                directive.example = assemblerDirective.example;
                this.directives.push(directive);
            }
        }

        if (!this.symbols) {
            this.symbols = this.createSymbols();
        }
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

    public getSourceLines(): string[] {
        return StringUtils.splitIntoLines(this.source);
    }

    public getDirectives(): Directive[] {
        return this.directives;
    }

    public getSymbols(): Symbol[] {
        return this.symbols;
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

        var s = this.getAssemblerResults().assemblerInfo.getAssemblerSyntax();

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

        if (type == "directive") {
            symbol = this.createFromDirective(range, text, projectFile.isMain());
        }

        if (symbol) {

            if (!symbol.data)
                symbol.data = {};

            symbol.data["uri"] = projectFile.getUri();

            symbol.line = projectFile.getLines()[syntax.range.startLine];
            symbol.comments = this.getComments(range, projectFile.getLines());
            return symbol;
        }
    }

    private createFromLabel(sourceRange: AssemblerSourceRange, text: string, main: boolean): Symbol {
        var name = text.substr(sourceRange.startPosition, (sourceRange.endPosition - 1) - sourceRange.startPosition);
        var symbol = <Symbol>{};

        symbol.name = name;
        symbol.type = SymbolType.Label;
        symbol.kind = SymbolKind.String;
        symbol.isMain = main;
        //symbol.scope = this._kickAssemblerResults.sourceFiles[sourceRange.fileIndex].lines[sourceRange.startLine].scope;
        return symbol;
    }

    private createFromDirective(sourceRange: AssemblerSourceRange, text: string, main: boolean): Symbol {

        const directive = text.substr(sourceRange.startPosition, sourceRange.endPosition - sourceRange.startPosition);

        if (directive.toLowerCase() == ".var") {
            var symbol = this.createFromSimpleValue(text.substr(sourceRange.endPosition));
            symbol.kind = SymbolKind.Variable;
            symbol.type = SymbolType.Variable;
            symbol.isMain = main;
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive.toLowerCase() == ".const") {
            var symbol = this.createFromSimpleValue(text.substr(sourceRange.endPosition));
            symbol.kind = SymbolKind.Constant;
            symbol.type = SymbolType.Constant;
            symbol.isMain = main;
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive.toLowerCase() == ".label") {
            var symbol = this.createFromSimpleValue(text.substr(sourceRange.endPosition));
            symbol.kind = SymbolKind.Field;
            symbol.type = SymbolType.Label;
            symbol.isMain = main;
            //return this.createFromLabel(sourceRange, text, main);
            return symbol;
        }

        if (directive.toLowerCase() == ".macro") {

            var split = StringUtils.splitFunction(text);

            if (split.length > 0) {
                var name = split[1];
                var symbol = <Symbol>{};
                
                if (name.startsWith("_")) return;

                symbol.type = SymbolType.Macro;
                symbol.kind = SymbolKind.Method;
                symbol.name = name;
                symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
                symbol.isMain = main;
                var parms = [];

                for (var i = 2; i < split.length; i++) {
                    var parm = { "name": split[i] };
                    parms.push(parm);

                    var parm_symbol = <Symbol>{};
                    parm_symbol.name = split[i];
                    parm_symbol.type = SymbolType.Parameter;
                    parm_symbol.kind = SymbolKind.Variable;
                    parm_symbol.scope = symbol.scope;
                    parm_symbol.isMain = main;
                }

                symbol.data = { "parms": parms };

                if (symbol.name.substr(0, 1) == "@") {
                    symbol.scope = 0;
                    symbol.name = symbol.name.substr(1);
                    symbol.isGlobal = true;
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
            let value = parms[1].trim();
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
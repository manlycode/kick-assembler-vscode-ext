
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
import { CompletionItemKind } from "vscode-languageserver";
import NumberUtils from "../utils/NumberUtils";
import LineUtils from "../utils/LineUtils";

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
}

export interface Symbol {
    type: SymbolType;
    name: string;
    description: string;
    value: number;
    kind: CompletionItemKind;
    line: Line;
    scope: number;
    isExternal: boolean;
    isGlobal: boolean;
    data: {};
};

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

    constructor(uri:string) {
        this.uri = uri;
        this.id = createHash('md5').update(uri).digest('hex');
    }

    public assemble(settings: Settings, text: string) {

        let assembler = new Assembler();
        this.assemblerResults = assembler.assemble(settings, this.uri, text);
        this.assemblerInfo = this.assemblerResults.assemblerInfo;
        this.source = text;

        this.projectFiles = [];

        for (var file of this.assemblerResults.assemblerInfo.getAssemblerFiles()) {
            if (!file.system) {
                const projectFile = new ProjectFile(file.uri, readFileSync(file.uri, 'utf8'));
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

    public getId():string {
        return this.id;
    }

    public getUri():string {
        return this.uri;
    }

    public getAssemblerInfo(): AssemblerInfo {
        return this.assemblerInfo;
    }

    public getAssemblerResults(): AssemblerResults {
        return this.assemblerResults;
    }

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

    public getBuiltInSymbols():Symbol[] {
        return KickInternalSymbols.getBuiltInSymbols();
    }

    private createSymbols(): Symbol[] | undefined {

        var symbols = []
        var autoIncludeFileIndex = 0;

        for (var file of this.assemblerInfo.getAssemblerFiles()) {
            if (file.system) {
                autoIncludeFileIndex = file.index;
            }
        }

        for (var syntax of this.getAssemblerResults().assemblerInfo.getAssemblerSyntax()) {
            if (syntax.range.fileIndex != autoIncludeFileIndex) {
                var symbol = this.createSymbol(syntax, this.projectFiles[syntax.range.fileIndex].getLines());
                if (symbol)
                    symbols.push(symbol);
            }
        }

        return symbols;
    }

    private createSymbol(syntax:AssemblerSyntax, lines:Line[]):Symbol|undefined {

		var type = syntax.type.toLowerCase();
        var range = syntax.range;
        var line = lines[syntax.range.startLine];
        var text = line.text;
        
        var symbol:Symbol;
        
		if (type == "label") {
			symbol = this.createFromLabel(range, text);
		}

		if (type == "directive") {
			symbol = this.createFromDirective(range, text);
		}

        if (symbol) {
            // symbol.isExternal = true;
            // symbol.line = line;
            return symbol;
        }
    }

	private createFromLabel(sourceRange:AssemblerSourceRange, text:string):Symbol {
        var name = text.substr(sourceRange.startPosition, (sourceRange.endPosition - 1) - sourceRange.startPosition);
        var symbol = <Symbol>{};
        symbol.name = name;
        symbol.type = SymbolType.Label;
        symbol.kind = CompletionItemKind.Reference;
        //symbol.scope = this._kickAssemblerResults.sourceFiles[sourceRange.fileIndex].lines[sourceRange.startLine].scope;
		return symbol;
    }
    
    private createFromDirective(sourceRange:AssemblerSourceRange, text:string):Symbol {

        const name = text.substr(sourceRange.startPosition, sourceRange.endPosition - sourceRange.startPosition);

        if (name.toLowerCase() == ".var") {

        }

        if (name.toLowerCase() == ".const") {
			var symbol = this.createFromSimpleValue(text.substr(sourceRange.endPosition));
            symbol.kind = CompletionItemKind.Value;
            symbol.type = SymbolType.Constant;
            symbol.description = LineUtils.getRemarksAboveLine(this.projectFiles[sourceRange.fileIndex].getLines(), sourceRange.startLine);
            //symbol.scope = this.projectFiles[sourceRange.fileIndex].getLines()[sourceRange.startLine].scope;
			return symbol;
        }

        if (name.toLowerCase() == ".label") {

        }
    }

	private createFromSimpleValue(text:string):Symbol {

        var symbol = <Symbol>{};

        if (text.indexOf("=") >= 0) {
            let parms = text.split("=");
            let name = parms[0].trim();
            let value = parms[1].trim();
            symbol.name = name;
            symbol.value = NumberUtils.toDecimal(value);
        } else {
            symbol.name = text.trim();
        }

		return symbol;
    }
    

}
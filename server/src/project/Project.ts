/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

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
    scope: number;
    text: string;
    cleanedText: string; //comments are removed here to avoid false positive braces or param detection within block comments in one line
}

export interface Comment {
    range: AssemblerSourceRange;
    used?: boolean;
}

export enum ScopeType {
    NamedLabel,
    Namespace,
    Function,
    Macro,
    PseudoCommand
}

export interface Scope {
    id: number;
    parentScope: number;
    line: number; // line where the scopename is defined (!) to match later with symbols
    name: string;
    type: ScopeType;
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
    range?: Range;
    position?: number;
    fileIndex?: number;
    scope: number;
    codeSneakPeek?: string;
    comments?: string;
    parameters?: Parameter[];
    parametersSymbols?: Symbol[];
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
    showStartupWarning: boolean;
    private scopes: Scope[] = [];
    private autoIncludeFileIndex:number = 0;
    private settings: Settings;

    constructor(uri: string) {
        this.uri = uri;
        this.id = createHash('md5').update(uri).digest('hex');
    }

    public assemble(settings: Settings, text: string) {

        if (!settings.valid) return;

        let assembler = new Assembler();

        // try basic assembly
        this.assemblerResults = assembler.assemble(settings, this.uri, text);
        this.assemblerInfo = this.assemblerResults.assemblerInfo;
        this.settings = settings;

        /*
            when the current file is not in the
            list of files to be compiled, we
            try to assemble again but this
            time ignoring the master
        */

        
        if (settings.startup && !this.assemblerInfo.hasCurrent) {
            if (!this.showStartupWarning)
                this.connection.window.showInformationMessage(`The Open File is Not Part of the Startup [${settings.startup}]`);
            this.assemblerResults = assembler.assemble(settings, this.uri, text, false, true);
            this.assemblerInfo = this.assemblerResults.assemblerInfo;
            this.showStartupWarning = true;
        }
        
        this.source = text;

        this.projectFiles = [];

        this.scopes = [{
            id:0,
            parentScope:0,
            line:0,
            name:'',
            type: ScopeType.NamedLabel
        }];

        for (var file of this.assemblerInfo.getAssemblerFiles()) {
            if (!file.system) {
                
                var _uri: Uri = file.uri;
                var _text: string 

                if (file.isCurrent)
                    _text = this.source;
                else 
                    _text = readFileSync(file.uri.fsPath).toString();
                    
                var _main: boolean = file.isCurrent;

                var projectFile = new ProjectFile(_uri, _text, _main, this.scopes.length, this.assemblerInfo.getAssemblerSyntax().filter(syntax => {
                    return syntax.range.fileIndex == file.index
                }));
                this.scopes = this.scopes.concat(projectFile.getScopes());
                this.projectFiles[file.index] = projectFile;
            } else {
                this.autoIncludeFileIndex = file.index;
            }
        }

        this.createSymbols();
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

    /**
     * Sets the current project file source. 
     * 
     * Mostly useful when used with the 
     * onDidChangeTextDocument event to 
     * store the latest changes for us.
     * 
     * @param text 
     */
    public setSource(text: string) {
        
        if (this.getSourceFiles().length > 0) {

            var currentProjectFile: ProjectFile = this.getSourceFiles().find(projectFile => {
                return projectFile.isMain();
            });
            
            if (currentProjectFile)
                currentProjectFile.setSource(text);
        }   
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

    public getScopes(): Scope[] {
        return this.scopes;
    }

    private createSymbols(): void {

        this.symbols = [];


        for (var syntax of this.getAssemblerResults().assemblerInfo.getAssemblerSyntax()) {
            if (syntax.range.fileIndex != this.autoIncludeFileIndex) {
                var symbol = this.createSymbol(syntax, this.projectFiles[syntax.range.fileIndex]);
                if (symbol) {
                    if(symbol.parametersSymbols) {
                        this.symbols.push(...symbol.parametersSymbols);
                        delete symbol.parametersSymbols;
                    }
                    this.symbols.push(symbol);
                }
            }
        }

    }

    private createSymbol(syntax: AssemblerSyntax, projectFile: ProjectFile): Symbol | undefined {

        var type = syntax.type.toLowerCase();
        var range = syntax.range;
        var lines = projectFile.getLines();
        var line = lines[syntax.range.startLine];

        if (!line)
            return;
            
        var text = line.cleanedText;

        var symbol: Symbol;

        if (type == "label") {
            symbol = this.createFromLabel(range, text, projectFile);
        }

        if (type == "directive" || type == "ppdirective") {
            symbol = this.createFromDirective(range, text, projectFile);
        }

        if (symbol) {

            // make any symbol starting with @ global
            
            if (symbol.name.substr(0, 1) == "@") {
                symbol.scope = 0;
                symbol.name = symbol.name.substr(1);
                symbol.isGlobal = true;
            }

            symbol.range = Range.create(
                Position.create(syntax.range.startLine, symbol.position || syntax.range.startPosition),
                Position.create(syntax.range.endLine, symbol.position ? symbol.position + symbol.name.length : syntax.range.endPosition)
            );
            symbol.fileIndex = syntax.range.fileIndex;
            symbol.comments = this.getComments(range, projectFile.getLines());

            //check for param descriptions (@param (type) parameter description)
            if(symbol.parameters && symbol.comments && (symbol.type === SymbolType.Macro || symbol.type === SymbolType.Function || symbol.type === SymbolType.PseudoCommand)) {
                let paramDocs = symbol.comments.match(/@param(eter)*.*(\r\n|\r|\n|)/g);
                if (paramDocs) {
                    paramDocs.forEach((pDoc) => {
                        let paraDocsToken = StringUtils.splitIntoTokens(pDoc.replace(/(@param(eter)*\s+|\r)/,""));
                        let setStringKind = false;
                        if(paraDocsToken[0].match(/(string|number|value)/)) {
                            if(paraDocsToken[0] == "string") {
                                setStringKind = true;
                            }
                            paraDocsToken.shift();
                        }
                        symbol.parameters.forEach( (p,i) => {
                            if (p.name == paraDocsToken[0]){
                                var pDocs = paraDocsToken.slice(1).join(" ");
                                symbol.parameters[i].description = pDocs;
                                symbol.parametersSymbols[i].description = pDocs;
                                if(setStringKind) symbol.parameters[i].kind = SymbolKind.String;
                            }
                        });
                    });
                }
            }
            if(symbol.parametersSymbols){
                for(var i=0,il=symbol.parametersSymbols.length;i<il;i++){
                    symbol.parametersSymbols[i].range = symbol.range;
                    symbol.parametersSymbols[i].fileIndex = symbol.fileIndex;
                }
            }
            return symbol;
        }
    }

    private createFromLabel(sourceRange: AssemblerSourceRange, text: string, projectFile: ProjectFile): Symbol {
        var name = text.substr(sourceRange.startPosition, (sourceRange.endPosition - 1) - sourceRange.startPosition);
        var symbol = <Symbol>{};

        var lines = projectFile.getLines();

        var isNamespace = projectFile.getScopes().find(scope => {
            return scope.line == sourceRange.startLine && scope.name == name;
        });
        symbol.name = name;
        symbol.kind = isNamespace ? SymbolKind.Namespace : SymbolKind.Object;
        symbol.type = SymbolType.NamedLabel;
        symbol.isMain = projectFile.isMain();
        symbol.scope = lines[sourceRange.startLine].scope;
        let codeSneakPeek: String[] = [];
        for(var i=sourceRange.startLine;i<sourceRange.startLine + this.settings.codeSneakPeekLines;i++){
            if(lines[i]){
                codeSneakPeek.push(lines[i].text);
            }
        }
        if(codeSneakPeek.length>0) {
            symbol.codeSneakPeek = codeSneakPeek.join("   \n");
        }
        return symbol;
    }

    private createFromDirective(sourceRange: AssemblerSourceRange, text: string, projectFile: ProjectFile): Symbol {

        const directive = text.substr(sourceRange.startPosition, sourceRange.endPosition - sourceRange.startPosition).toLowerCase();
        var afterDirectiveString = text.substr(sourceRange.endPosition).trim();

        if (directive == "#define") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Boolean;
            symbol.type = SymbolType.Boolean;
            symbol.isMain = projectFile.isMain();
            symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        var isEvalVar = (directive == ".eval" && afterDirectiveString.substr(0,4)=="var ");
        if (directive == ".var" || isEvalVar) {
            var symbol = this.createFromSimpleValue(isEvalVar ? afterDirectiveString.substr(4): afterDirectiveString);
            symbol.kind = SymbolKind.Variable;
            symbol.type = SymbolType.Variable;
            symbol.isMain = projectFile.isMain();
            symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive == ".const") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Constant;
            symbol.type = SymbolType.Constant;
            symbol.isMain = projectFile.isMain();
            symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive == ".label") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            symbol.kind = SymbolKind.Constant;
            symbol.type = SymbolType.Label;
            symbol.isMain = projectFile.isMain();
            symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
            return symbol;
        }

        if (directive == ".namespace" || directive == ".filenamespace") {
            var symbol = this.createFromSimpleValue(afterDirectiveString);
            if(!this.symbols.find(exSymbol => {
                return exSymbol.name == symbol.name && exSymbol.type == SymbolType.Namespace;
            })) {
                symbol.kind = SymbolKind.Namespace;
                symbol.type = SymbolType.Namespace;
                symbol.isMain = projectFile.isMain();
                symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
                return symbol;
            }
        }

        if (directive == ".macro" || directive == ".function" || directive == ".pseudocommand") {
            const isPseudo = directive == ".pseudocommand";

            var split = StringUtils.splitFunction(text, isPseudo);

            if (split.length > 1) {
                var name = split[1];
                var symbol = <Symbol>{};
                
                // this was preventing internal macros from showing
                
                //if (name.startsWith("_")) return;

                if(directive == ".function"){
                    symbol.type = SymbolType.Function;
                    symbol.kind = SymbolKind.Function;
                    symbol.completionKind = CompletionItemKind.Function;

                } else if(directive == ".pseudocommand") {
                    symbol.type = SymbolType.PseudoCommand;
                    symbol.kind = SymbolKind.Method;
                    symbol.completionKind = CompletionItemKind.Snippet;
                } else {
                    symbol.type = SymbolType.Macro;
                    symbol.kind = SymbolKind.Method;
                    symbol.completionKind = CompletionItemKind.Method;
                }
                symbol.name = name;
                symbol.scope = projectFile.getLines()[sourceRange.startLine].scope;
                symbol.isMain = projectFile.isMain();

                let scopeInfo:Scope = projectFile.getScopes().find(scope => {
                    return scope.line == sourceRange.startLine
                });
                var parms = [];
                var parmsSymbols: Symbol[] = [];

                for (var i = 2; i < split.length; i++) {
                    var parm = <Parameter> {
                        name: split[i],
                        kind: SymbolKind.Number
                     };

                    parms.push(parm);

                    var parm_symbol = <Symbol>{};
                    parm_symbol.name = split[i];
                    parm_symbol.type = SymbolType.Parameter;
                    parm_symbol.kind = SymbolKind.Property;
                    parm_symbol.scope = scopeInfo ? scopeInfo.id : symbol.scope;   //scopeinfo should always be found though
                    parm_symbol.isMain = projectFile.isMain();

                    parmsSymbols.push(parm_symbol);                   
                }
                if(parms.length > 0) {
                    symbol.parameters = parms;
                    symbol.parametersSymbols = parmsSymbols;
                    symbol.snippet = isPseudo ? ' $0': '($0)';
                } else {
                    symbol.snippet = isPseudo ? '\n' : '()';
                }
                
                symbol.position = text.indexOf(symbol.name);
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
            symbol.name = text.trim().split(" ")[0];
        }
        symbol.position = text.indexOf(symbol.name);

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
/*

*/

const { resolve } = require('path');
const { readdir } = require('fs').promises;
import * as fs from 'fs';
import * as path from 'path';

import {
	Provider, ProjectInfoProvider
} from "./Provider";

import {
	CompletionItem,
	CompletionItemKind,
	IConnection,
	TextDocumentPositionParams,
	TextEdit,
	MarkupContent
} from "vscode-languageserver";

enum LanguageCompletionTypes {
	Instruction,
	Symbol,
	Label,
	Register,
	PseudoOp,
	PreProcessor,
	Directives,
}

import Project, { SymbolType, Line } from "../project/Project";
import LineUtils from "../utils/LineUtils";
import { KickLanguage } from "../definition/KickLanguage";
import StringUtils from "../utils/StringUtils";
import PathUtils from '../utils/PathUtils'; 
import { InstructionType } from '../definition/KickInstructions';

export default class CompletionProvider extends Provider {

	private textDocumentPosition: TextDocumentPositionParams;

	private documentPosition:TextDocumentPositionParams;
	private documentSource:string[];

	private trigger:string;
	private triggerToken:string;
	private triggerLine:string;
	private triggerCharacterPos: number;

	private intelligentLabels:boolean;

	constructor(connection: IConnection, projectInfo: ProjectInfoProvider) {

		super(connection, projectInfo);

		// 	show the initial list of items
		connection.onCompletion((textDocumentPosition:TextDocumentPositionParams): undefined|Thenable<CompletionItem[]> => {
			if (projectInfo.getSettings().valid) {
				this.documentPosition = textDocumentPosition;
				return this.createCompletionItems();
			}
		});

		//	request for more details of a particular item
		connection.onCompletionResolve((item:CompletionItem):CompletionItem => {
			if (projectInfo.getSettings().valid) {
				return this.resolveItem(item);
			}
		});
    }
    
	private async createCompletionItems():Promise<CompletionItem[]> {

		/*
			working out some new pseudo code for completion logic

			no tokens?
				trigger is #?
					show pre-processor directives
				trigger is "."
					show directives
			there are tokens?
				trigger is "<" or ">"
					show vars, labels
				last token ended with ";", ":", "{", "}"?
					trigger is "."?
						show directives
				last token was an instruction or pseudocommand?
					show vars, labels, macros, functions
				last token was nothing?
					show instructions, macros, pseudocommands
				last token was pre-processor directive
					show booleans (made of #define)

		*/

		var items:CompletionItem[] = [];
		
		const settings = this.getProjectInfo().getSettings();

		if (!settings.valid) return;

		this.triggerCharacterPos = this.documentPosition.position.character - 1;

		this.documentSource = this.getProjectInfo().getCurrentProject().getSourceLines();
		this.triggerLine = this.documentSource[this.documentPosition.position.line];
		this.trigger = this.triggerCharacterPos >=0 ? this.triggerLine[this.triggerCharacterPos] : "";

		//	get number of tokens before trigger character
		this.triggerToken = StringUtils.GetWordAt(this.triggerLine, this.triggerCharacterPos);
		var tokensLeft = StringUtils.GetWordsBefore(this.triggerLine, this.triggerCharacterPos);
//		var tokensRight = StringUtils.GetWordsAfter(this.triggerLine, triggerCharacterPos);

		// No autocomplete in comments
		var blockCommentStart = this.triggerLine.indexOf('/*');
		var blockCommentEnd = this.triggerLine.lastIndexOf('*/');
		if ((blockCommentStart < this.triggerCharacterPos && blockCommentEnd > this.triggerCharacterPos ) ||
			(tokensLeft && tokensLeft.filter(token => token.indexOf("//") !== -1).length > 0) ||
			this.triggerToken.substr(0,2) == "//" ||
			this.triggerToken == "/*"
			) {
			return;
		}
		var cl=this.documentPosition.position.line-1;
		var inComment=false;
		while(cl>=0) {
			blockCommentStart = this.documentSource[cl].indexOf('/*');
			blockCommentEnd = this.documentSource[cl].lastIndexOf('*/');
			if (blockCommentStart < blockCommentEnd) break;
			if (blockCommentStart > blockCommentEnd) {
				inComment=true;
				break;
			}
			cl--;
		}
		if(inComment) return;

		var inStringTest = this.triggerLine.substr(0,this.triggerCharacterPos).replace(/("([^\\"]|\\")*"|'([^\\']|\\')*')/g,"");
		if (inStringTest.match(/["']/) || this.triggerToken=='""' || this.triggerToken=="''") {
//inside a string quote, now check if its a file selection, its the only allowed intellisense possibility here
			if((tokensLeft && 
				tokensLeft[0].match(/\.*import(if)*/) ||
				tokensLeft[tokensLeft.length-1].substr(0,4) == "Load")
			) {
				var extensionFilter = '';
				if(tokensLeft[0].substr(0,6) === "import" || (tokensLeft[0] === ".import" && tokensLeft[1] === "source") ){
					extensionFilter = settings.fileTypesSource;
				}
				if(tokensLeft[tokensLeft.length-1].substr(0,10) == "LoadBinary" || (tokensLeft[0] === ".import" && tokensLeft[1] === "binary") ){
					extensionFilter = settings.fileTypesBinary;
				}
				if(tokensLeft[tokensLeft.length-1].substr(0,7) == "LoadSid"){
					extensionFilter = settings.fileTypesSid;
				}
				if(tokensLeft[tokensLeft.length-1].substr(0,11) == "LoadPicture"){
					extensionFilter = settings.fileTypesPicture;
				}
				if(tokensLeft[0] === ".import" && tokensLeft[1] === "c64"){
					extensionFilter = settings.fileTypesC64;
				}
				if(tokensLeft[0] === ".import" && tokensLeft[1] === "text"){
					extensionFilter = settings.fileTypesText;
				}

				extensionFilter = extensionFilter.trim()	
					.replace(/  +/g,' ')	// reduce multiple spaces to one
					.replace(".","")		// remove possible extension dots
					.replace(/[, ]/g,"|")	//convert them to regex or
				;
				const currentUri = PathUtils.getPathFromFilename(this.getProjectInfo().getCurrentProject().getUri());
				return this.loadFileSystem(extensionFilter,PathUtils.uriToPlatformPath(currentUri));
			}
			return;
		}

		// 	preproc only on "#" trigger as first directive in line
		if (!tokensLeft && this.trigger == "#") {
			items = this.loadPreprocessorDirectives();
		} 

		if(this.trigger == "."){
			var preparedToken = StringUtils.GetWordAt(this.triggerLine, this.triggerCharacterPos, false).replace(/\(.*?\)/g,"");
			var possibleInternalClass = LineUtils.getTokenAtLinePosition(preparedToken,preparedToken.length - 1);
			if(possibleInternalClass) {
				var symbolInstance = "", instancePos;
				for (let symbol of this.getProjectInfo().getCurrentProject().getSymbols()) {
					if (symbol.name == possibleInternalClass) {
						instancePos = symbol.originalValue.indexOf("(");
						if(instancePos > 0) {
							symbolInstance = symbol.originalValue.substr(0,instancePos);
							continue;
						}
					}
				}				
				for (let symbol of this.getProjectInfo().getCurrentProject().getBuiltInSymbols()) {
					if (symbol.name == possibleInternalClass || symbol.name == symbolInstance) {
						if(symbol.properties) {
							symbol.properties.forEach((property)=> {
								items.push(this.createCompletionItem(property.name, LanguageCompletionTypes.Symbol, property, CompletionItemKind.Property));
							});
						}
						if(symbol.methods) {
							symbol.methods.forEach((method)=> {
								items.push(this.createCompletionItem(method.name, LanguageCompletionTypes.Symbol, method, CompletionItemKind.Method));
							});	
						}
					}
				}

			} else if (items.length === 0 && !tokensLeft) {
				items = this.loadDirectives();
			}
		}

		if (items.length === 0) {
			var prevToken:string = "";
			var prevSymbolType:SymbolType;

			if(tokensLeft) {
				var lastToken = tokensLeft[tokensLeft.length - 1].toLowerCase();
				const instructionMatch = KickLanguage.Instructions.find((instruction) => {
					return instruction.name.toLowerCase() === lastToken;
				});
				if (instructionMatch) {
					prevToken = "instruction";
				}

				if(prevToken == "") {
					const symbolMatch = this.getProjectInfo().getCurrentProject().getSymbols().find((the_symbol) => {
						return the_symbol.name.toLowerCase() === lastToken;
					});
					if (symbolMatch) {
						prevToken = "symbol";
						prevSymbolType = symbolMatch.type;
					}
				}

				if(prevToken == "") {
					const preProcessorMatch = KickLanguage.PreProcessors.find((preProcessor) => {
						return preProcessor.name.toLowerCase().substring(1) === lastToken && preProcessor.parameters.length > 0;
					});
					if (preProcessorMatch) {
						prevToken = "preprocessor";
					}			
				}

				if(prevToken == "") {
					var firstToken = tokensLeft[0].toLowerCase();
					const directiveMatch = KickLanguage.Directives.find((directive) => {
						return directive.name.toLowerCase() === lastToken || directive.name.toLowerCase() === firstToken;
					});
					if (directiveMatch) {
						prevToken = "directive";
					}			
				}
			}

			// always insert named labels
			items = items.concat(this.loadSymbols(SymbolType.NamedLabel));

			// completion items for unhandled previous tokens
			if (prevToken == "") {

				items = this.loadInstructions();

				// insert macros
				items = items.concat(this.loadSymbols(SymbolType.Macro));

				// insert pseudocommands
				items = items.concat(this.loadSymbols(SymbolType.PseudoCommand));

				// insert namespaces
				items = items.concat(this.loadSymbols(SymbolType.Namespace));

				items.push(this.createCompletionItem(KickLanguage.Star.name, LanguageCompletionTypes.Label, KickLanguage.Star, CompletionItemKind.Value));
			}	

			if (prevToken == "instruction") {
				//items = items.concat(this.loadSymbols(SymbolType.NamedLabel));
				items = items.concat(this.loadSymbols(SymbolType.Function));
				items = items.concat(this.loadSymbols(SymbolType.Variable));
				items = items.concat(this.loadSymbols(SymbolType.Label));
				items = items.concat(this.loadSymbols(SymbolType.Constant));
				items = items.concat(this.loadSymbols(SymbolType.Macro));
				items = items.concat(this.loadSymbols(SymbolType.Namespace));
			}

			if (prevToken == "symbol" || prevToken == "directive") {
				//items = items.concat(this.loadSymbols(SymbolType.NamedLabel));
				items = items.concat(this.loadSymbols(SymbolType.Function));
				items = items.concat(this.loadSymbols(SymbolType.Variable));
				items = items.concat(this.loadSymbols(SymbolType.Label));
				items = items.concat(this.loadSymbols(SymbolType.Constant));
				items = items.concat(this.loadSymbols(SymbolType.Namespace));
			}

			if (prevToken == "preprocessor" && lastToken !== "define") {
				items = items.concat(this.loadSymbols(SymbolType.Boolean));
			}

		}
// to prevent confusing word proposals (it's a central setting in vscode) return at least one item 
		if(items.length===0){
			items.push(this.createCompletionItem(" ",LanguageCompletionTypes.Symbol,{},CompletionItemKind.Text));
		}
		return items;
	}

	private async loadFileSystem(extensionFilter:string, dir:string,base?:string):Promise<CompletionItem[]> {
		let isRoot = !base;
		if (!base) base = dir;
		// make setting entries dynamic :)
		const outputDirectory = this.getProjectInfo().getSettings().outputDirectory;
		const currentEditorFile = path.basename(this.getProjectInfo().getCurrentProject().getUri());
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(
			dirents
			.filter((dirent: fs.Dirent) => {
				const ext = path.extname(dirent.name);
				const extReg = new RegExp("\\.("+extensionFilter+")", "i");
				return dirent.name !== currentEditorFile && dirent.name !== outputDirectory && dirent.name[0] !== '.' && (extensionFilter == "" || dirent.isDirectory() || ext.match(extReg));
			})
			.map((dirent: fs.Dirent) => {
				const res = resolve(dir, dirent.name);
				const ext = path.extname(dirent.name);
				const relPath = res.replace(base,"").substr(1);
				const documentation = ext.match(/\.(jpg|png|gif)/i) ? {
					value: `![](file://${res})\n\n\n\n\n\n\n\n\#### Preview`,
					kind: 'markdown'
				} : '';
				return dirent.isDirectory() ? this.loadFileSystem(extensionFilter,res,base) : <CompletionItem> {
					label: relPath,
					kind: CompletionItemKind.File,
					documentation,
					data: {
						payload:{}
					}
				};
			})
		);
		var cleanedFiles = files.filter((entry:CompletionItem) => {
			return !!entry.label;
		});
		if(isRoot && cleanedFiles.length === 0){
		// to prevent confusing word proposals (it's a central setting in vscode) return at least one item 
			cleanedFiles.push(<CompletionItem> {
				label: "No matching files found",
				kind: CompletionItemKind.File,
				data: {
					payload:{}
				}
			});
		}
		return Array.prototype.concat(...cleanedFiles);
	}

	private createCompletionItem(label:string, type:LanguageCompletionTypes, payload:any, kind:CompletionItemKind):CompletionItem {
		
		let filterText = label;
		let textEdit: TextEdit = {
			newText: label,
			range: {
				start: this.documentPosition.position,
				end: this.documentPosition.position
			}
		};

		if (this.trigger.match(/[.#]/) && (type == LanguageCompletionTypes.PreProcessor || type == LanguageCompletionTypes.Directives)) {			
			filterText = filterText.substr(1);
			textEdit.newText = label.substr(1);
		}
		if(!this.trigger.match(/[.#,<> ]/)) {
			textEdit.range.start.character = this.triggerCharacterPos;
			textEdit.range.end.character = this.triggerCharacterPos;			
		}

		let documentation: string | MarkupContent = payload.description || payload.comments ? {
			value:	(payload.description || payload.comments) +
					(payload.example ? "\n***\n"+payload.example : "") +
					(payload.deprecated ? "\n***\n*(deprecated)*" : "") + 
					(payload.type && payload.type == InstructionType.Illegal ? "\n***\n**(Illegal opcode)**" : "") + 
					(payload.type && payload.type == InstructionType.DTV ? "\n***\n**(DTV opcode)**" : "") + 
					(payload.type && payload.type == InstructionType.C02 ? "\n***\n**(65c02 opcode)**" : ""),
			kind: 'markdown'
		} : "";

		let adjustedSnippet = (payload.snippet || "");
		if(payload.snippet && payload.snippet === "($0)" && payload.parameters && this.getProjectInfo().getSettings().completionParameterPlaceholders){
			var paramSnippet: string[] = [];
			for (var i=0,iL=payload.parameters.length;i<iL;i++){
				paramSnippet.push("${"+(i+1)+":"+payload.parameters[i].name+"}");
			}
			adjustedSnippet='('+paramSnippet.join(',')+')';
		}
		textEdit.newText += adjustedSnippet;

		let command: string = "";
		if(payload.snippet) {
			if (payload.snippet[0] === "(" && payload.snippet[1] !== '"' && payload.parameters && payload.parameters.length > 0) {
				command = 'editor.action.triggerParameterHints';
			} else if (payload.snippet.substr(0,2) !== "()" && payload.snippet !== "\n") {
				command = 'editor.action.triggerSuggest';
			}
		}
		return {
			label,
			kind,
			documentation,
			filterText,
			textEdit,
			insertTextFormat: 2,
			command: {
				title: '',
				command
			},
			data: {
				type,
				payload
			}
		};
	
	}

	private resolveItem(item:CompletionItem):CompletionItem {
		item.detail = item.data.payload.detail;
		return item;
	}

	private loadInstructions(): CompletionItem[] {

		var items: CompletionItem[] = [];
		var settings = this.getProjectInfo().getSettings();
		for (let instruction of KickLanguage.Instructions) {
			const name = instruction.name.toLocaleLowerCase();
			if (!instruction.type ||
				(instruction.type === InstructionType.Illegal && settings.opcodes.illegal) ||
				(instruction.type === InstructionType.DTV && settings.opcodes.DTV) ||
				instruction.type === InstructionType.C02 && settings.opcodes["65c02"]) { 
				items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, instruction, CompletionItemKind.Text));
			}
		}

		return items;
	}

	private loadDirectives(): CompletionItem[] {
		
		var items: CompletionItem[] = [];

		for (let directive of KickLanguage.Directives) {
			const name = directive.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Directives, directive, CompletionItemKind.Interface));
		}

		return items;
	}


	private loadPreprocessorDirectives(): CompletionItem[] {

		var items: CompletionItem[] = [];

		for (let pp of KickLanguage.PreProcessors) {
			const name = pp.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.PreProcessor, pp, CompletionItemKind.Interface));
		}

		return items;

	}

	/**
	 * Load Symbols from Source file and Built In Resources.
	 * @param symbolType 
	 */
	private loadSymbols(symbolType:SymbolType): CompletionItem[] {

		var items: CompletionItem[] = [];
		var symbols = this.getProjectInfo().getCurrentProject().getSymbols();

		// project symbols
		for (let symbol of symbols) {
			if (symbol.type == symbolType) {
				items.push(this.createCompletionItem(symbol.name, LanguageCompletionTypes.Label, symbol, symbol.completionKind || CompletionItemKind.Class));
			}
		}

		// built-in symbols
		for (let symbol of this.getProjectInfo().getCurrentProject().getBuiltInSymbols()) {
			if (symbol.type == symbolType) {
				items.push(this.createCompletionItem(symbol.name, LanguageCompletionTypes.Label, symbol, symbol.completionKind || CompletionItemKind.Class));
			}

		}

		return items;
	}

}

/*

*/

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
import URI from "vscode-uri";
import { KickDirectives } from "../definition/KickDirectives";
import { PreProcessor } from "../definition/KickPreprocessors";
import { AssemblerResults } from "../assembler/Assembler";
import StringUtils from "../utils/StringUtils";

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
		connection.onCompletion((textDocumentPosition:TextDocumentPositionParams): CompletionItem[] => {
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
    
	private createCompletionItems():CompletionItem[] {

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

		// No autocomplete in line comments or within strings
		if ((tokensLeft && tokensLeft.indexOf("//") !== -1) ||
			this.triggerToken.substr(0,1).match(/["']/) ||
			this.triggerToken.substr(-1).match(/["']/) ||
			this.triggerToken.substr(0,2) == "//") {
			return;
		}

		// 	preproc only on "#" trigger as first directive in line
		if (!tokensLeft && this.trigger == "#") {
			items = this.loadPreprocessorDirectives();
		} 
		
		//	directives only on '.' trigger with no token
		if (items.length === 0 && !tokensLeft && this.trigger == ".") {
			items = this.loadDirectives();
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
						return preProcessor.name.toLowerCase() === lastToken && preProcessor.parameters.length > 0;
					});
					if (preProcessorMatch) {
						prevToken = "preprocessor";
					}			
				}

				if(prevToken == "") {
					var firstToken = tokensLeft[0].toLowerCase();
					const directiveMatch = this.getProjectInfo().getCurrentProject().getAssemblerInfo().getAssemblerDirectives().find((directive) => {
						return directive.name.toLowerCase() === lastToken || directive.name.toLowerCase() === firstToken;
					});
					if (directiveMatch) {
						prevToken = "directive";
					}			
				}
			}

			if (prevToken == "") {

				items = this.loadInstructions();

				//	insert macros
				items = items.concat(this.loadSymbols(SymbolType.Macro));

				//	insert pseudocommands
				items = items.concat(this.loadSymbols(SymbolType.PseudoCommand));

				//	insert namespaces
				items = items.concat(this.loadSymbols(SymbolType.Namespace));
			}	

			if (prevToken == "instruction") {
				items = items.concat(this.loadSymbols(SymbolType.NamedLabel));
				items = items.concat(this.loadSymbols(SymbolType.Function));
				items = items.concat(this.loadSymbols(SymbolType.Variable));
				items = items.concat(this.loadSymbols(SymbolType.Label));
				items = items.concat(this.loadSymbols(SymbolType.Constant));
				items = items.concat(this.loadSymbols(SymbolType.Macro));
				items = items.concat(this.loadSymbols(SymbolType.Namespace));
			}

			if (prevToken == "symbol" || prevToken == "directive") {
				items = items.concat(this.loadSymbols(SymbolType.NamedLabel));
				items = items.concat(this.loadSymbols(SymbolType.Variable));
				items = items.concat(this.loadSymbols(SymbolType.Label));
				items = items.concat(this.loadSymbols(SymbolType.Constant));
				items = items.concat(this.loadSymbols(SymbolType.Namespace));
			}

			if (prevToken == "preprocessor" && lastToken !== "#define") {
				items = items.concat(this.loadSymbols(SymbolType.Boolean));
			}

		}

		return items;
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
			value:(payload.description || payload.comments) + (payload.example ? "\n***\n"+payload.example : ""),
			kind: 'markdown'
		} : "";

		return {
			label,
			kind,
			documentation: documentation,
			filterText: filterText,
			textEdit: textEdit,
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

		for (let instruction of KickLanguage.Instructions) {
			const name = instruction.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, instruction, CompletionItemKind.Text));
		}

		return items;
	}

	private loadDirectives(): CompletionItem[] {
		
		var items: CompletionItem[] = [];

		var _directives = this.getProjectInfo().getCurrentProject().getAssemblerInfo().getAssemblerDirectives();
		for (let directive of _directives) {
			const name = directive.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Directives, directive, CompletionItemKind.Interface));
		}

		return items;
	}


	private loadPreprocessorDirectives(): CompletionItem[] {

		var items: CompletionItem[] = [];

		var _pps = this.getProjectInfo().getCurrentProject().getAssemblerInfo().getAssemblerPreProcessorDirectives();
		for (let pp of _pps) {
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
				items.push(this.createCompletionItem(symbol.name, LanguageCompletionTypes.Label, symbol, CompletionItemKind.Class));
			}
		}

		// built-in symbols
		for (let symbol of this.getProjectInfo().getCurrentProject().getBuiltInSymbols()) {
			if (symbol.type == symbolType) {
				items.push(this.createCompletionItem(symbol.name, LanguageCompletionTypes.Label, symbol, CompletionItemKind.Class));
			}

		}

		return items;
	}

}

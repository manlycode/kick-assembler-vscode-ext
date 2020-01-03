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
	TextEdit
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

	private project: Project;
	private textDocumentPosition: TextDocumentPositionParams;

	private documentPosition:TextDocumentPositionParams;
	private documentSource:string[];

	private trigger:string;
	private triggerToken:string;
	private triggerLine:string;

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
				last token ended with ";", ":", "{", "}"?
					trigger is "."?
						show directives
				last token was an instruction or pseudocommand?
					show vars, labels, macros, functions
				last token was nothing?
					show instructions, macros, pseudocommands

		*/

		const lineNumber = this.documentPosition.position.line;
		//const lines:ILine[] = this.getProjectInfo().getCurrentProject().(this.documentPosition.textDocument);
		//const line:ILine = lines[lineNumber];
		var items:CompletionItem[] = [];
		
		const settings = this.getProjectInfo().getSettings();

		if (!settings.valid) return;

		const assemblerResults:AssemblerResults = this.getProjectInfo().getCurrentProject().getAssemblerResults();

		var loaded:boolean;

		this.documentSource = this.getProjectInfo().getCurrentProject().getSourceLines();
		this.triggerLine = (this.documentSource[this.documentPosition.position.line].trimLeft());
		this.trigger = "";

		//	get number of tokens before trigger character
		var token = StringUtils.GetWordAt(this.triggerLine, this.documentPosition.position.character);
		var tokensLeft = StringUtils.GetWordsBefore(this.triggerLine, this.documentPosition.position.character);
		var tokensRight = StringUtils.GetWordsAfter(this.triggerLine, this.documentPosition.position.character);

		//	find position of trigger if available

		//	is it from a #?
		var pos = this.triggerLine.indexOf("#");

		//	is it from a .?
		if (pos < 0) {
			pos = this.triggerLine.indexOf(".");
		}

		//	trigger character found as first character on line
		if (pos == 0) {
			this.trigger = this.triggerLine.substr(pos,1);
		} 

		// 	preproc only on "#" trigger
		if (this.trigger == "#" && !loaded ) {
			for (let pp of assemblerResults.assemblerInfo.getAssemblerPreProcessorDirectives()) {
				items.push(this.createCompletionItem(pp.name.toLocaleLowerCase(), LanguageCompletionTypes.PreProcessor, pp, CompletionItemKind.Interface, this.documentPosition));
				loaded = true;
			}
		} 

		//	directives only on '.' trigger with no token
		if (this.trigger == "." && !loaded ) {
			for (let directive of assemblerResults.assemblerInfo.getAssemblerDirectives()) {
				items.push(this.createCompletionItem(directive.name.toLocaleLowerCase(), LanguageCompletionTypes.Directives, directive, CompletionItemKind.Interface, this.documentPosition));
				loaded = true;
			}
		}

		if (!loaded) {

			var prevToken:string = "";
			var prevSymbolType:SymbolType;

			//	get tokens
			this.triggerLine = this.triggerLine.replace("#", "");
			this.triggerLine = this.triggerLine.replace("$", "");
			this.triggerLine = this.triggerLine.replace("%", "");

			var tokens = this.triggerLine.trim().split(" ");

			var lastToken:string;
			//	do we have some tokens?
			if (tokens.length <= 1) {
				lastToken = tokens[0]
			}

			if (tokens.length > 1) {
				//	grab the previous token
				lastToken = tokens[tokens.length - 1];
			}

			lastToken = lastToken.replace(".", "");
			//var token = LineUtils.getTokenAtPosition(this.triggerLine, textDocumentPosition.position.character);
			
			const instructionMatch = KickLanguage.Instructions.find((instruction) => {
				return instruction.name.toLowerCase() === lastToken.toLowerCase();
			});
			if (instructionMatch) {
				prevToken = "instruction";
			}
			const symbolMatch = this.getProjectInfo().getCurrentProject().getSymbols().find((the_symbol) => {
				return the_symbol.name.toLowerCase() === lastToken.toLowerCase();
			});
			if (symbolMatch) {
				prevToken = "symbol";
				prevSymbolType = symbolMatch.type;
			}

			var line:Line = null;
			var lastToken:string = null;

			if (prevToken == "") {

				//for (let directive of assemblerResults.assemblerInfo.directives) {
				//	items.push(this.createCompletionItem(directive.name.toLocaleLowerCase(), LanguageCompletionTypes.Directives, directive, CompletionItemKind.Interface, textDocumentPosition));
				//	loaded = true;
				//}

				for (let instruction of KickLanguage.Instructions) {
					const name = instruction.name.toLocaleLowerCase();
					items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, instruction, CompletionItemKind.Text, this.documentPosition));
					loaded = true;
				}

				//	insert macros
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Macro));

				//	insert pseudocommands
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.PseudoCommand));

				//	insert namespaces
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Namespace));
			}	

			if (prevToken == "instruction") {
				var symbols = this.getProjectInfo().getCurrentProject().getSymbols();
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Function));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Variable));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Label));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Constant));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Macro));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Namespace));
			}

			if (prevToken == "symbol") {
				//this.loadSymbols(line, textDocumentPosition, SymbolTypes.Function, items, lastToken);
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Variable, lastToken));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Label, lastToken));
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Constant, lastToken));
				//this.loadSymbols(line, textDocumentPosition, SymbolTypes.Macro, lastToken);
				items = items.concat(this.loadSymbols(line, this.documentPosition, SymbolType.Namespace));
			}

		}


		return items;
	}
	
	private createCompletionItem(label:string, type:LanguageCompletionTypes, payload:any, kind:CompletionItemKind, textPosition:TextDocumentPositionParams):CompletionItem {
		
		let filterText = label;
		let insertText = label;

		if (this.trigger.length > 0 ) {
			filterText = filterText.substr(1,filterText.length-1);
			insertText = label.substr(1, label.length);
		}

		return {
			label,
			kind,
			filterText: filterText,
			insertText: insertText,
			data: {
				type,
				payload,
				},
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
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, instruction, CompletionItemKind.Text, this.textDocumentPosition));
		}

		return items;
	}

	private loadDirectives(): CompletionItem[] {
		
		var items: CompletionItem[] = [];

		var _directives = this.project.getAssemblerInfo().getAssemblerDirectives();

		for (let directive of _directives) {
			const name = directive.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, directive, CompletionItemKind.Text, this.textDocumentPosition));
		}

		return items;
	}


	private loadPreprocessorDirectives(): CompletionItem[] {

		var items: CompletionItem[] = [];

		var _directives = this.project.getAssemblerInfo().getAssemblerPreProcessorDirectives();

		for (let directive of _directives) {
			const name = directive.name.toLocaleLowerCase();
			items.push(this.createCompletionItem(name, LanguageCompletionTypes.Instruction, directive, CompletionItemKind.Text, this.textDocumentPosition));
		}

		return items;

	}


	private loadSymbols(line:Line, textDocumentPosition:TextDocumentPositionParams, symbolType:SymbolType, token:string = undefined): CompletionItem[] {
		var items: CompletionItem[] = [];
		var symbols = this.getProjectInfo().getCurrentProject().getSymbols();
		for (let symbol of symbols) {
			if (symbol.type == symbolType) {
				items.push(this.createCompletionItem(symbol.name, LanguageCompletionTypes.Directives, symbol, CompletionItemKind.Class, textDocumentPosition));
			}
		}
		return items;
	}

}

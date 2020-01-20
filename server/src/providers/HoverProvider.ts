/*
	Class: Hover Provider

	Handles any incoming Requests for a Hover Response in the Editor.

	Remarks:


*/

import {
	Provider, ProjectInfoProvider
} from "./Provider";

import {
	IConnection,
	TextDocumentPositionParams,
	Hover,
	ResponseError,
	MarkedString,
	VersionedTextDocumentIdentifier
} from "vscode-languageserver";

import Project, { Symbol, SymbolType } from "../project/Project";
import NumberUtils from "../utils/NumberUtils";
import LineUtils from "../utils/LineUtils";
import StringUtils from "../utils/StringUtils";
import { KickLanguage } from "../definition/KickLanguage";
import URI from "vscode-uri";
import { AssemblerSyntax, AssemblerFile } from "../assembler/AssemblerInfo";
import { ProjectFile } from "../project/ProjectFile";

export default class HoverProvider extends Provider {

	// contains all project information
	private project: Project;

	// used for symbol lookups
	private symbols: Symbol[];

	constructor(connection: IConnection, projectInfo: ProjectInfoProvider) {

		super(connection, projectInfo);

		connection.onHover((textDocumentPosition: TextDocumentPositionParams) => {
			if (projectInfo.getSettings().valid) {
				return this.process(textDocumentPosition);
			}
		});
	}

    /**
     * Process the Hover Request.
     * @param textDocumentPosition
     */
	private process(textDocumentPosition: TextDocumentPositionParams): Hover | ResponseError<void> {

		this.project = this.getProjectInfo().getProject(textDocumentPosition.textDocument.uri);
		this.symbols = this.project.getAllSymbols();
		let contents = this.createHover(textDocumentPosition);

		return { contents };
	}

	/**
	 * Returns the File that a Symbol is from.
	 * 
	 * @param symbol the symbol to use
	 */
	private getFileFromSymbol(symbol: Symbol): string | undefined{

		var file:string = "";

		// when this is a built-in function in the kickass.jar file
		if (symbol.isBuiltin) {
			return "from built-in";
		}

		// when this is in the currently open source file
		if (symbol.isMain) {
			return "";
		}

		var uri = symbol.data["uri"];
		var filename = URI.parse(uri);
		var path = require('path');

		file = "from " + path.parse(filename.path).base;

		if (file.indexOf(".source") >= 0) {
			file = "";
		}

		return file;
	}

	/**
	 * Find a Symbol of a specific SymbolType.
	 * 
	 * @param token the token to search the symbol
	 * @param type  the type of symbol to find
	 */
	private findSymbolOfType(token:string, type: SymbolType): Symbol | undefined {

		for(let symbol of this.symbols) {
			if (symbol.type === type) {
				if (symbol.name === token) {
					return symbol;
				}
			}
		}
		return undefined;
	}

	/**
	 * Returns a Description from a Symbol.
	 * 
	 * @param symbol the symbol 
	 */
	private getSymbolDescription(symbol: Symbol): string | undefined {
		var _description: string = "";
		if (symbol.description) _description = symbol.description.trim();
		if (symbol.comments) _description += (_description !== "" ? "\n":"") + symbol.comments.trim();
		return _description;
	}

	private createSimpleHover(symbol: Symbol): string[] | undefined {

		var _file = this.getFileFromSymbol(symbol);
		var _description = this.getSymbolDescription(symbol);
		var _original = "";

		if (symbol.originalValue) {
			_original = `[${symbol.originalValue}]`;
		}
		var _type = "";

		switch (symbol.type) {
			case SymbolType.Constant:
				_type = '.const';
				break;
			case SymbolType.Variable:
				_type = '.var';
				break;
			case SymbolType.Label:
				_type = '.label';
				break;
			case SymbolType.NamedLabel:
				_type = '(label)';
				break;
			}				

		return [
			`	${_type} ${symbol.name} ${_original} ${_file}`,
			`${_description}`,
			`${StringUtils.BuildSymbolFormattedValue(symbol)}`
		];
	}

	/**
	 * Create a Hover Response at the Current Text Position.
	 * 
	 * @param textDocumentPosition the location in the document
	 */
	private createHover(textDocumentPosition: TextDocumentPositionParams): string[] | undefined {

		// initialize the contents of the returned hover text
		var contents: string[] | undefined;

		// we always need the token word at the cursor
		var line = this.project.getSourceLines()[textDocumentPosition.position.line];
		var token = StringUtils.GetWordAt(line, textDocumentPosition.position.character);

		/*
			and now -- some logic

			perhaps a partial or full rewrite for returning hovers

			- get the current assembler info syntax
			- read through each line of the current source file (main = true)
			- check for matching line number
			- check for position in range
			- get the syntax type
			- load hover based on syntax type
		*/

		// get main file number
		var fileNumber: number;

		// find the current source file index in the asminfo file
		// TODO: figure this out after assembly instead of here
		var files = this.getProjectInfo().getCurrentProject().getAssemblerInfo().getAssemblerFiles();
		for (var i: number = 0; i < files.length; i++) {
			var file: AssemblerFile = files[i];
			if (file.main) {
				fileNumber = file.index;
				break;
			}
		}

		// get current assembler syntax
		var syntaxList: AssemblerSyntax[] = this.getProjectInfo().getCurrentProject().getAssemblerInfo().getAssemblerSyntax();

		for (var i: number = 0; i < syntaxList.length; i++) {

			var assemblerSyntax: AssemblerSyntax = syntaxList[i];

			// source file?
			if (assemblerSyntax.range.fileIndex === fileNumber) {

				// same line number?
				if (textDocumentPosition.position.line >= assemblerSyntax.range.startLine &&
					textDocumentPosition.position.line <= assemblerSyntax.range.endLine) {

					// in range?
					if (textDocumentPosition.position.character >= assemblerSyntax.range.startPosition &&
						textDocumentPosition.position.character <= assemblerSyntax.range.endPosition) {

						// macroExecution

						if (assemblerSyntax.type === 'macroExecution') {

							const symbol = this.findSymbolOfType(token, SymbolType.Macro);

							if (symbol) {

								const _file = this.getFileFromSymbol(symbol);
								const _parms = StringUtils.BuildSymbolParameterString(symbol);
								const _name = symbol.name;
								const _directive = ".macro";
								const _description = this.getSymbolDescription(symbol);

								return [
									`	${_directive} ${_name}(${_parms}) ${_file}`,
									`${_description.trim()}`,
								];
							}
						}

						// symbolReference

						if (assemblerSyntax.type === 'symbolReference' || assemblerSyntax.type === 'label') {

							var symbol = this.findSymbolOfType(token, SymbolType.Variable);
							if (!symbol) symbol = this.findSymbolOfType(token, SymbolType.Constant);
							if (!symbol) symbol = this.findSymbolOfType(token, SymbolType.Label);
							if (!symbol) symbol = this.findSymbolOfType(token, SymbolType.NamedLabel);
							
							if (symbol) {
								return this.createSimpleHover(symbol);
							}
						}

						// mnmemonic

						if (assemblerSyntax.type === 'mnemonic') {
							return this.getInstructionMatch(token);
						}

						// directives

						if (assemblerSyntax.type === 'directive') {
							return this.getDirectiveHover(token);
						}

						// ppDirective

						if (assemblerSyntax.type === 'ppDirective') {
							return this.getPreProcessorMatch("#".concat(token)); // add # for proper search
						}
					}

					// mnemonic line?
					if (assemblerSyntax.type === 'mnemonic') {
						
						// when hovering over something in a mnemonic line
						// it is more than likely some kind of literal
						// value or memory address like #$01 or #d000
						//
						// if it was some kind of symbol, it would have already
						// been handled above

						var _contents = StringUtils.BuildTokenFormattedValue(token);

						if (_contents)
							return [
								_contents
							];						

					}

					// directive line?

					if (assemblerSyntax.type === 'directive') {

						/*
							when hovering over something on a 
							directive line, and it was not already
							handled as a symbol reference, then
							it is probably the literal value of
							some expression like

							.label LABEL_NAME = $d020

						*/

						var _contents = StringUtils.BuildTokenFormattedValue(token);

						if (_contents) 
							return [
								_contents
							];						

						var _symbol = this.findSymbolOfType(token, SymbolType.Variable);
						if (!_symbol) _symbol = this.findSymbolOfType(token, SymbolType.Constant);
						if (!_symbol) _symbol = this.findSymbolOfType(token, SymbolType.Label);
						if (!_symbol) _symbol = this.findSymbolOfType(token, SymbolType.NamedLabel);

						if (_symbol) {
							return this.createSimpleHover(_symbol);
						}
					}


					// unhandled token information

					contents = [
						token, 
						assemblerSyntax.type
					];
				}
			}
		}

		return contents;

	/*
		Everything after this point will probably be deleted
		very soon.
	*/



		// no match then fall back to normal hover processing -- i hope

		if(token){
		//  search for matching token
			if (!contents) contents = this.getInstructionMatch(token);
			if (!contents) contents = this.getPseudoOpsMatch(token);
			if (!contents) contents = this.getPreProcessorMatch(token);
			if (!contents) contents = this.getDirectiveHover(token);
			//if (!contents) contents = this.getLiteralHover(token);
		}

		if (!contents) {
			//	no match so far, try just symbols
			token = LineUtils.getTokenAtLinePosition(line, textDocumentPosition.position.character);
			if(token) {
				//if (!contents) contents = this.getBuiltInSymbolHover(token);
				if (!contents) contents = this.getSymbolOrLabel(token);
			}
		}
		
		if (!contents) contents = [];
		return contents;
	}

	private getSymbolOrLabel(token: string): string[] | undefined {

		var symbols = this.project.getSymbols();

		// check project symbols
		var tokenMatch = symbols.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});

		// check built in symbols
		if (!tokenMatch) { 
			tokenMatch = this.project.getBuiltInSymbols().find((match) => {
				return match.name.toLowerCase() === token.toLowerCase();
			});
		}

		if (tokenMatch) {

			// figure out the file the symbol came from

			// var file:string = "";

			// if (tokenMatch.isBuiltin) {

			// 	file = "from built-in";

			// } else {

			// 	var uri = tokenMatch.data["uri"];
			// 	var filename = URI.parse(uri);
			// 	var path = require('path');

			// 	file = "from " + path.parse(filename.path).base;

			// 	if (file.indexOf(".source") >= 0) {
			// 		file = "";
			// 	}
			// }

			var file = this.getFileFromSymbol(tokenMatch);

			// format the description

			var description = "";

			if (tokenMatch.comments) description = tokenMatch.comments.trim();
			if (tokenMatch.description) description = tokenMatch.description.trim();

			if (tokenMatch.type == SymbolType.Macro || tokenMatch.type == SymbolType.Function) {

				var parm_text = [];

				if (tokenMatch.data) {
					for (var parm1 of tokenMatch.data.parms) {
						parm_text.push(parm1.name);
					}
				}

				if (tokenMatch.parameters) {
					for (var parm2 of tokenMatch.parameters) {
						parm_text.push(parm2.name);
					}
				}

				var symbolDirective = tokenMatch.type == SymbolType.Macro ? ".macro" : ".function";
				return [
					`	${symbolDirective} ${tokenMatch.name}(${parm_text.join(", ")}) ${file}`,
					`${description.trim()}`,
				 ];

			}

			if (tokenMatch.type == SymbolType.NamedLabel) {

				var description = "";

				if (tokenMatch.comments) description = tokenMatch.comments.trim();

				return [
					`*(label)* ${tokenMatch.name} ${file}`,
					`${description.trim()}`,
				 ];
		
			}

			if (tokenMatch.type == SymbolType.Constant) {
				return this.createSymbolWithValue(tokenMatch, file);
			}

			if (tokenMatch.type == SymbolType.Label) {
				return this.createSymbolWithValue(tokenMatch, file);
			}

			if (tokenMatch.type == SymbolType.Variable) {
				return this.createSymbolWithValue(tokenMatch, file);
			}

			if (tokenMatch.type == SymbolType.Boolean) {

				var description = "";

				if (tokenMatch.comments) description = tokenMatch.comments.trim();

				return [
					`	#define ${tokenMatch.name} ${file}`,
					`${description.trim()}`,
				 ];
		
			}
			return undefined;
		}
	}

	private createSymbolWithValue(symbol: Symbol, file: string): string[] {

		var description = "";
		var symbolDirective = "";
		switch (symbol.type) {
			case SymbolType.Constant:
				symbolDirective = '.const';
				break;
			case SymbolType.Variable:
				symbolDirective = '.var';
				break;
			case SymbolType.Label:
				symbolDirective = '.label';
				break;				
		}

		if (symbol.description) description = symbol.description.trim();
		if (symbol.comments) description += (description !== "" ? "\n":"") + symbol.comments.trim();

		return [
			`	${symbolDirective} ${symbol.name} [${symbol.originalValue}] ${file}`,
			`${description.trim()}`,
			`${StringUtils.BuildSymbolFormattedValue(symbol)}`
		 ];
}

	private getDirectiveHover(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.Directives.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(directive)* **${tokenMatch.name}** : ${tokenMatch.description}`,
				(tokenMatch.deprecated?`*(deprecated)*`:'')
			];
		} else if (token===KickLanguage.Star.name) {
			return [
				`*(directive)* __${KickLanguage.Star.name}__ : ${KickLanguage.Star.description}`
			];
		}
		
	}

	private getInstructionMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.Instructions.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(instruction)* **${tokenMatch.name}** : ${tokenMatch.description}`
			];
		}
	}

	private getPseudoOpsMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.PseudoOps.find((pseudoOp) => {
			return pseudoOp.name.toLowerCase() === token.toLowerCase() ||
				pseudoOp.otherNames.some((otherName) => otherName.toLowerCase() === token.toLowerCase());
		});
		if (tokenMatch) {
			return [
				`*(pseudo-op)* \`${tokenMatch.name}\`: ${tokenMatch.description}`,
			];
		}
	}

	private getPreProcessorMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.PreProcessors.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(pre-processor)* \`${tokenMatch.name}\`: ${tokenMatch.description}`,
			];
		}
	}

}
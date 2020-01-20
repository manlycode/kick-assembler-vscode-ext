/*

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
     * Does Something
     * @param textDocumentPosition
     */
	private process(textDocumentPosition: TextDocumentPositionParams): Hover | ResponseError<void> {

		this.project = this.getProjectInfo().getProject(textDocumentPosition.textDocument.uri);
		this.symbols = this.project.getAllSymbols();
		let contents = this.createHover(textDocumentPosition);

		return { contents };
	}

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

							const symbol = this.getSymbolOfType(token, SymbolType.Macro);

							if (symbol) {
								contents = [
							`	${symbolDirective} ${tokenMatch.name}(${parm_text.join(", ")}) ${file}`,
							`${description.trim()}`,
												];
							}
						}

						// symbolReference

						if (assemblerSyntax.type === 'symbolReference') {

							var symbol = this.getSymbolOfType(token, SymbolType.Variable);
							if (!symbol) symbol = this.getSymbolOfType(token, SymbolType.Label);
							if (!symbol) symbol = this.getSymbolOfType(token, SymbolType.NamedLabel);
							if (!symbol) symbol = this.getSymbolOfType(token, SymbolType.Constant);
							
							if (symbol) {
								contents = [symbol.name, assemblerSyntax.type];
							}
						}

						// mnmemonic

						if (assemblerSyntax.type === 'mnemonic') {
							contents = this.getInstructionMatch(token);
						}

						// directives

						if (assemblerSyntax.type === 'directive') {
							contents = this.getDirectiveHover(token);
						}

						// ppDirective

						if (assemblerSyntax.type === 'ppDirective') {
							contents = this.getPreProcessorMatch("#".concat(token)); // add # for proper search
						}

						if (!contents) contents = [token, assemblerSyntax.type];
					}
				}
			}
		}

		return contents;

		// no match then fall back to normal hover processing -- i hope

		if(token){
		//  search for matching token
			if (!contents) contents = this.getInstructionMatch(token);
			if (!contents) contents = this.getPseudoOpsMatch(token);
			if (!contents) contents = this.getPreProcessorMatch(token);
			if (!contents) contents = this.getDirectiveHover(token);
			if (!contents) contents = this.getLiteralHover(token);
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

	private getMacroSymbol(token: string):Symbol {

		var symbols:Symbol[] = this.project.getAllSymbols();

		for(let symbol of symbols) {
			if (symbol.type === SymbolType.Macro) {
				if (symbol.name === token) {
					return symbol;
				}
			}
		}
		return undefined;
	}

	private getSymbolOfType(token:string, type: SymbolType) {

		for(let symbol of this.symbols) {
			if (symbol.type === type) {
				if (symbol.name === token) {
					return symbol;
				}
			}
		}
		return undefined;
	}

	// private getBuiltInSymbolHover(token: string): string[] | undefined {
	// 	const tokenMatch = this.project.getBuiltInSymbols().find((match) => {
	// 		return match.name.toLowerCase() === token.toLowerCase();
	// 	});

	// 	if (tokenMatch) {
	// 		return this.createSymbolWithValue(tokenMatch, "built-in");
	// 	}
	// }

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

			var file:string = "";

			if (tokenMatch.isBuiltin) {

				file = "from built-in";

			} else {

				var uri = tokenMatch.data["uri"];
				var filename = URI.parse(uri);
				var path = require('path');

				file = "from " + path.parse(filename.path).base;

				if (file.indexOf(".source") >= 0) {
					file = "";
				}
			}

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
			`${this.getFormattedValue(symbol.value)}`
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

	private getLiteralHover(token: string) {
		var num = NumberUtils.toDecimal(token);
		return !isNaN(num) ? [this.getFormattedValue(num)] : undefined;
	}

	private getFormattedValue(value: number): string {
		if (isNaN(value) || !Number.isInteger(value)) return '';
		return '\n' +
			`\n* Dec: \`${value.toString(10)}\`` +
			`\n* Bin: \`\%${value.toString(2)}\`` +
			// `\n* Oct: \`${value.toString(8)}\`` +
			`\n* Hex: \`\$${value.toString(16)}\``;
	}

}
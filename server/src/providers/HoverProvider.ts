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
import { KickLanguage } from "../definition/KickLanguage";
import URI from "vscode-uri";

export default class HoverProvider extends Provider {

	private project: Project;

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
		let contents = this.createHover(textDocumentPosition);

		return { contents };
	}

	private createHover(textDocumentPosition: TextDocumentPositionParams): string[] | undefined {

		var contents: string[] | undefined;
		//  get line
		var line = this.project.getSourceLines()[textDocumentPosition.position.line];
		//  get token under cursor
		var token = LineUtils.getTokenAtLinePosition2(line, textDocumentPosition.position.character);
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

	private getBuiltInSymbolHover(token: string): string[] | undefined {
		const tokenMatch = this.project.getBuiltInSymbols().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});

		if (tokenMatch) {
			return this.createSymbolWithValue(tokenMatch, "built-in");
		}

		/*
		if (tokenMatch) {

			var typeVal = ""
			if (tokenMatch.type == SymbolType.Macro) { typeVal = "Macro" }
			if (tokenMatch.type == SymbolType.Constant) { typeVal = "Constant" }
			if (tokenMatch.type == SymbolType.Function) { typeVal = "Function" }

			return [
				`(${typeVal}) \`${tokenMatch.name}\`: ${tokenMatch.description}`,
				// `	(${tokenMatch.type.toString()}) ${tokenMatch.name}`,
				// `\n***\n${tokenMatch.description.trim()}`,
				// `\n***\n${this.getFormattedValue(tokenMatch.value)}`
				];
		}
		*/

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
					`\n***\n${description.trim()}`,
				 ];

			}

			if (tokenMatch.type == SymbolType.NamedLabel) {

				var description = "";

				if (tokenMatch.comments) description = tokenMatch.comments.trim();

				return [
					`	label ${tokenMatch.name} ${file}`,
					`\n***\n${description.trim()}`,
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
					`	#define symbol ${tokenMatch.name} ${file}`,
					`\n***\n${description.trim()}`,
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
			`\n***\n${description.trim()}`,
			`\n***\n${this.getFormattedValue(symbol.value)}`
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
				`(pseudo-op) \`${tokenMatch.name}\`: ${tokenMatch.description}`
			];
		}
	}

	private getPreProcessorMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.PreProcessors.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`(pre-processor) \`${tokenMatch.name}\`: ${tokenMatch.description}`
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
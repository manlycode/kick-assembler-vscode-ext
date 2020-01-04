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

		//	no match so far, try stright symbols
		token = LineUtils.getTokenAtLinePosition(line, textDocumentPosition.position.character);
		if(token) {
			if (!contents) contents = this.getBuiltInSymbolHover(token);
			if (!contents) contents = this.getSymbolOrLabel(token);
		}
		if (!contents) contents = [];
		return contents;
	}

	private getBuiltInSymbolHover(token: string): string[] | undefined {
		const tokenMatch = this.project.getBuiltInSymbols().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
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
	}

	private getSymbolOrLabel(token: string): string[] | undefined {

		var symbols = this.project.getSymbols();

		const tokenMatch = symbols.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});

		if (tokenMatch) {

			var uri = tokenMatch.data["uri"];
			var filename = URI.parse(uri);
			var path = require('path');
			// var file:string = "from " + path.parse(filename.path).name;
			var file:string = "from " + path.parse(filename.path).base;
			if (file.indexOf(".source") >= 0) {
				file = "";
			}

			// var hover = [];

			// if (file) {
			// 	hover.push(`#### ${file}\n\n`);
			// }

			// hover.push(`*(${SymbolType[tokenMatch.type].toString()})* **${tokenMatch.name}** : ${tokenMatch.value}\n\n`);

			// if (tokenMatch.comments) {
			// 	hover.push(tokenMatch.comments);
			// }

			// return hover;

			// return [
			// 	`# Header1\n## Header2\n### Header3\nLink [example link](http://example.com/)\n***\n    lda #$01\n    sta $d021\n*emphasis*\n\n**strong**\n* Item1\n* Item2\n\n***\n` ,
			// 	`![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")\n\n\n\nSome More Text`,
			// 	`<h1>raw html</h1>`,
			// ];

			// return [`	.macro someMacro(p1, p2) from macro-init\n***\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus quis nisl eu aliquet. Praesent sagittis nulla non lacus fermentum ultrices. Etiam eget gravida sem, a venenatis nibh. Cras posuere mauris ut tortor sollicitudin lobortis.`];

			var description = "";
			if (tokenMatch.comments) description = tokenMatch.comments.trim();

			if (tokenMatch.type == SymbolType.Macro || tokenMatch.type == SymbolType.Function) {

				var parm_text = "";

				if (tokenMatch.data) {
					for (var parm of tokenMatch.data.parms) {
						parm_text += parm.name + " ";
					}
				}

				parm_text = parm_text.trim();
				parm_text = parm_text.replace(" ", ", ");

				var symbolDirective = tokenMatch.type == SymbolType.Macro ? ".macro" : ".function";
				return [
					`	${symbolDirective} ${tokenMatch.name}(${parm_text}) ${file}`,
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

		if (symbol.comments) description = symbol.comments.trim();

		return [
			`	${symbolDirective} ${symbol.name} [${symbol.originalValue}] ${file}`,
			`\n***\n${description.trim()}`,
			`\n***\n${this.getFormattedValue(symbol.value)}`
		 ];
}

	private getDirectiveHover(token: string): string[] | undefined {
		const tokenMatch = this.project.getDirectives().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(directive)* **${tokenMatch.name}** : ${tokenMatch.description}\n\n`
			];
		}
	}

	private getInstructionMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.Instructions.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(instruction)* **${tokenMatch.name}** : ${tokenMatch.description}\n\n`
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
				`(pseudo-op) \`${tokenMatch.name}\`: ${tokenMatch.description}`,
			];
		}
	}

	private getPreProcessorMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.PreProcessors.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`(pre-processor) \`${tokenMatch.name}\`: ${tokenMatch.description}`,
			];
		}
	}

	private getLiteralHover(token: string) {
		var num = NumberUtils.toDecimal(token);
		return !isNaN(num) ? [this.getFormattedValue(num)] : undefined;
	}

	private getFormattedValue(value: number): string {
		if (!value)
			return '';
		return '\n' +
			`\n* Dec: \`${value.toString(10)}\`` +
			`\n* Bin: \`\%${value.toString(2)}\`` +
			// `\n* Oct: \`${value.toString(8)}\`` +
			`\n* Hex: \`\$${value.toString(16)}\``;
	}

}
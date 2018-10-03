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
	MarkedString
} from "vscode-languageserver";

import Project, { SymbolType } from "../project/Project";
import LineUtils from "../utils/LineUtils";
import { KickLanguage } from "../definition/KickLanguage";
import URI from "vscode-uri";

export default class HoverProvider extends Provider {

	private project: Project;

	private lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur sodales magna, ac accumsan nibh venenatis in. Duis malesuada lectus laoreet, egestas ligula quis, vestibulum enim. Proin dictum velit orci, in sagittis neque rhoncus id.`;

	constructor(connection: IConnection, projectInfo: ProjectInfoProvider) {

		super(connection, projectInfo);

		connection.onHover((textDocumentPosition: TextDocumentPositionParams) => {
			return this.process(textDocumentPosition);
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
		//  search for matching token
		if (!contents) contents = this.getInstructionMatch(token);
		if (!contents) contents = this.getPseudoOpsMatch(token);
		if (!contents) contents = this.getPreProcessorMatch(token);
		if (!contents) contents = this.getDirectiveHover(token);
		if (!contents) contents = this.getLiteralHover(token);

		//	no match so far, try stright symbols
		token = LineUtils.getTokenAtLinePosition(line, textDocumentPosition.position.character);
		if (!contents) contents = this.getBuiltInSymbolHover(token);
		if (!contents) contents = this.getSymbolOrLabel(token);
		return contents;
	}

	private getBuiltInSymbolHover(token: string): string[] | undefined {
		const tokenMatch = this.project.getBuiltInSymbols().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`(${tokenMatch.type.toString()}) \`${tokenMatch.name}\`: ${tokenMatch.description}`,
			];
		}
	}

	private getSymbolOrLabel(token: string): string[] | undefined {
		var symbols = this.project.getSymbols();
		const tokenMatch = this.project.getSymbols().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			
			var uri = tokenMatch.data["uri"];
			var filename = URI.parse(uri);
			var path = require('path');
			var file:string = path.parse(filename.path).base;
			if (file.indexOf(".source.txt") >= 0) {
				file = undefined;
			}

			var hover = [];

			if (file) {
				hover.push(`#### ${file}`);
			}

			hover.push(`*(${SymbolType[tokenMatch.type].toString()})* **${tokenMatch.name}** : ${tokenMatch.value}\n\n`);

			if (tokenMatch.comments) {
				hover.push(tokenMatch.comments);
			}

			return hover;

			// return [
			// 	`# Header1 \n## Header2 \n### Header3 \nLink [example link](http://example.com/) \n***\n    lda #$01\n    sta $d021\n*emphasis*\n\n**strong**\n* Item1\n* Item2\n\n***\n` ,
			// 	`![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")\n\n\n\nSome More Text`, 
			// 	`<h1>raw html</h1>`,
			// ];
		}
	}

	private getDirectiveHover(token: string): string[] | undefined {
		const tokenMatch = this.project.getDirectives().find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(directive)* **${tokenMatch.name}** : ${tokenMatch.description}\n\n`,
				this.lorem
			];
		}
	}

	private getInstructionMatch(token: string): string[] | undefined {
		const tokenMatch = KickLanguage.Instructions.find((match) => {
			return match.name.toLowerCase() === token.toLowerCase();
		});
		if (tokenMatch) {
			return [
				`*(instruction)* **${tokenMatch.name}** : ${tokenMatch.description}\n\n`,
				this.lorem				
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

		if (token.substr(0, 2) == "#$") {
			var num = parseInt(token.substr(2), 16);
			if (!isNaN(num)) return [this.getFormattedValue(num)];
		}

		if (token.substr(0, 1) == "$") {
			var num = parseInt(token.substr(1), 16);
			if (!isNaN(num)) return [this.getFormattedValue(num)];
		}

		if (token.substr(0, 1) == "#") {
			var num = parseInt(token.substr(1), 10);
			if (!isNaN(num)) return [this.getFormattedValue(num)];
		}

		if (token.substr(0, 1) == "%") {
			var num = parseInt(token.substr(1), 2);
			if (!isNaN(num)) return [this.getFormattedValue(num)];
		}

		return undefined;
	}

	private getFormattedValue(value: number): string {
		return `* Dec: \`${value.toString(10)}\`\n\n` +
			`* Bin: \`\%${value.toString(2)}\`\n\n` +
			`* Oct: \`${value.toString(8)}\`\n\n` +
			`* Hex: \`\$${value.toString(16)}\`\n\n`;
	}

}
import { Provider, ProjectInfoProvider } from "./Provider";
import StringUtils from "../utils/StringUtils";

import {
	Connection,
	TextDocumentPositionParams,
	DefinitionLink,
	Position,
	Range
} from "vscode-languageserver";

export default class DefinitionProvider extends Provider {

    constructor(connection:Connection, projectInfo:ProjectInfoProvider) {
		super(connection, projectInfo);

		connection.onDefinition((textDocumentPosition: TextDocumentPositionParams): DefinitionLink[] => {
			if (projectInfo.getSettings().valid) {
				var project = projectInfo.getProject(textDocumentPosition.textDocument.uri);
				var lines = project.getSourceLines();
				var triggerLine = lines[textDocumentPosition.position.line];

				var defLink: DefinitionLink[] = [];

				var triggerCharacterPos = textDocumentPosition.position.character - 1;
				var inStringTest = triggerLine.substr(0,triggerCharacterPos).replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,"");
				if (inStringTest.match(/["']/)) {
					var token = StringUtils.GetWordAt(triggerLine.replace(/[\"\']/g," "), triggerCharacterPos).trim();
					var tokenMatch = new RegExp(token+"$");
					
					for(var sourceFile of project.getSourceFiles()) {
						if(sourceFile.getUri().match(tokenMatch)){
							var zeroRange = Range.create(
								Position.create(0,0),
								Position.create(0,0)
							);
							var startPos = triggerLine.indexOf(token);
							defLink.push(<DefinitionLink> {
								targetUri: sourceFile.getUri(),
								targetRange: zeroRange,
								targetSelectionRange: zeroRange,
								originSelectionRange: Range.create(
									Position.create(textDocumentPosition.position.line,startPos),
									Position.create(textDocumentPosition.position.line,startPos+token.length)
								)
							});
							break;
						}
					}
				} else {
					var token = StringUtils.GetWordAt(triggerLine.replace(/[\.\+\-\*\/,]/g," "), triggerCharacterPos).trim();
					for(var symbol of project.getSymbols()) {
						if(symbol.name === token){
							defLink.push(<DefinitionLink> {
								targetUri: symbol.isMain ? project.getUri() : project.getSourceFiles()[symbol.fileIndex].getUri(),
								targetRange: symbol.range,
								targetSelectionRange: symbol.range
							});
							break;
						}
					}
				}
				if (defLink.length === 0) return;
				return defLink;
			}
		});
	}
}
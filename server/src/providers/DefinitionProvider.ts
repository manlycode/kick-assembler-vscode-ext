import { Provider, ProjectInfoProvider } from "./Provider";
import StringUtils from "../utils/StringUtils";

import {
	Connection,
	TextDocumentPositionParams,
	DefinitionLink
} from "vscode-languageserver";

export default class DefinitionProvider extends Provider {

    constructor(connection:Connection, projectInfo:ProjectInfoProvider) {
		super(connection, projectInfo);

		connection.onDefinition((textDocumentPosition: TextDocumentPositionParams): DefinitionLink[] => {
			if (projectInfo.getSettings().valid) {
				var project = projectInfo.getProject(textDocumentPosition.textDocument.uri);
				var lines = project.getSourceLines();
				var triggerLine = lines[textDocumentPosition.position.line].replace(/\./g," ");
				var token = StringUtils.GetWordAt(triggerLine, textDocumentPosition.position.character).trim();
		
				var defLink: DefinitionLink[] = [];
				for(var symbol of project.getSymbols()) {
					if(symbol.name === token){
						defLink.push(<DefinitionLink> {
							targetUri: symbol.isMain ? project.getUri() : project.getSourceFiles()[symbol.fileIndex].getUri(),
							targetRange: symbol.range,
							targetSelectionRange: symbol.range
						});
					}
				}
				if (defLink.length === 0) return;
				return defLink;
			}
		});
	}
}
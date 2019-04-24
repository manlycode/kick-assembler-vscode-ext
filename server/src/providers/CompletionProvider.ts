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

import Project, { SymbolType } from "../project/Project";
import LineUtils from "../utils/LineUtils";
import { KickLanguage } from "../definition/KickLanguage";
import URI from "vscode-uri";

export default class CompletionProvider extends Provider {

	private project: Project;

	constructor(connection: IConnection, projectInfo: ProjectInfoProvider) {

		super(connection, projectInfo);

		// 	show the initial list of items
		connection.onCompletion((textDocumentPosition:TextDocumentPositionParams): CompletionItem[] => {
            return this.createCompletionItems(textDocumentPosition);
		});

		//	request for more details of a particular item
		connection.onCompletionResolve((item:CompletionItem):CompletionItem => {
            return null;
		});
    }
    
	private createCompletionItems(textDocumentPosition:TextDocumentPositionParams):CompletionItem[] {

        /*

            some pseudo code to work from

            

        */
        return null;
    }
}

import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    DocumentSymbolParams,
    Connection,
    SymbolInformation
 } from "vscode-languageserver";
 
/**
 * Provides a List of Symbols in the Document
 * 
 * TODO: Parent Ranges to ensure indentation on Outline
 */
export default class DocumentSymbolProvider extends Provider {

    constructor(connection:Connection, projectInfo:ProjectInfoProvider) {

        super(connection, projectInfo);

        connection.onDocumentSymbol((request:DocumentSymbolParams) => {

            if (!projectInfo.getSettings().valid) return;

            var symbols: SymbolInformation[];
            symbols = [];

            var project = projectInfo.getProject(request.textDocument.uri);
            for(var symbol of project.getSymbols()) {

                //  only include symbols from the main project file
                if (symbol.isMain) {

                    var s1 = SymbolInformation.create(
                        symbol.name,
                        symbol.kind,
                        symbol.range,
                        symbol.isMain ? project.getUri() : project.getSourceFiles()[symbol.fileIndex].getUri(),
                        ""
                    );

                    symbols.push(s1);
                }
            }
            return symbols;
        });
    }
}
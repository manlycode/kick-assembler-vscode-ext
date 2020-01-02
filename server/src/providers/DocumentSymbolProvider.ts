import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    DocumentSymbolParams,
    Connection,
    SymbolInformation,
    Range,
    Position,
 } from "vscode-languageserver";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";

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

            for(var symbol of projectInfo.getCurrentProject().getSymbols()) {

                //  only include symbols from the main project file
                if (symbol.isMain && symbol.line.scope == 0) {

                    var s1 = SymbolInformation.create(
                        symbol.name,
                        symbol.kind,
                        Range.create(
                            Position.create(symbol.line.number, 1),
                            Position.create(symbol.line.number,1)
                        ),
                        this.getProjectInfo().getCurrentProject().getUri(),
                        ""
                    );

                    symbols.push(s1);
                }
            }
            return symbols;
        });
    }
}
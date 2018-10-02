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

/**
 * Provides a List of Symbols in the Document
 * 
 * TODO: Parent Ranges to ensure indentation on Outline
 */
export default class DocumentSymbolProvider extends Provider {

    constructor(connection:Connection, projectInfo:ProjectInfoProvider) {

        super(connection, projectInfo);

        /*
        connection.onDocumentSymbol((request:DocumentSymbolParams) => {

            var symbols:SymbolInformation[];
            symbols = [];

            var s1 = SymbolInformation.create(
                "Parent",
                SymbolKind.Method,
                Range.create(
                    Position.create(1,1),
                    Position.create(1,20)
                ),
                "",
                "container"
            
            );

            var s2 = SymbolInformation.create(
                "Child",
                SymbolKind.TypeParameter,
                Range.create(
                    Position.create(2,1),
                    Position.create(2,20)
                ),
                "",
                "container"
            );

            symbols.push(s1);
            symbols.push(s2);

            return symbols;
        });
        */

        connection.onDocumentSymbol((request:DocumentSymbolParams) => {

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
                    )

                    symbols.push(s1);
                }

            }

            return symbols;

        });
    }

}
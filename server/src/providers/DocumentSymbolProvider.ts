import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    DocumentSymbolParams,
    Connection,
    DocumentSymbol,
    SymbolKind
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

            var scopedSymbols = [];
            var project = projectInfo.getProject(request.textDocument.uri);
            for(var symbol of project.getSymbols()) {

                //  only include symbols from the main project file
                if (symbol.isMain) {
                    //collect per scope first, merge to parent scope later
                    if(!scopedSymbols[symbol.scope]) {
                        scopedSymbols[symbol.scope] = [];
                    }
                    scopedSymbols[symbol.scope].push(DocumentSymbol.create(
                        symbol.name,
                        symbol.description || symbol.comments || '',
                        symbol.kind,
                        symbol.range,
                        symbol.range
                    ));
                }
            }
            // reverse iterate through scopes to make sure nested scopes are correctly assigned to their parents
            for(var i = scopedSymbols.length-1; i>0;i--) {
                if(scopedSymbols[i]){
                    var scopeElement = project.getScopes().find(scope => {
                        return scope.id == i
                    });
                    var parentScopedSymbols:DocumentSymbol[] = scopedSymbols[scopeElement.parentScope];
                    for(var j=0,jl=parentScopedSymbols.length;j<jl;j++){
                        // find the parent symbol of the scope
                        if(parentScopedSymbols[j].range.start.line == scopeElement.line){
                            parentScopedSymbols[j].children = scopedSymbols[i];
                            if(parentScopedSymbols[j].kind == SymbolKind.Object) {
                                parentScopedSymbols[j].kind = SymbolKind.Namespace;
                            }
                            break;
                        }
                    }
 
                }
            }
            // Everything should be finally merged into scope 0     
            return scopedSymbols[0];
        });
    }
}
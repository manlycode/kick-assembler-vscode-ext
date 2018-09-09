import { 
    Provider 
} from "./provider";

import { 
    IConnection,
    TextDocumentPositionParams,
    Hover,
    ResponseError
 } from "vscode-languageserver";

/*

*/

export default class HoverProvider extends Provider {

    constructor(connection:IConnection) {

        super(connection);
        connection.console.log("- hover provider registered")

        connection.onHover((textDocumentPosition:TextDocumentPositionParams) => {
            connection.console.log("- onHover")
            return this.process(textDocumentPosition);
        });
    }

    private process(textDocumentPosition:TextDocumentPositionParams):Hover|ResponseError<void> {
        this.getConnection().console.log('- processing hover');
        this.getConnection().console.log(textDocumentPosition.toString());
        let contents:string[]|undefined;
        contents = [ "Hover" ];
        return { contents };
    }
}
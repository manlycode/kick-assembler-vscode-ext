import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    IConnection,
    TextDocumentPositionParams,
    Hover,
    ResponseError
 } from "vscode-languageserver";
import Project from "../project/Project";

/*

*/

export default class HoverProvider extends Provider {

    constructor(connection:IConnection, projectInfo:ProjectInfoProvider) {

        super(connection, projectInfo);
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
        var lines = this.getProjectInfo().getProject().getAssemblerResults().assemblerInfo.getFiles()[0].uri;
        contents = [ lines ];
        return { contents };
    }
}
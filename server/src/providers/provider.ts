
/*
    Class: Provider

    A Provider is something that communicates
    with the Visual Studio code Client.

*/
import {
    IConnection
} from "vscode-languageserver";

export class Provider {

        private connection:IConnection;

        constructor(connection:IConnection) {
            this.connection = connection;
        }

        public getConnection():IConnection {
            return this.connection;
        }
}
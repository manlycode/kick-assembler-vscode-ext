
/*
    Class: Provider

    A Provider is something that communicates
    with the Visual Studio code Client.

*/
import {
    IConnection, Connection
} from "vscode-languageserver";
import { Settings } from "./SettingsProvider";
import Project from "../project/Project";

export interface ProjectInfoProvider {
	getProject:(uri:string) => Project;
    getSettings:() => Settings;
}

export class Provider {

        private connection:Connection;
        private projectInfo:ProjectInfoProvider;

        constructor(connection:Connection, projectInfo:ProjectInfoProvider) {
            this.connection = connection;
            this.projectInfo = projectInfo;
        }

        public getConnection():Connection {
            return this.connection;
        }

        public getProjectInfo():ProjectInfoProvider {
            return this.projectInfo;
        }
}
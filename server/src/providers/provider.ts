
/*
    Class: Provider

    A Provider is something that communicates
    with the Visual Studio code Client.

*/
import {
    IConnection
} from "vscode-languageserver";
import { Settings } from "./SettingsProvider";
import Project from "../project/Project";

export interface ProjectInfoProvider {
	getProject:() => Project;
	getSettings:() => Settings;
}

export class Provider {

        private connection:IConnection;
        private projectInfo:ProjectInfoProvider;

        constructor(connection:IConnection, projectInfo:ProjectInfoProvider) {
            this.connection = connection;
            this.projectInfo = projectInfo;
        }

        public getConnection():IConnection {
            return this.connection;
        }

        public getProjectInfo():ProjectInfoProvider {
            return this.projectInfo;
        }
}
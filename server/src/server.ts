
/*
	server.ts

	Bootstraps the Language Server Processor

*/

'use strict';

import {
	createConnection, 
	IConnection, 
	ProposedFeatures,
} from "vscode-languageserver";

import ProjectManager from "./project/ProjectManager";

const connection:IConnection = createConnection(ProposedFeatures.all);
const projectManager = new ProjectManager(connection);
projectManager.start();
connection.console.log('- server started');

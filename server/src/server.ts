/*
	Copyright (C) 2018-2020 Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
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
connection.console.log('- kick-assembler-vscode-ext server has started');

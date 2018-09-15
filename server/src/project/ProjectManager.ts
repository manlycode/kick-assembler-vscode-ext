
/*
    Class: ProjectManager

    Manages the Project for this Extension

    Remarks:

        The Manager will be responsible for
        the handling of providers that are
        available on the Client.

*/

import { 
    IConnection, 
    InitializeResult, 
    TextDocuments,
    InitializeParams,
    InitializedParams,
    DidChangeTextDocumentParams,
    DidOpenTextDocumentParams,
    DidSaveTextDocumentParams,
    DidChangeWatchedFilesParams, 
} from "vscode-languageserver";

import SettingsProvider, { Settings } from "../providers/SettingsProvider";
import HoverProvider from "../providers/HoverProvider";
import Project from "./Project";
import { ProjectInfoProvider } from "../providers/Provider";

export default class ProjectManager {

    private project:Project;
    private projectCache:{};

    private connection:IConnection;

    private documents:TextDocuments;
    private settingsProvider:SettingsProvider;
    private hoverProvider:HoverProvider;

    constructor(connection:IConnection) {

        this.connection = connection;

        //  setup listener for documents
        this.documents = new TextDocuments();
        this.documents.listen(this.connection);

        //  setup project information provider
        const projectInfoProvider:ProjectInfoProvider = {
            getProject: this.getProject.bind(this),
            getSettings: this.getSettings.bind(this)
        }

        this.settingsProvider = new SettingsProvider(connection, projectInfoProvider);
        this.hoverProvider = new HoverProvider(connection, projectInfoProvider);

        connection.onInitialize((params:InitializeParams):InitializeResult => {
            connection.console.log("[projectManager.onInitialize");
            return {
                capabilities: {
                    textDocumentSync: this.documents.syncKind,
                    hoverProvider: true,
                    
                }
            };
        });

        connection.onInitialized((params:InitializedParams) => {
            connection.console.log("[projectManager.onInitialized");
            connection.console.log(params.toString());
        });

        connection.onDidOpenTextDocument((open:DidOpenTextDocumentParams) => {
            connection.console.log("[projectManager.onDidOpenTextDocument");
            this.project = new Project();
            this.project.assemble(this.settingsProvider.getSettings(), open.textDocument);
        });

        connection.onDidChangeTextDocument((change:DidChangeTextDocumentParams) => {
            connection.console.log("[projectManager.onDidChangeTextDocument");
        });

        connection.onDidSaveTextDocument((params:DidSaveTextDocumentParams) => {
            connection.console.log("[projectManager.onDidSaveTextDocument");
        });

        connection.onDidChangeWatchedFiles((params:DidChangeWatchedFilesParams) => {
            connection.console.log("[projectManager.onDidChangeWatchedFiles");
        })

    }

    public start() {
        this.connection.console.log("[projectManager.start");
        this.connection.listen();
        this.connection.console.log('- server started')
    }

    // public getSettingsProvider():SettingsProvider {
    //     return this.settingsProvider;
    // }

    public getSettings():Settings {
        return this.settingsProvider.getSettings();
    }

    public getHoverProvider():HoverProvider {
        return this.hoverProvider;
    }

    public getProject():Project {
        return this.project;
    }

}
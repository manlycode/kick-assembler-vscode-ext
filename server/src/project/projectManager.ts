
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
} from "vscode-languageserver";

import SettingsProvider from "../providers/settingsProvider";
import HoverProvider from "../providers/hoverProvider";
import Project from "./project";

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

        this.settingsProvider = new SettingsProvider(connection);
        this.hoverProvider = new HoverProvider(connection);

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

    }

    public start() {
        this.connection.console.log("[projectManager.start");
        this.connection.listen();
        this.connection.console.log('- server started')
    }

    public getSettingsProvider():SettingsProvider {
        return this.settingsProvider;
    }

    public getHoverProvider():HoverProvider {
        return this.hoverProvider;
    }

    public getProject():Project {
        return this.project;
    }

}

/*
    Class: ProjectManager

    Manages the Project for this Extension

    Remarks:

        The Manager is responsible for
        the handling of providers that are
        available on the Client.

*/
import {
    InitializeResult,
    TextDocuments,
    InitializeParams,
    InitializedParams,
    DidChangeTextDocumentParams,
    DidOpenTextDocumentParams,
    DidSaveTextDocumentParams,
    Connection,
    DidCloseTextDocumentParams
} from "vscode-languageserver";

import SettingsProvider, { Settings } from "../providers/SettingsProvider";
import HoverProvider from "../providers/HoverProvider";
import Project from "./Project";
import { ProjectInfoProvider } from "../providers/Provider";
import DiagnosticProvider from "../providers/DiagnosticProvider";
import { readFileSync } from "fs";
import PathUtils from "../utils/PathUtils";
import { createHash } from "crypto";
import DocumentSymbolProvider from "../providers/DocumentSymbolProvider";
import CompletionProvider from "../providers/CompletionProvider";
import SignatureHelpProvider from "../providers/SignatureHelpProvider";
import DefinitionProvider from "../providers/DefinitionProvider";

export default class ProjectManager {

    private projects: Project[];

    private connection: Connection;

    private documents: TextDocuments;
    private settingsProvider: SettingsProvider;
    private hoverProvider: HoverProvider;
    private diagnosticProvider: DiagnosticProvider;
    private documentSymbolProvider: DocumentSymbolProvider;
    private completionProvider: CompletionProvider;
    private signatureHelpProvider: SignatureHelpProvider;
    private definitionProvider: DefinitionProvider;
    private timer: NodeJS.Timer;

    constructor(connection: Connection) {

        this.projects = [];

        this.connection = connection;

        //  setup listener for documents
        this.documents = new TextDocuments();
        this.documents.listen(this.connection);

        //  setup project information provider
        const projectInfoProvider: ProjectInfoProvider = {
            getProject: this.getProject.bind(this),
            getSettings: this.getSettings.bind(this)
        };

        this.settingsProvider = new SettingsProvider(connection, projectInfoProvider);
        this.hoverProvider = new HoverProvider(connection, projectInfoProvider);
        this.diagnosticProvider = new DiagnosticProvider(connection, projectInfoProvider);
        this.documentSymbolProvider = new DocumentSymbolProvider(connection, projectInfoProvider);
        this.completionProvider = new CompletionProvider(connection, projectInfoProvider);
        this.signatureHelpProvider = new SignatureHelpProvider(connection, projectInfoProvider);
        this.definitionProvider = new DefinitionProvider(connection, projectInfoProvider);

        connection.onInitialize((params: InitializeParams): InitializeResult => {
            return {
                capabilities: {
                    textDocumentSync: this.documents.syncKind,
                    hoverProvider: true,
                    documentSymbolProvider: true,
                    definitionProvider : true,
                    signatureHelpProvider: {
                        triggerCharacters: ["(",","]
                    },
                    completionProvider: {
                        resolveProvider: true,
                        triggerCharacters: ["#", ".", " ", "<", ">", ",", "*", '"', "("],
                    }
                }
            };
        });

        connection.onInitialized((params: InitializedParams) => {
            connection.console.log(params.toString());
        });

        connection.onDidOpenTextDocument((open: DidOpenTextDocumentParams) => {
            var project = new Project(open.textDocument.uri);
            project.connection = this.connection;
            this.projects.push(project);
            if (this.settingsProvider.getSettings().valid) {
                project.assemble(this.settingsProvider.getSettings(), open.textDocument.text);
                this.diagnosticProvider.process(open.textDocument.uri);
            }
        });

        connection.onDidChangeTextDocument((change: DidChangeTextDocumentParams) => {

            var project = this.findProject(change.textDocument.uri);
            var kickAssSettings = this.settingsProvider.getSettings();
            var source = change.contentChanges[0].text;
            
            project.setSource(source); // always update the source

            if (kickAssSettings.valid && kickAssSettings.autoAssembleTrigger.indexOf('onChange') !== -1) {

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                this.timer = setTimeout(() => {
                    project.assemble(kickAssSettings, source);
                    this.diagnosticProvider.process(change.textDocument.uri);
                },
                960);
            }
        });

        connection.onDidSaveTextDocument((change: DidSaveTextDocumentParams) => {

            var project = this.findProject(change.textDocument.uri);
            var file = readFileSync(PathUtils.uriToPlatformPath(change.textDocument.uri), 'utf8');

            if (this.settingsProvider.getSettings().valid) {
                project.assemble(this.settingsProvider.getSettings(), file);
                this.diagnosticProvider.process(change.textDocument.uri);
            }

            if (this.timer) {
                clearTimeout(this.timer);
            }
        });

        connection.onDidCloseTextDocument((close: DidCloseTextDocumentParams) => {
            this.removeProject(close.textDocument.uri);
            if (this.timer) {
                clearTimeout(this.timer);
            }
        });
    }

    private findProject(uri: string): Project | undefined {
        var hash = createHash('md5').update(uri).digest('hex');
        for (var project of this.projects) {
            if (hash == project.getId()) {
                return project;
            }
        }
    }

    private removeProject(uri: string) {
        var pos = 0;
        var hash = createHash('md5').update(uri).digest('hex');
        for (var project of this.projects) {
            if (hash == project.getId()) {
                this.projects.splice(pos, 1);
            }
            pos += 1;
        }
    }

    public start() {
        this.connection.console.log("[projectManager.start");
        this.connection.listen();
        this.connection.console.log('- server started')
    }

    public getSettings(): Settings {
        return this.settingsProvider.getSettings();
    }

    public getHoverProvider(): HoverProvider {
        return this.hoverProvider;
    }

    public getProject(uri: string): Project {
        return this.findProject(uri);
    }

    public getCompletionProvider(): CompletionProvider {
        return this.completionProvider;
    }

}
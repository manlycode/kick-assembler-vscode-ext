import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    IConnection,
    DidChangeConfigurationParams
 } from "vscode-languageserver";
import Project from "../project/Project";

import { existsSync } from "fs";

/*

*/

interface GlobalSettings {
    ['kickassembler']:Settings;
}

export interface Settings {
    assemblerJar: string
    javaRuntime: string;
    javaOptions: string;
    valid: boolean;
    emulatorRuntime: string;
    emulatorOptions: string;
    debuggerRuntime: string;
    debuggerOptions: string;
    outputDirectory: string;
    autoAssembleTrigger: string;
    debuggerDumpFile: boolean;
    javaAllowFileCreation: boolean;
    completionParameterPlaceholders: boolean;
    fileTypesBinary: string;
    fileTypesSid: string;
    fileTypesPicture: string;
    fileTypesSource: string;
    fileTypesC64: string;
    fileTypesText: string;
}

export default class SettingsProvider extends Provider {

    private settings:Settings;

    constructor(connection:IConnection, projectInfo:ProjectInfoProvider) {

        super(connection, projectInfo);
        connection.console.log("- settings provider registered");

        connection.onDidChangeConfiguration((change:DidChangeConfigurationParams) => {
            connection.console.log("- onDidChangeConfiguration");
            const settings = <GlobalSettings>change.settings;
            this.process(<Settings>settings['kickassembler']);
        });
    }

    public getSettings() {
        return this.settings;
    }

    private process(settings:Settings) {
        this.settings = settings;
        this.settings.valid = this.validateSettings(settings);
    }

    /**
     * Returns true if the settings for the extension are Valid, 
     * false otherwise.
     * 
     * @param settings 
     */
    private validateSettings(settings:Settings):boolean|undefined {

        var valid = true;
        var accessResult;

        accessResult = existsSync(settings.assemblerJar);
        if (!accessResult) valid = false;

        accessResult = existsSync(settings.javaRuntime);
        if (!accessResult) valid = false;

        return valid;
    }
}
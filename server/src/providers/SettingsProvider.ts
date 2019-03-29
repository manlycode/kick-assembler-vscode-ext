import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    IConnection,
    DidChangeConfigurationParams
 } from "vscode-languageserver";
import Project from "../project/Project";

/*

*/

interface GlobalSettings {
    ['kickassembler']:Settings;
}

export interface Settings {
    assemblerPath:string
    javaPath:string;
    valid:boolean;
}

export default class SettingsProvider extends Provider {

    private settings:Settings;

    constructor(connection:IConnection, projectInfo:ProjectInfoProvider) {

        super(connection, projectInfo);
        connection.console.log("- settings provider registered")

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

    //  TODO: 
    private validateSettings(settings:Settings):boolean|undefined {
        return true;
    }
}
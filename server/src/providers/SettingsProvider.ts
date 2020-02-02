import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    IConnection,
    DidChangeConfigurationParams
 } from "vscode-languageserver";
import Project from "../project/Project";
import { Assembler } from "../assembler/Assembler"
import { existsSync } from "fs";
import * as opn from "open";

/*

*/

interface GlobalSettings {
    ['kickassembler']:Settings;
}

interface SettingsOpcodes {
    "65c02":boolean;
    DTV: boolean;
    illegal: boolean;
}
export interface Settings {
    assemblerJar: string
    javaRuntime: string;
    javaOptions: string;
    valid: boolean;
    emulatorRuntime: string;
    emulatorOptions: string;
    emulatorViceSymbols: boolean;
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
    opcodes:SettingsOpcodes;
}

export default class SettingsProvider extends Provider {

    private settings:Settings;
    private latestKickassVersion:number = 5.12;

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

        if (!existsSync(settings.assemblerJar)) return false;
        if (!existsSync(settings.javaRuntime)) return false;
        
        let assembler = new Assembler();
        let assemblerResults = assembler.assemble(this.settings, settings.assemblerJar, "",true);
        var kickassVersion = assemblerResults.assemblerInfo.getAssemblerVersion();
        if(kickassVersion === 0) {
            // version lower than 5.12, parse output
            var parsedKickassVersion = assemblerResults.stdout.match(/\d+\.\d+/);
            if(parsedKickassVersion) {
                kickassVersion = parseFloat(parsedKickassVersion[0]);
            }
        }
        if (kickassVersion < 5) {
            var offerKickassDownload = this.getConnection().window.showWarningMessage('Your KickAssembler Version '+kickassVersion+' is ' + (kickassVersion <4 ?'not supported': 'outdated')+'.', {
                title: 'Get latest KickAssembler Version'
            });
            offerKickassDownload.then((value) => {
                if (value){
                    opn('http://theweb.dk/KickAssembler/');
                }
            });
            if(kickassVersion < 4) return false;       
        }
        else if (kickassVersion < this.latestKickassVersion) {
            this.getConnection().window.showInformationMessage('Your KickAssembler Version '+kickassVersion+' is not current ('+this.latestKickassVersion+')');
        }
      
        return true;
    }

}
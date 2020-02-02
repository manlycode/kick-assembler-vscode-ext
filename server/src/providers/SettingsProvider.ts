import { 
    Provider, ProjectInfoProvider 
} from "./Provider";

import { 
    IConnection,
    DidChangeConfigurationParams
 } from "vscode-languageserver";
import Project from "../project/Project";
import { Assembler } from "../assembler/Assembler"
import * as fs from "fs";
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
    private kickAssemblerLatestVersion:string = "5.12";
    private kickAssemblerWebsite: string = "http://theweb.dk/KickAssembler/";

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

        if (!fs.existsSync(settings.assemblerJar)) return false;
        if (!fs.existsSync(settings.javaRuntime)) return false;
        try {
            fs.accessSync(settings.assemblerJar, fs.constants.W_OK);

            let assembler = new Assembler();
            let assemblerResults = assembler.assemble(this.settings, settings.assemblerJar, "",true);
            var kickassVersion = assemblerResults.assemblerInfo.getAssemblerVersion();
            if(kickassVersion === "0") {
                // version lower than 5.12, parse output
                var parsedKickassVersion = assemblerResults.stdout.match(/\d+\.\d+/);
                if(parsedKickassVersion) {
                    kickassVersion = parsedKickassVersion[0];
                }
            }
            var compareVersions = require('compare-versions');
            if(compareVersions.compare(kickassVersion,"4","<")) {
                this.kickAssBelow4Error(kickassVersion);
                return false;       
            }
            if(compareVersions.compare(kickassVersion,"5","<")) {
                var offerKickassDownload = this.getConnection().window.showWarningMessage(`Your KickAssembler Version ${kickassVersion} is outdated.`, {
                    title: 'Upgrade KickAssembler'
                });
                offerKickassDownload.then((value) => {
                    if (value){
                        opn(this.kickAssemblerWebsite);
                    }
                });   
            }        
            else if(compareVersions.compare(kickassVersion,this.kickAssemblerLatestVersion,"<")) {
                var offerKickassDownload = this.getConnection().window.showInformationMessage(`Your KickAssembler Version ${kickassVersion} can be updated to ${this.kickAssemblerLatestVersion}.`, {
                    title: 'Download Update' 
                });
                offerKickassDownload.then((value) => {
                    if (value){
                        opn(this.kickAssemblerWebsite);
                    }
                }); 
            }
        }
        catch (err) {
// at least try to guess the version by jar size
            const jarFileStats = fs.statSync(settings.assemblerJar);
            //Kickass 2.x and 3.x are smaller than 400k in size
            if (jarFileStats.size < 400000) {
                this.kickAssBelow4Error('lower than 4.0')
                return false;
            }
            this.getConnection().window.showWarningMessage('Cannot check KickAssembler version. No write permissions to jar folder.');
        }
        return true;
    }

    private kickAssBelow4Error(kickassVersion:string){
        var offerKickassDownload = this.getConnection().window.showErrorMessage(`Your KickAssembler Version ${kickassVersion} is not supported.`, {
            title: 'Get supported KickAssembler Version'
        });
        offerKickassDownload.then((value) => {
            if (value){
                opn(this.kickAssemblerWebsite);
            }
        });
    }

}
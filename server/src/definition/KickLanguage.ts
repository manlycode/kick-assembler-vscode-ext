
import { Instructions, Instruction } from "./KickInstructions";
import { Directives, Directive, Star } from "./KickDirectives";
import { PseudoOps, PseudoOp } from "./KickPseudoOps";
import { Extensions } from "./KickExtensions";
import { PreProcessors, PreProcessor } from "./KickPreprocessors";

export interface KickLanguageDefinition {
    Instructions: Instruction[];
    Directives: Directive[];
	PseudoOps: PseudoOp[];
	Extensions: {[key: string]:string[]};
    PreProcessors: PreProcessor[];
    Star: Directive;
}

export const KickLanguage:KickLanguageDefinition = {
    Instructions,
    Directives,
    PseudoOps,
    Extensions,
    PreProcessors,
    Star
};
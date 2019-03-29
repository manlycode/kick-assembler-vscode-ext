
import { Instructions, Instruction } from "./KickInstructions";
import { PseudoOps, PseudoOp } from "./KickPseudoOps";
import { Extensions } from "./KickExtensions";
import { PreProcessors, PreProcessor } from "./KickPreprocessors";

export interface KickLanguageDefinition {
	Instructions: Instruction[];
	PseudoOps: PseudoOp[];
	Extensions: {[key: string]:string[]};
	PreProcessors: PreProcessor[];
}

export const KickLanguage:KickLanguageDefinition = {
    Instructions,
    PseudoOps,
    Extensions,
    PreProcessors,
}
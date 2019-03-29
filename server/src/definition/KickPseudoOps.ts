import { Parameter } from "./KickPreprocessors";

export interface PseudoOp {
	name: string;
	otherNames: string[];
	canHaveLabel: boolean;
	description: string;
	documentation: string[];
	parameters: Parameter[];
	relatedTo: string[];
}


export const PseudoOps:PseudoOp[] = [];
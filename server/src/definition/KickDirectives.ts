import { Parameter } from "./KickPreprocessors";

export interface Directive {
	name: string;
	insertLabel: string;
	otherNames: string[];
	description: string;
	documentation: string[];
	parameters: Parameter[];
	relatedTo: string[];
}


export const Directives:Directive[] = [];

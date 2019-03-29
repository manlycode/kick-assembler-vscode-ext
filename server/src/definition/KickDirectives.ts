import { Parameter } from "./KickPreprocessors";

export interface Directive {
	name: string;
	insertLabel: string;
	otherNames: string[];
	description: string;
	example: string;
	documentation: string[];
	parameters: Parameter[];
	relatedTo: string[];
}

export class KickDirectives {

	public static createFromDirective() {

	}
}


export interface Parameter {
	name: string;
	type: "string" | "value" | "enum" | "label";
	values?: string[];
}

export interface PreProcessor {
	name: string;
	description: string;
	example: string;
	parameters: Parameter[];
}

export const PreProcessors:PreProcessor[] = [];
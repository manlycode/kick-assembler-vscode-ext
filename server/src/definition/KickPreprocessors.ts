import { TextEdit } from "vscode-languageserver";

export interface Parameter {
	name: string;
	type: "string" | "value" | "enum" | "label";
	values?: string[];
	description?: string;
	optional?: boolean;
}

export interface PreProcessor {
	name: string;
	description: string;
	example: string;
	parameters: Parameter[];
	snippet?: string;
}

export const PreProcessors:PreProcessor[] = [
	{
		name: "#define",
		description: "Defines a preprocessor symbol.",
		example: "\#define DEBUG",
		parameters : [
			{
				name: "symbol",
				type: "string",
			}
		],
		snippet: ' ${1:symbol}'
	},
	{
		name: "#elif",
		description: "The combination of an \#else\ and an \#if\ preprocessor directive.",
		example: "",
		parameters : [
			{
				name: "symbol",
				type: "string",
			}
		],
		snippet: ' ${1:symbol}'
	},
	{
		name: "#else",
		description: "Used after an \#if\ to start an else block which is executed if the condition is false.",
		example: "",
		parameters: []
	},
	{
		name: "#endif",
		description: "Marks the end of an #if/#else block.",
		example: "",
		parameters: []
	},
	{
		name: "#if",
		description: "Discards the sourcecode after the \#if\-directive if the condition is false.",
		example: "",
		parameters : [
			{
				name: "symbol",
				type: "string",
			}
		],
		snippet: ' ${1:symbol}'
	},
	{
		name: "#import",
		description: "Imports another sourcefile.",
		example: "",
		parameters : [
			{
				name: "name",
				type: "string",
			}
		],
		snippet: ' "$0"'
	},
	{
		name: "#importif",
		description: "Imports another sourcefile if the given expression is evaluated to true.",
		example: "",
		parameters : [
			{
				name: "symbol",
				type: "string",
			},
			{
				name: "filename",
				type: "string"
			}
		],
		snippet: ' ${1:symbol} "$0"'
	},
	{
		name: "#importonce",
		description: "Make the assembler skip the current file if it has already been imported.",
		example: "",
		parameters: []
	},
	{
		name: "#undef",
		description: "	Removes the definition of a preprocessor symbol.",
		example: "",
		parameters : [
			{
				name: "symbol",
				type: "string",
			}
		],
		snippet: ' ${1:symbol}'
	}
];
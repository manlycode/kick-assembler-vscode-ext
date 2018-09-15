import { Parameter } from "./KickPreprocessors";

export interface Instruction {
	name: string;
	description: string;
	group: string;
	parameters: Parameter[];
}

export const Instructions:Instruction[] = [
	{
		name: "LDA",
		description: "LoaD the Accumulator",
		group: "Load and Store",
		parameters: [],
	},
];
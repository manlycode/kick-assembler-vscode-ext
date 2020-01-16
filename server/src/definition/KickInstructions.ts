import { Parameter } from "./KickPreprocessors";

export interface Instruction {
	name: string;
	description: string;
	group: string;
	parameters: Parameter[];
	type?: string;
	snippet?: string;
}

export const Instructions:Instruction[] = [
	{
		name: "ADC",
		description: "ADd to accumulator with Carry",
		group: "Arithmetic",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "AND",
		description: "AND memory with accumulator",
		group: "Logical",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "ASL",
		description: "Accumulator Shift Left",
		group: "Shift and Rotate",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "BCC",
		description: "Branch on Carry Clear (C = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BCS",
		description: "Branch on Carry Set (C = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BEQ",
		description: "Branch on EQual to zero (Z = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BIT",
		description: "test BITs",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "BMI",
		description: "Branch on MInus (N = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BNE",
		description: "Branch on Not Equal to zero (Z = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BPL",
		description: "Branch on PLus (N = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BRK",
		description: "BReaK",
		group: "Other",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "BVC",
		description: "Branch on oVerflow Clear (V = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "BVS",
		description: "Branch on oVerflow Set (V = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "CLC",
		description: "CLear Carry flag",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "CLD",
		description: "CLear Decimal mode",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "CLI",
		description: "CLear Interrupt disable",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "CLV",
		description: "CLear oVerflow flag",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "CMP",
		description: "CoMPare memory and accumulator",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "CPX",
		description: "ComPare memory and X",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "CPY",
		description: "ComPare memory and Y",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "DEC",
		description: "DECrement memory by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "DEX",
		description: "DEcrement X by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "DEY",
		description: "DEcrement Y by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "EOR",
		description: "Exclusive-OR memory with Accumulator",
		group: "Logical",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "INC",
		description: "INCrement memory by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "INX",
		description: "INcrement X by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "INY",
		description: "INcrement Y by one",
		group: "Increment and Decrement",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "JMP",
		description: "JuMP to another location (GOTO)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "JSR",
		description: "Jump to SubRoutine",
		group: "Subroutine",
		parameters: [],
		snippet: ' ${1:target}'
	},
	{
		name: "LDA",
		description: "LoaD the Accumulator",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "LDX",
		description: "LoaD the X register",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "LDY",
		description: "LoaD the Y register",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "LSR",
		description: "Logical Shift Right",
		group: "Shift and Rotate",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "NOP",
		description: "No OPeration",
		group: "Other",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "ORA",
		description: "OR memory with Accumulator",
		group: "Logical",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "PHA",
		description: "PusH Accumulator on stack",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "PHP",
		description: "PusH Processor status on stack",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "PLA",
		description: "PulL Accumulator from stack",
		group: "Transfer",
		parameters: [],
	},
	{
		name: "PLP",
		description: "PulL Processor status from stack",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "ROL",
		description: "ROtate Left",
		group: "Shift and Rotate",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "ROR",
		description: "ROtate Right",
		group: "Shift and Rotate",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "RTI",
		description: "ReTurn from Interrupt",
		group: "Subroutine",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "RTS",
		description: "ReTurn from Subroutine",
		group: "Subroutine",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "SBC",
		description: "SuBtract from accumulator with Carry",
		group: "Arithmetic",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "SEC",
		description: "SEt Carry",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "SED",
		description: "SEt Decimal mode",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "SEI",
		description: "SEt Interrupt disable",
		group: "Set and Reset (Clear)",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "STA",
		description: "STore the Accumulator",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "STX",
		description: "STore the X register",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "STY",
		description: "STore the Y register",
		group: "Load and Store",
		parameters: [],
		snippet: ' ${1:value}'
	},
	{
		name: "TAX",
		description: "Transfer Accumulator to X",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "TAY",
		description: "Transfer Accumulator to Y",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "TSX",
		description: "Transfer Stack pointer to X",
		group: "Stack",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "TXA",
		description: "Transfer X to accumulator",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "TXS",
		description: "Transfer X to Stack pointer",
		group: "Stack",
		parameters: [],
		snippet: '\n'
	},
	{
		name: "TYA",
		description: "Transfer Y to Accumulator",
		group: "Transfer",
		parameters: [],
		snippet: '\n'
	},
];
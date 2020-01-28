import { Parameter } from "./KickPreprocessors";
import { SymbolKind } from "vscode-languageserver";
import { SymbolType } from "../project/Project";

export enum InstructionType {
    Legal,
    Illegal,
	DTV,
	C02
}
export interface Instruction {
	name: string;
	description: string;
	group: string;
	parameters?: Parameter[];
	type?: InstructionType;
	snippet?: string;
}

export const Instructions:Instruction[] = [
	{
		name: "ADC",
		description: "ADd to accumulator with Carry",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "AND",
		description: "AND memory with accumulator",
		group: "Logical",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "ASL",
		description: "Accumulator Shift Left",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number,
			optional: true
		}],
		snippet: ' '
	},
	{
		name: "BCC",
		description: "Branch on Carry Clear (C = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BCS",
		description: "Branch on Carry Set (C = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BEQ",
		description: "Branch on EQual to zero (Z = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BIT",
		description: "test BITs",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BMI",
		description: "Branch on MInus (N = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BNE",
		description: "Branch on Not Equal to zero (Z = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BPL",
		description: "Branch on PLus (N = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BRK",
		description: "BReaK",
		group: "Other",
		snippet: '\n'
	},
	{
		name: "BVC",
		description: "Branch on oVerflow Clear (V = 0)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BVS",
		description: "Branch on oVerflow Set (V = 1)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "CLC",
		description: "CLear Carry flag",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "CLD",
		description: "CLear Decimal mode",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "CLI",
		description: "CLear Interrupt disable",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "CLV",
		description: "CLear oVerflow flag",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "CMP",
		description: "CoMPare memory and accumulator",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "CPX",
		description: "ComPare memory and X",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "CPY",
		description: "ComPare memory and Y",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "DEC",
		description: "DECrement memory by one",
		group: "Increment and Decrement",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "DEX",
		description: "DEcrement X by one",
		group: "Increment and Decrement",
		snippet: '\n'
	},
	{
		name: "DEY",
		description: "DEcrement Y by one",
		group: "Increment and Decrement",
		snippet: '\n'
	},
	{
		name: "EOR",
		description: "Exclusive-OR memory with Accumulator",
		group: "Logical",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "INC",
		description: "INCrement memory by one",
		group: "Increment and Decrement",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "INX",
		description: "INcrement X by one",
		group: "Increment and Decrement",
		snippet: '\n'
	},
	{
		name: "INY",
		description: "INcrement Y by one",
		group: "Increment and Decrement",
		snippet: '\n'
	},
	{
		name: "JMP",
		description: "JuMP to another location (GOTO)",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "JSR",
		description: "Jump to SubRoutine",
		group: "Subroutine",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LDA",
		description: "LoaD the Accumulator",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LDX",
		description: "LoaD the X register",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LDY",
		description: "LoaD the Y register",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LSR",
		description: "Logical Shift Right",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number,
			optional: true
		}],
		snippet: ' '
	},
	{
		name: "NOP",
		description: "No OPeration",
		group: "Other",
		snippet: '\n'
	},
	{
		name: "ORA",
		description: "OR memory with Accumulator",
		group: "Logical",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "PHA",
		description: "PusH Accumulator on stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "PHP",
		description: "PusH Processor status on stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "PLA",
		description: "PulL Accumulator from stack",
		group: "Transfer",
		snippet: '\n'		
	},
	{
		name: "PLP",
		description: "PulL Processor status from stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "ROL",
		description: "ROtate Left",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number,
			optional: true
		}],
		snippet: ' '
	},
	{
		name: "ROR",
		description: "ROtate Right",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number,
			optional: true
		}],
		snippet: ' '
	},
	{
		name: "RTI",
		description: "ReTurn from Interrupt",
		group: "Subroutine",
		snippet: '\n'
	},
	{
		name: "RTS",
		description: "ReTurn from Subroutine",
		group: "Subroutine",
		snippet: '\n'
	},
	{
		name: "SBC",
		description: "SuBtract from accumulator with Carry",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SEC",
		description: "SEt Carry",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "SED",
		description: "SEt Decimal mode",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "SEI",
		description: "SEt Interrupt disable",
		group: "Set and Reset (Clear)",
		snippet: '\n'
	},
	{
		name: "STA",
		description: "STore the Accumulator",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "STX",
		description: "STore the X register",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "STY",
		description: "STore the Y register",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "TAX",
		description: "Transfer Accumulator to X",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "TAY",
		description: "Transfer Accumulator to Y",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "TSX",
		description: "Transfer Stack pointer to X",
		group: "Stack",
		snippet: '\n'
	},
	{
		name: "TXA",
		description: "Transfer X to accumulator",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "TXS",
		description: "Transfer X to Stack pointer",
		group: "Stack",
		snippet: '\n'
	},
	{
		name: "TYA",
		description: "Transfer Y to Accumulator",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "AHX",
		type: InstructionType.Illegal,
		description: "stores A&X&H into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "ALR",
		type: InstructionType.Illegal,
		description: "AND #{value} + LSR",
		group: "Shift and Rotate",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "ANC",
		type: InstructionType.Illegal,
		description: "AND #{value} + (ASL)",
		group: "Shift and Rotate",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "ANC2",
		type: InstructionType.Illegal,
		description: "AND #{value} + (ROL)",
		group: "Shift and Rotate",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "ARR",
		type: InstructionType.Illegal,
		description: "AND #{value} + ROR",
		group: "Shift and Rotate",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "AXS",
		type: InstructionType.Illegal,
		description: "A&X minus #{value} into X",
		group: "Arithmetic",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "DCP",
		type: InstructionType.Illegal,
		description: "DEC memory + CMP memory",
		group: "Increment and Decrement",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "ISC",
		type: InstructionType.Illegal,
		description: "INC memory + SBC memory",
		group: "Increment and Decrement",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LAS",
		type: InstructionType.Illegal,
		description: "stores memory&S into A, X and S",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LAX",
		type: InstructionType.Illegal,
		description: "LDA #{value} + TAX",
		group: "Load and Store",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "RLA",
		type: InstructionType.Illegal,
		description: "ROL memory + AND memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RRA",
		type: InstructionType.Illegal,
		description: "ROR memory + ADC memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SAX",
		type: InstructionType.Illegal,
		description: "store A&X into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SBC2",
		type: InstructionType.Illegal,
		description: "SBC #{value} + NOP",
		group: "Arithmetic",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "SHX",
		type: InstructionType.Illegal,
		description: "stores X&H into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SHY",
		type: InstructionType.Illegal,
		description: "stores Y&H into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SLO",
		type: InstructionType.Illegal,
		description: "ASL memory + ORA memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "ASO",	//alias of SLO
		type: InstructionType.Illegal,
		description: "ASL memory + ORA memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SRE",
		type: InstructionType.Illegal,
		description: "LSR memory + EOR memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "LSE",	//alias of SRE
		type: InstructionType.Illegal,
		description: "LSR memory + EOR memory",
		group: "Shift and Rotate",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "TAS",
		type: InstructionType.Illegal,
		description: "stores A&X into S and A&X&H into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "XAA",
		type: InstructionType.Illegal,
		description: "TXA + AND #{value}",
		group: "Shift and Rotate",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "KIL",
		type: InstructionType.Illegal,
		description: "Halts the CPU. the data bus will be set to #$FF",
		group: "Other",
		snippet: '\n'
	},
	{
		name: "JAM",	//alias of KIL
		type: InstructionType.Illegal,
		description: "Halts the CPU. the data bus will be set to #$FF",
		group: "Other",
		snippet: '\n'
	},
	{
		name: "HLT",	//alias of KIL
		type: InstructionType.Illegal,
		description: "Halts the CPU. the data bus will be set to #$FF",
		group: "Other",
		snippet: '\n'
	},
	{
		name: "BRA",
		type: InstructionType.DTV,
		description: "BRanch Always",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SAC",
		type: InstructionType.DTV,
		description: "Set ACcumulator mapping",
		group: "Load and Store",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "SIR",
		type: InstructionType.DTV,
		description: "Set Index Register mapping",
		group: "Load and Store",
		parameters: [{
			name: "value",
			kind: SymbolKind.Number
		}],
		snippet: ' #'
	},
	{
		name: "BBR0",
		type: InstructionType.C02,
		description: "branch on bit 0 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR1",
		type: InstructionType.C02,
		description: "branch on bit 1 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR2",
		type: InstructionType.C02,
		description: "branch on bit 2 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR3",
		type: InstructionType.C02,
		description: "branch on bit 3 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR4",
		type: InstructionType.C02,
		description: "branch on bit 4 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR5",
		type: InstructionType.C02,
		description: "branch on bit 5 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR6",
		type: InstructionType.C02,
		description: "branch on bit 6 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBR7",
		type: InstructionType.C02,
		description: "branch on bit 7 reset",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS0",
		type: InstructionType.C02,
		description: "branch on bit 0 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS1",
		type: InstructionType.C02,
		description: "branch on bit 1 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS2",
		type: InstructionType.C02,
		description: "branch on bit 2 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS3",
		type: InstructionType.C02,
		description: "branch on bit 3 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS4",
		type: InstructionType.C02,
		description: "branch on bit 4 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS5",
		type: InstructionType.C02,
		description: "branch on bit 5 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS6",
		type: InstructionType.C02,
		description: "branch on bit 6 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "BBS7",
		type: InstructionType.C02,
		description: "branch on bit 7 set",
		group: "Jump, Branch, Compare, and Test",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "PHX",
		type: InstructionType.C02,
		description: "PusH X register on stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "PHY",
		type: InstructionType.C02,
		description: "PusH Y register on stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "PLX",
		type: InstructionType.C02,
		description: "PulL X register from stack",
		group: "Transfer",
		snippet: '\n'		
	},
	{
		name: "PLY",
		type: InstructionType.C02,
		description: "PulL Y register from stack",
		group: "Transfer",
		snippet: '\n'
	},
	{
		name: "RMB0",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^0",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB1",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^1",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB2",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^2",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB3",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^3",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB4",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^4",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB5",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^5",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB6",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^6",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "RMB7",
		type: InstructionType.C02,
		description: "memory:=memory nand 2^7",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB0",
		type: InstructionType.C02,
		description: "memory:=memory or 2^0",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB1",
		type: InstructionType.C02,
		description: "memory:=memory or 2^1",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB2",
		type: InstructionType.C02,
		description: "memory:=memory or 2^2",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB3",
		type: InstructionType.C02,
		description: "memory:=memory or 2^3",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB4",
		type: InstructionType.C02,
		description: "memory:=memory or 2^4",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB5",
		type: InstructionType.C02,
		description: "memory:=memory or 2^5",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB6",
		type: InstructionType.C02,
		description: "memory:=memory or 2^6",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "SMB7",
		type: InstructionType.C02,
		description: "memory:=memory or 2^7",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "STP",
		type: InstructionType.C02,
		description: "SToP",
		group: "Other",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "STZ",
		type: InstructionType.C02,
		description: "STore Zero into memory",
		group: "Load and Store",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "TRB",
		type: InstructionType.C02,
		description: "Test and Reset Bits memory:=memory nand A",
		group: "Arithmetic",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "TSB",
		type: InstructionType.C02,
		description: "Test and Set Bits memory:=memory or A",
		group: "STore Zero into memory",
		parameters: [{
			name: "memory",
			kind: SymbolKind.Number
		}],
		snippet: ' '
	},
	{
		name: "WAI",
		type: InstructionType.C02,
		description: "WAit for Interrupt",
		group: "",
		snippet: '\n'
	}

];
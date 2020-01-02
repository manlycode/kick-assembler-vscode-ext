import { Symbol, SymbolType } from "../project/Project";
import { CompletionItemKind, ParameterInformation } from "vscode-languageserver";
import { Parameter } from "./KickPreprocessors";

export class KickInternalSymbols {

    constructor() {

    }

    public static getBuiltInSymbols():Symbol[]|undefined {

        return [
            /*
                COLORS
            */
            {
                type: SymbolType.Constant,
                name: "BLACK",
                description: "The Color BLACK",
                value: 0,
                originalValue: "#$00",
                kind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
            },
            {
                type: SymbolType.Constant,
                name: "WHITE",
                description: "The Color WHITE",
                value: 1,
                originalValue: "#$01",
                kind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
            },
            {
                type: SymbolType.Constant,
                name: "RED",
                description: "The Color RED",
                value: 1,
                originalValue: "$02",
                kind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
            },
            /*
                MACROS
            */
           {
                type: SymbolType.Macro,
                name: "BasicUpstart",
                description: "Creates a BASIC Program at the Address Specified.",
                value: 1,
                originalValue: "",
                kind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
            },
            {
                type: SymbolType.Macro,
                name: "BasicUpstart2",
                description: "Creates a BASIC Program at the Address Specified.",
                value: 1,
                originalValue: "",
                kind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                parameters: [
                    <Parameter> {
                        name: "start",
                        type: "string",
                        description: "The Label that locates the Start of the Program."
                    }
                ]
            },
            /*
                MATH LIB
            */
           {
                type: SymbolType.Function,
                name: "abs",
                description: "Returns the Absolute (positive) value of X. For example, the Absolute value of -2 is 2.",
                value: 1,
                originalValue: "",
                kind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the Absolute Value is needed."
                    }
                ]
            },
    ];
    }
}
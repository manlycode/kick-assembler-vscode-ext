import { Symbol, SymbolType } from "../project/Project";
import { CompletionItemKind } from "vscode-languageserver";

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
                kind: CompletionItemKind.Color,
                line: undefined,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                comments: undefined,
                data: undefined
            },
            {
                type: SymbolType.Constant,
                name: "WHITE",
                description: "The Color WHITE",
                value: 1,
                kind: CompletionItemKind.Color,
                line: undefined,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                comments: undefined,
                data: undefined
            },
            {
                type: SymbolType.Constant,
                name: "RED",
                description: "The Color RED",
                value: 1,
                kind: CompletionItemKind.Color,
                line: undefined,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                comments: undefined,
                data: undefined
            },
            /*
                MACROS
            */
           {
                type: SymbolType.Macro,
                name: "BasicUpstart",
                description: "Creates a BASIC Program at the Address Specified.",
                value: 1,
                kind: CompletionItemKind.Function,
                line: undefined,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                comments: undefined,
                data: undefined
            },
            {
                type: SymbolType.Macro,
                name: "BasicUpstart2",
                description: "Creates a BASIC Program at the Address Specified.",
                value: 1,
                kind: CompletionItemKind.Function,
                line: undefined,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                comments: undefined,
                data: undefined
            }
        ];
    }
}
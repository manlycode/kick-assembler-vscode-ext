import { Symbol, SymbolType } from "../project/Project";
import { CompletionItemKind, ParameterInformation } from "vscode-languageserver";
import { Parameter } from "./KickPreprocessors";

export interface Property {
	name: string;
	type: "string" | "value" | "enum" | "label";
	values?: string[];
	description?: string;
}
export interface Method {
	name: string;
	type: "string" | "value" | "enum" | "label";
    values?: string[];
    description?: string;
    example?: string;
	parameters?: Parameter[];
}

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
                comments: "The Color BLACK",
                value: 0,
                originalValue: "#$00",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "WHITE",
                comments: "The Color WHITE",
                value: 1,
                originalValue: "#$01",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "RED",
                description: "The Color RED",
                value: 2,
                originalValue: "$02",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "CYAN",
                description: "The Color CYAN",
                value: 3,
                originalValue: "$03",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "PURPLE",
                description: "The Color PURPLE",
                value: 4,
                originalValue: "$04",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "GREEN",
                description: "The Color GREEN",
                value: 5,
                originalValue: "$05",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "BLUE",
                description: "The Color BLUE",
                value: 6,
                originalValue: "$07",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "YELLOW",
                description: "The Color YELLOW",
                value: 7,
                originalValue: "$07",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "ORANGE",
                description: "The Color ORANGE",
                value: 8,
                originalValue: "$08",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "BROWN",
                description: "The Color BROWN",
                value: 9,
                originalValue: "$09",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "LIGHT_RED",
                description: "The Color LIGHT RED",
                value: 10,
                originalValue: "$0a",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "DARK_GRAY",
                description: "The Color DARK_GRAY",
                value: 11,
                originalValue: "$0b",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "DARK_GREY",
                description: "The Color DARK_GREY",
                value: 11,
                originalValue: "$0b",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "GRAY",
                description: "The Color GRAY",
                value: 12,
                originalValue: "$0c",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "GREY",
                description: "The Color GREY",
                value: 12,
                originalValue: "$0c",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "LIGHT_GREEN",
                description: "The Color LIGHT_GREEN",
                value: 13,
                originalValue: "$0d",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "LIGHT_BLUE",
                description: "The Color LIGHT_BLUE",
                value: 14,
                originalValue: "$0e",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "LIGHT_GRAY",
                description: "The Color LIGHT_GRAY",
                value: 15,
                originalValue: "$0f",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "LIGHT_GREY",
                description: "The Color LIGHT_GREY",
                value: 15,
                originalValue: "$0f",
                completionKind: CompletionItemKind.Color,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
            },
            {
                type: SymbolType.Constant,
                name: "BF_C64FILE",
                description: "A C64 file (The two first bytes are skipped)",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
            },
            {
                type: SymbolType.Constant,
                name: "BF_BITMAP_SINGLECOLOR",
                description: "The Bitmap single color format outputted from Timanthes.",
                comments: "Blocks: ScreenRam, Bitmap",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
            },
            {
                type: SymbolType.Constant,
                name: "BF_KOALA",
                description: "Files from Koala Paint",
                comments: "Blocks: Bitmap, ScreenRam, ColorRam, BackgroundColor",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
            },
            {
                type: SymbolType.Constant,
                name: "BF_FLI",
                description: "Files from Blackmails FLI editor.",
                comments: "Blocks: ColorRam, ScreenRam, Bitmap",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
            },
            {
                type: SymbolType.Constant,
                name: "BF_DOODLE",
                description: "Files from Doodle",
                comments: "Blocks: ColorRam, Bitmap",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
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
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "address",
                        type: "string",
                        description: "The Label that locates the Start of the Program."
                    }
                ],
                snippet: '(${1:addess})\n'
            },
            {
                type: SymbolType.Macro,
                name: "BasicUpstart2",
                description: "Creates a BASIC Program at the Address Specified.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "address",
                        type: "string",
                        description: "The Label that locates the Start of the Program."
                    }
                ],
                snippet: '(${1:address})\n'
            },
            /*
                MATH LIB
            */
            {
                type: SymbolType.Constant,
                name: "PI",
                description: "The mathematical constant Pi",
                value: 3.141592653589793,
                originalValue: "3.141592653589793",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Constant,
                name: "E",
                description: "The natural logarithm base constant",
                value: 2.718281828459045,
                originalValue: "2.718281828459045",
                completionKind: CompletionItemKind.Constant,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true
            },
            {
                type: SymbolType.Function,
                name: "abs",
                description: "Returns the absolute (positive) value of X. For example, the absolute value of -2 is 2.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the absolute value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "acos",
                description: "Returns the arc cosine of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the sine value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "asin",
                description: "Returns the arc sine of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the arc sin value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "atan",
                description: "Returns the arc tangent x",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the arc tangent value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "atan2",
                description: "Returns the angle of the coordinate (x,y) relative to the positive x-axis. Useful when converting to polar coordinates.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "y",
                        type: "value",
                        description: "y coordinate for which the angle is needed."
                    },
                    {
                        name: "x",
                        type: "value",
                        description: "x coordinate for which the angle is needed."
                    }
                ],
                snippet: '(${1:y},${2:x})'
            },
            {
                type: SymbolType.Function,
                name: "cbrt",
                description: "Returns the cube root of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the cube of root is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "ceil",
                description: "Rounds up to the nearest integer.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the nearest integer is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "cos",
                description: "Returns the cosine of r.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "r",
                        type: "value",
                        description: "Numeric Expression for which the cosine value is needed."
                    }
                ],
                snippet: '(${1:r})'
            },
            {
                type: SymbolType.Function,
                name: "cosh",
                description: "Returns the hyperbolic cosine of x",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the hyperbolic cosine value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "exp",
                description: "Returns ex",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the ex is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "expm1",
                description: "Returns ex-1",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the ex is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "floor",
                description: "Rounds down to the nearest integer.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the floor value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "hypot",
                description: "Returns sqrt(x2+y2).",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "a",
                        type: "value",
                        description: "First numeric Expression for which the hypot value is needed."
                    },
                    {
                        name: "b",
                        type: "value",
                        description: "Second numeric Expression for which the hypot value is needed."
                    }
                ],
                snippet: '(${1:a},${2:b})'
            },
            {
                type: SymbolType.Function,
                name: "IEEEremainder",
                description: "Returns the remainder of the two numbers as described in the IEEE 754 standard.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "First numeric Expression for which the remainder is needed."
                    },
                    {
                        name: "y",
                        type: "value",
                        description: "Second numeric Expression for which the remainder is needed."
                    }
                ],
                snippet: '(${1:x},${2:y})'
            },
            {
                type: SymbolType.Function,
                name: "log",
                description: "Returns the natural logarithm of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the logarithm value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "log10",
                description: "Returns the base 10 logarithm of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the logarithm value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "log1p",
                description: "Returns log(x+1).",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the logarithm value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "max",
                description: "Returns the highest number of x and y.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "First numeric Expression for which the max value is needed."
                    },
                    {
                        name: "y",
                        type: "value",
                        description: "Second numeric Expression for which the max Value is needed."
                    }
                ],
                snippet: '(${1:x},${2:y})'
            },
            {
                type: SymbolType.Function,
                name: "min",
                description: "Returns the smallest number of x and y.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "First numeric Expression for which the min value is needed."
                    },
                    {
                        name: "y",
                        type: "value",
                        description: "Second numeric Expression for which the min Value is needed."
                    }
                ],
                snippet: '(${1:x},${2:y})'
            },
            {
                type: SymbolType.Function,
                name: "mod",
                description: "Converts a and b to integers and returns the remainder of a/b.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "a",
                        type: "value",
                        description: "First numeric Expression for which the mod value is needed."
                    },
                    {
                        name: "b",
                        type: "value",
                        description: "Second numeric Expression for which the mod Value is needed."
                    }
                ],
                snippet: '(${1:a},${2:b})'
            },
            {
                type: SymbolType.Function,
                name: "pow",
                description: "Returns x raised to the power of y.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "First numeric Expression for which the pow value is needed."
                    },
                    {
                        name: "y",
                        type: "value",
                        description: "Second numeric Expression for which the pow Value is needed."
                    }
                ],
                snippet: '(${1:x},${2:y})'
            },
            {
                type: SymbolType.Function,
                name: "random",
                description: "Returns a random number x where 0 ≤ x < 1.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "round",
                description: "Rounds x to the nearest integer.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the neareast value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "signum",
                description: "Returns 1 if x>0, -1 if x<0 and 0 if x=0.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the signum value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "sin",
                description: "Returns the sine of r.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "r",
                        type: "value",
                        description: "Numeric Expression for which the sine value is needed."
                    }
                ],
                snippet: '(${1:r})'
            },
            {
                type: SymbolType.Function,
                name: "sinh",
                description: "Returns the hyperbolic sine of x",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the hyperbolic sine value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "sqrt",
                description: "Returns the square root of x.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the square root value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
                        {
                type: SymbolType.Function,
                name: "tan",
                description: "Returns the tangent of r.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "r",
                        type: "value",
                        description: "Numeric Expression for which the tangent value is needed."
                    }
                ],
                snippet: '(${1:r})'
            },
            {
                type: SymbolType.Function,
                name: "tanh",
                description: "Returns the hyperbolic tangent of x",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "value",
                        description: "Numeric Expression for which the hyperbolic tangent value is needed."
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "toDegrees",
                description: "Converts a radian angle to degrees.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "r",
                        type: "value",
                        description: "Numeric Expression for conversion."
                    }
                ],
                snippet: '(${1:r})'
            },
            {
                type: SymbolType.Function,
                name: "toRadians",
                description: "Converts a degree angle to radians.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "d",
                        type: "value",
                        description: "Numeric Expression for conversion."
                    }
                ],
                snippet: '(${1:d})'
            },
            /*
                MISC
            */
            {
                type: SymbolType.Function,
                name: "getFilename",
                description: "Gets the filename of the current sourcefile",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "getPath",
                description: "Gets the path of the current sourcefile",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "getNamespace",
                description: "Gets the current namespace",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "LoadSid",
                description: "Imports a SID file from a given path and returns a value representing the sidfile",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "string",
                        description: "Path to a SID File"
                    }
                ],
                properties: <Property[]> [
                    {
                        name: "header",
                        type: "string",
                        description: "The sid file type (PSID or RSID)",
                        values: ["PSID","RSID"]
                    },
                    {
                        name: "version",
                        type: "string",
                        description: "The header version",
                        values: ["0001","0002","0003","0004"]
                    },
                    {
                        name: "location",
                        type: "string",
                        description: "The location of the song"
                    },
                    {
                        name: "init",
                        type: "string",
                        description: "The address of the init routine"
                    },
                    {
                        name: "play",
                        type: "string",
                        description: "The address of the play routine"
                    },
                    {
                        name: "songs",
                        type: "value",
                        description: "The number of songs"
                    },
                    {
                        name: "startSong",
                        type: "value",
                        description: "The default song"
                    },
                    {
                        name: "name",
                        type: "string",
                        description: "A string containing the name of the module"
                    },
                    {
                        name: "author",
                        type: "string",
                        description: "A string containing the name of the author"
                    },
                    {
                        name: "copyright",
                        type: "string",
                        description: "A string containing copyright information"
                    },
                    {
                        name: "speed",
                        type: "value",
                        description: "The speed flags (Consult the Sid format for details)"
                    },
                    {
                        name: "flags",
                        type: "string",
                        description: "flags (Consult the Sid format for details)"
                    },
                    {
                        name: "startpage",
                        type: "value",
                        description: "Startpage (Consult the Sid format for details)"
                    },
                    {
                        name: "pagelength",
                        type: "value",
                        description: "Pagelength (Consult the Sid format for details)"
                    },
                    {
                        name: "size",
                        type: "value",
                        description: "The data size in bytes"
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "getData",
                        type: "value",
                        description: "Returns the n'th byte of the module. Use this function together with the size variable to store the modules binary data into the memory.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Byte position (starts from 0)"
                            }
                        ]
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "LoadPicture",
                description: "Imports an Image file from a given path and returns a value representing the image",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "string",
                        description: "Path to an Image File"
                    }
                ],
                properties: <Property[]> [
                    {
                        name: "width",
                        type: "value",
                        description: "Returns the width of the picture in pixels."
                    },
                    {
                        name: "height",
                        type: "value",
                        description: "Returns the height of the picture in pixels."
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "getPixel",
                        type: "value",
                        description: "Returns the RGB value of the pixel at position x,y. Both x and y are given in pixels.",
                        parameters: <Parameter[]> [
                            {
                                name: "x",
                                type: "value",
                                description: "x position within the image given in pixels"
                            },
                            {
                                name: "y",
                                type: "value",
                                description: "y position within the image given in pixels"
                            }
                        ]
                    },
                    {
                        name: "getSinglecolorByte",
                        type: "value",
                        description: "Converts 8 pixels to a single color byte using the color table. X is given as a byte number (= pixel position/8) and y is given in pixels.",
                        parameters: <Parameter[]> [
                            {
                                name: "x",
                                type: "value",
                                description: "x position within the image given as a byte number (= pixel position/8) "
                            },
                            {
                                name: "y",
                                type: "value",
                                description: "y position within the image given in pixels"
                            }
                        ]
                    },
                    {
                        name: "getMulticolorByte",
                        type: "value",
                        description: " Converts 4 pixels to a multi color byte using the color table. X is given as a byte number (= pixel position/8) and y is given in pixels. (NB. This function ignores every second pixel since the C64 multi color format is half the resolution of the single color.)",
                        parameters: <Parameter[]> [
                            {
                                name: "x",
                                type: "value",
                                description: "x position within the image given as byte number (= pixel position/8) "
                            },
                            {
                                name: "y",
                                type: "value",
                                description: "y position within the image given in pixels"
                            }
                        ]
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "LoadBinary",
                description: "Imports an Image file from a given path and returns a value representing the image",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: [
                    <Parameter> {
                        name: "x",
                        type: "string",
                        description: "Path to a binary File"
                    }
                ],  
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Extract signed byte, which means the byte value $ff gives the number -1.",
                        parameters: <Parameter[]> [
                            {
                                name: "i",
                                type: "value",
                                description: "Byte position of the file"
                            }
                        ]
                    },
                    {
                        name: "getSize",
                        type: "value",
                        description: "Gets the size of the file."
                    },
                    {
                        name: "uget",
                        type: "value",
                        description: "Extract unsigned byte, which means the byte value $ff gives the number 255.",
                        parameters: <Parameter[]> [
                            {
                                name: "i",
                                type: "value",
                                description: "Byte position of the file"
                            }
                        ]
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "toIntString",
                description: "Return x as an integer string (eg x=16.0 will return '16').",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]>[
                    {
                        name: "x",
                        type: "value",
                        description: "Integer value to be converted"
                    },
                    {
                        name: "minSize",
                        type: "value",
                        description: "If given, it will return space-padded to reach the given minsize",
                        optional: true
                    }
                ] ,
                snippet: '(${1:x})' 
            },
            {
                type: SymbolType.Function,
                name: "toBinaryString",
                description: "Return x as a binary string (eg x=16.0 will return '10000'",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                     {
                        name: "x",
                        type: "value",
                        description: "Integer value to be converted"
                    },
                    {
                        name: "minSize",
                        type: "value",
                        description: "If given, it will return zero-padded to reach the given minsize",
                        optional: true
                    }
                ] ,
                snippet: '(${1:x})' 
            },
            {
                type: SymbolType.Function,
                name: "toOctalString",
                description: "Return x as an octal string (eg x=16.0 will return '20'",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                     {
                        name: "x",
                        type: "value",
                        description: "Integer value to be converted"
                    },
                    {
                        name: "minSize",
                        type: "value",
                        description: "If given, it will return zero-padded to reach the given minsize",
                        optional: true
                    }
                ],
                snippet: '(${1:x})'
            },
            {
                type: SymbolType.Function,
                name: "toHexString",
                description: "Return x as hexadecimal string (eg x=16.0 will return '10')",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                     {
                        name: "x",
                        type: "value",
                        description: "Integer value to be converted"
                    },
                    {
                        name: "minSize",
                        type: "value",
                        description: "If given, it will return zero-padded to reach the given minsize.",
                        optional: true
                    }
                ],
                snippet: '(${1:x})'  
            },
            {
                type: SymbolType.Function,
                name: "Vector",
                description: "Vector values are used to hold 3D vectors. They are created by the Vector function that takes x, y and z as argument",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "x value of the vector"
                    },
                    {
                        name: "y",
                        type: "value",
                        description: "y value of the vector"
                    },
                    {
                        name: "z",
                        type: "value",
                        description: "z value of the vector"
                    }
                ],  
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Returns the n'th coordinate (x=0, y=1, z=2).",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "position of coordinate"
                            }
                        ]
                    },
                    {
                        name: "getX",
                        type: "value",
                        description: "Returns the x coordinate"
                    },
                    {
                        name: "getY",
                        type: "value",
                        description: "Returns the y coordinate"
                    },
                    {
                        name: "getZ",
                        type: "value",
                        description: "Returns the z coordinate"
                    },
                    {
                        name: "X",
                        type: "value",
                        description: "Returns the cross product between two vectors.",
                        example: "Vector(0,1,0).X(Vector(1,0,0))",
                        parameters: <Parameter[]> [
                            {
                                name: "v",
                                type: "value",
                                description: "position of coordinate"
                            }
                        ]
                    }                    
                ],
                snippet: '(${1:x},${2:y},${3:z})'
            },
            {
                type: SymbolType.Function,
                name: "Matrix",
                description: "Creates an identity matrix",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Gets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    },
                    {
                        name: "set",
                        type: "value",
                        description: "Sets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    }
                ],
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "RotationMatrix",
                description: "Creates a rotation matrix where aX, aY and aZ are the angles rotated around the x, y and z axis. The angles are given in radians",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "aX",
                        type: "value",
                        description: "Angle around x axis in radian"
                    },
                    {
                        name: "aY",
                        type: "value",
                        description: "Angle around y axis in radian"
                    },
                    {
                        name: "aZ",
                        type: "value",
                        description: "Angle around z axis in radian"
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Gets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    },
                    {
                        name: "set",
                        type: "value",
                        description: "Sets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    }
                ],
                snippet: '(${1:aX},${2:aY},${3:aZ})'
            },
            {
                type: SymbolType.Function,
                name: "ScaleMatrix",
                description: "Creates a scale matrix where the x coordinate is scaled by sX, the y-coordinate by sY and the z-coordinate by sZ.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "sX",
                        type: "value",
                        description: "Value to scale the x axis"
                    },
                    {
                        name: "sY",
                        type: "value",
                        description: "Value to scale the y axis"
                    },
                    {
                        name: "sZ",
                        type: "value",
                        description: "Value to scale the z axis"
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Gets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    },
                    {
                        name: "set",
                        type: "value",
                        description: "Sets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    }
                ],
                snippet: '(${1:sX},${2:sY},${3:sZ})'
            },
            {
                type: SymbolType.Function,
                name: "MoveMatrix",
                description: "Creates a move matrix that moves mX along the x-axis, mY along the y-axis and mZ along the z-axis.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "mX",
                        type: "value",
                        description: "Value to move the x axis"
                    },
                    {
                        name: "mY",
                        type: "value",
                        description: "Value to move the y axis"
                    },
                    {
                        name: "mZ",
                        type: "value",
                        description: "Value to move the z axis"
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Gets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    },
                    {
                        name: "set",
                        type: "value",
                        description: "Sets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    }
                ],
                snippet: '(${1:mX},${2:mY},${3:mZ})'
            },
            {
                type: SymbolType.Function,
                name: "PerspectiveMatrix",
                description: "Creates a perspective projection where the eye-point is placed in (0,0,0) and coordinates are projected on the XY-plane where z=zProj.",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "zProj",
                        type: "value",
                        description: "Value where the xy plane is projected on z"
                    }
                ],
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "value",
                        description: "Gets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    },
                    {
                        name: "set",
                        type: "value",
                        description: "Sets the value at n,m.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Matrix position n"
                            },
                            {
                                name: "m",
                                type: "value",
                                description: "Matrix position m"
                            }
                        ] 
                    }
                ],
                snippet: '(${1:ZProj})'
            },
            {
                type: SymbolType.Function,
                name: "createFile",
                description: "Create/overwrite a file on the disk. IMPORTANT: For security reasons, you have to enable this feature in the settings tab explicitely",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "file",
                        type: "string",
                        description: "Path to the filename"
                    }
                ],  
                methods: <Method[]> [
                    {
                        name: "writeln",
                        type: "string",
                        description: "Writes a text (if given) to the file and a line shift",
                        parameters: <Parameter[]> [
                            {
                                name: "text",
                                type: "string",
                                description: "The text t be written to the file",
                                optional: true
                            }
                        ]
                    }                    
                ],
                snippet: '(${1:file})'
            },
            {
                type: SymbolType.Function,
                name: "List",
                description: "Lists are used to hold a list of other values",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "x",
                        type: "value",
                        description: "Number of elements the List should contain",
                        optional: true
                    }
                ],  
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "string",
                        description: "Gets the n’th element (first element starts at zero).",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Element index (starts with zero)"
                            }
                        ]
                    },
                    {
                        name: "set",
                        type: "string",
                        description: "Sets the n’th element (first element starts at zero).",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Element index (starts with zero)"
                            },
                            {
                                name: "value",
                                type: "string",
                                description: "Value to store (Numbers, Strings, Booleans)"
                            }
                        ]
                    },
                    {
                        name: "add",
                        type: "string",
                        description: "Add elements to the end of the list.",
                        parameters: <Parameter[]> [
                            {
                                name: "value",
                                type: "string",
                                description: "Value(s) to add (any type). Add multiple values comma separated."
                            }
                        ]
                    },
                    {
                        name: "addAll",
                        type: "string",
                        description: "Add all elements from another list.",
                        parameters: <Parameter[]> [
                            {
                                name: "list",
                                type: "label",
                                description: "List label to add"
                            }
                        ]
                    },
                    {
                        name: "size",
                        type: "value",
                        description: "Returns the size of the list"
                    },
                    {
                        name: "remove",
                        type: "value",
                        description: "Removes the n’th element.",
                        parameters: <Parameter[]> [
                            {
                                name: "n",
                                type: "value",
                                description: "Element index"
                            }
                        ]
                    },
                    {
                        name: "shuffle",
                        type: "value",
                        description: "Puts the elements of the list in random order."
                    },
                    {
                        name: "reverse",
                        type: "value",
                        description: "Puts the elements of the list in reverse order."
                    },
                    {
                        name: "sort",
                        type: "value",
                        description: "Sorts the elements of the list (only numeric values are supported)."
                    },
                    {
                        name: "lock",
                        type: "value",
                        description: "Locks the list from being changed"
                    }         
                ],
                snippet: '($1)'
            },
            {
                type: SymbolType.Function,
                name: "Hashtable",
                description: "Hashtables are tables that map keys to value",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Class,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                methods: <Method[]> [
                    {
                        name: "get",
                        type: "string",
                        description: "Returns the value mapped to 'key'. A null value is returned if no value has been mapped to the key.",
                        parameters: <Parameter[]> [
                            {
                                name: "key",
                                type: "string",
                                description: "Name of the key"
                            }
                        ]
                    },
                    {
                        name: "put",
                        type: "string",
                        description: "Maps 'key' to 'value'. If the key is previously mapped to a value, the previous mapping is lost. The table itself is returned. Add multiple key/value pairs comma separated.",
                        parameters: <Parameter[]> [
                            {
                                name: "key",
                                type: "string",
                                description: "Name of the key"
                            },
                            {
                                name: "value",
                                type: "string",
                                description: "Value to store (Numbers, Strings, Booleans)"
                            }
                        ]
                    },
                    {
                        name: "keys",
                        type: "string",
                        description: "Returns a list value of all the keys in the table."
                    },
                    {
                        name: "containsKey",
                        type: "string",
                        description: "Returns true if the key is defined in the table, otherwise false.",
                        parameters: <Parameter[]> [
                            {
                                name: "key",
                                type: "string",
                                description: "Name of the key"
                            }
                        ]
                    },
                    {
                        name: "remove",
                        type: "string",
                        description: "Removes the key and its value from the table.",
                        parameters: <Parameter[]> [
                            {
                                name: "key",
                                type: "string",
                                description: "Name of the key"
                            }
                        ]
                    }        
                ],
                snippet: '()'
            },
            {
                type: SymbolType.Function,
                name: "CmdArgument",
                description: "Constructs a new command argument",
                value: 1,
                originalValue: "",
                completionKind: CompletionItemKind.Function,
                scope: 0,
                isExternal: false,
                isGlobal: true,
                isMain: false,
                isBuiltin: true,
                parameters: <Parameter[]> [
                    {
                        name: "type",
                        type: "label",
                        description: "Mnemonic argument type"
                    },
                    {
                        name: "value",
                        type: "value",
                        description: "Argument value"
                    }        
                ],
                snippet: '(${1:type},${2:value})'
            },{
                type: SymbolType.Constant,
                name: "AT_ABSOLUTE",
                value: 1,
                originalValue: "",
                description: "Example: $1000"
            },{
                type: SymbolType.Constant,
                name: "AT_ABSOLUTEX",
                value: 1,
                originalValue: "",
                description: "Example: $1000,x"
            },{
                type: SymbolType.Constant,
                name: "AT_ABSOLUTEY",
                value: 1,
                originalValue: "",
                description: "Example: $1000,y"
            },{
                type: SymbolType.Constant,
                name: "AT_IMMEDIATE",
                value: 1,
                originalValue: "Immediate adressing",
                description: "#10"
            },{
                type: SymbolType.Constant,
                name: "AT_INDIRECT",
                value: 1,
                originalValue: "",
                description: "Indirect adressing mode",
                comments: "Example: ($1000)"
            },{
                type: SymbolType.Constant,
                name: "AT_IZEROPAGEX",
                value: 1,
                originalValue: "",
                description: "Indirect zeropage x adressing",
                comments: "Example: ($10,x)"
            },{
                type: SymbolType.Constant,
                name: "AT_IZEROPAGEY",
                value: 1,
                originalValue: "",
                description: "Indirect zeropage y adressing",
                comments: "Example: ($10),y"
            },{
                type: SymbolType.Constant,
                name: "AT_NONE",
                value: 1,
                originalValue: "",
                description: "No adressing",
                comments: "Example: NOP"
            }
        ];
    }
}

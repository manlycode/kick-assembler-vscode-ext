# Kick Assembler Visual Studio Code Extension

## v0.1.16
### Changed
+ add new default options C64Debugger (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/3) - Lubber
+ new output directory option when compiling
+ added support for .var directive
+ hover cleaned up for some symbols like .const, .var and .label
+ show correct directive for label symbols (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/6) - Lubber
+ recognize high/low literals (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/7) - Lubber
+ add support for single line comments and and correct remark overlapping (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/9) - Lubber
+ add option to determine when to assemble (onChange or onSave) (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/12) - Lubber
+ add badge info to readme (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/10) - Lubber
+ support for -debugdump on compile (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/13) - Lubber
+ added better support for built-in Constants, Macros and Functions (Hover and Completion)
+ support for pre-processor boolean variables - Lubber
+ support for high/low triggers - Lubber
+ dont provide intructions, but only symbols/macros/etc when a directive was the previous token - Lubber
+ recognize and deny completion inside line comments or string definitions - Lubber
+ fix function/macro parameter hover (last param missed comma separation) - Lubber
### Fixed
+ thanks to Lubber for some general cleanup of code
+ make sure that symbols are updated on outline and in completion (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/13) - Lubber
+ fix undefined errors on hover (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/5) - Lubber
+ fix comments on functions (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/8) - Lubber
+ removed lorem ipsum from opcode hover (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/11) - Lubber

## v0.1.15
### Changed
+ mistaken package update with version change (no actual changes)

## v0.1.14
### Changed
* added hover for macros and functions with comments
* some coverage for parameters on hover
* better symbol coverage
### Fixed
* command pallette entries missing (thanks Wanja Gayk for finding this)

## v0.1.13
### Changed
* added command to run last build (ctrl+f5)
* added command to debug last build (ctrl+f6)
### Fixed
* validate settings on server
* fixed output stealing focus on compile
* better settings validation
* better remark searching

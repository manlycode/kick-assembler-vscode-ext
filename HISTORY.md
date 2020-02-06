
## Visual Studio Code Extension for Kick Assembler 

## v0.3.3
### Changed
+ implemented definition provider for "goto definition" and "ctrl+click" jump
+ [added support for -libdir command](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/37)
### Fixed
+ [Issue 33](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/33) switching tabs on opened files breaks everything
+ [Issue 30](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/30) space in paths on emulator and debugger could cause problems on mac/linux

## v0.3.2
### Fixed
+ small bug in the version checker that was added in 0.3.1

## v0.3.1
### Changed
+ debugger uses `-symbols` not `-vicesymbols`
+ named labels `label:` where being suggested for preprocessors
+ kick assembler version checking
+ support additional library paths
### Fixed
+ optional vice symbols
+ fixed emulator option not being used
+ removed `-a` parameter for emulator
+ fix backslashes in strings breaking completion
+ prevent word suggestion on empty file lists

## v0.3.0
### Changed
+ added support for 65c02, DTV and Illegal opcodes
+ optional parameter completion hints
+ better output setting support for relative and fixed paths
+ [Issue 27](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/27) completion for filenames when using `.import` or `#import`
+ [Issue 17](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/17) support for .eval var

### Fixed
+ [Issue 26](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/26) code completion for macros and functions was broken
+ [Issue 29](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/29) supress intellisense and code completion inside remarks/comments
+ [Issue 32](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/32) building when focused on output window produced errors
+ [Issue 34](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/34) empty output file setting would cause issues

## v0.2.7
### Changed
+ added new version info to the asminfo file for future use
+ better overall formatting for hovers
### Fixed
+ issue #24 -- symbols with same name only showing the first type registered (hover refactoring)
+ fix preprocessor completion items not showing because of name mismatch

## v0.2.6
### Changed
+ some small changes to the code snippets for whitepace and value completion for .var and .label directives
+ changes to the README to help developers interested in the extension to see all of the new features that have been added
### Fixed
+ fix code snippets to include completion items -- not that this also requires that the editor setting "editor.suggest.snippetsPreventQuickSuggestions" is set to FALSE

## v0.2.5
### Changed
+ code snippets and new directive support (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/27) - Lubber
+ snippets for functions and macros (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/28) - Lubber
+ change icons for labels to match in the outline view
### Fixed
+ named labels hover fixed (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/29) - Lubber

## v0.2.4
### Fixed
+ fixed issue #22 where files could not be read on macos and linux (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/22)

## v0.2.3
### Fixed
+ remove extra hover lines (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/26) - Lubber

## v0.2.2
### Changed
+ detect inline comment as remark and handle original value (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/23) - Lubber
+ support code folding (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/25) - Lubber
+ add missing built-in functions (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/24) - Lubber
### Fixed
+ fix path issue on mac/linux on builds (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/2)

## v0.2.1
### Fixed
+ missing semver dependency on new language server libraries

## v0.2.0
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
+ show docs, examples and comments for completion items (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/19)- Lubber
+ correctly fetch base symbol with methods added (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/22) - Lubber
+ hovers show which file symbols were imported from
### Fixed
+ thanks to Lubber for some general cleanup of code
+ make sure that symbols are updated on outline and in completion (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/13) - Lubber
+ fix undefined errors on hover (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/5) - Lubber
+ fix comments on functions (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/8) - Lubber
+ removed lorem ipsum from opcode hover (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/11) - Lubber
+ upgraded language server (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/20) - Lubber
+ hover over zero values was broken (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/21) - Lubber

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

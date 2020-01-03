# Kick Assembler Visual Studio Code Extension

## v0.1.16
### Changed
+ thanks Lubber for adding new default options C64Debugger (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/merge_requests/3)
+ new output directory option when compiling
+ added support for .var directive
+ hover cleaned up for some symbols like .const, .var and .label
### Fixed
+ thanks to Luibber for some general cleanup of code
+ make sure that symbols are updated on outline and in completion (https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/issues/13)

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

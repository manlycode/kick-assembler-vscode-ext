# kick-assembler-vscode-ext
A [Kick Assembler](http://www.theweb.dk/KickAssembler/Main.html#frontpage) extension for [VSCode](https://code.visualstudio.com/).

**This extension is a work in progress and many features are not completed, and some might even be broken.**

Features:
* build, run and debug commands
* support for VICE and C64Debugger


## Features
The following features are currently working relatively well.

### Basic Syntax Highlighting
![Syntax Highlighting](/images/ka-syntax-highlighting.png)

### Error Checking
![Error Checking](/images/ka-error-checking.png)

### Hover Support
Hover support for Macro comments and definition.

![Macro Comment Hover](/images/ka-hover1.png)

Hover support for literals.

![Macro Comment Hover](/images/ka-hover2.png)


## TODO
See [the Roadmap](ROADMAP.md)

## Release Notes
See [the Release Notes](RELEASE.md)

## Acknowledgements
Thanks to [SWOFFA](https://csdb.dk/scener/?id=984) for his work on the tmLanguage file for syntax highlighting from his [Sublime Package](https://github.com/Swoffa/SublimeKickAssemblerC64).

I would also like to recognize [Thomas Conté]() for his work on the original [vscode-kickassembler](https://github.com/tomconte/vscode-kickassembler) extension for VSCode that inspired me to start this project.

### Known Issues
It might randomly stop working. You have been warned.

### Contributing
Bug reports, fixes, and other changes are welcomed. The [repository](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext) is on [GitLab](https://gitlab.com), and issues and pull requests are accepted. Check the [contribute](CONTRIBUTE.md) file on information of what the project needs, and how to run the extension locally for development and testing

### Requirements
* [Java Runtime](https://java.com/en/download/)
* [Kick Assembler](http://www.theweb.dk/KickAssembler/Main.html#frontpage)
* [VICE](http://vice-emu.sourceforge.net/index.html#download)
* [C64Debugger](https://sourceforge.net/projects/c64-debugger/files/latest/download)
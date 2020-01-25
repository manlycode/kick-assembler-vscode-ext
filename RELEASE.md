# Release Notes

## v0.2.7

This release addresses the issues some folks have been having with the new setting "kickassembler.outputDirectory", which was intended to control where compiled artifacts are put on the filesystem. We also looked at a problem related to symbols with same name only showing the first type registered in the code. So, if you had a `.macro` and a `.const` both name the same, if the `.macro` was declared first, that is what would be shown on a hover for the `.const`, etc.

There were a number of issues related to compiling, and the subsequent running of an Emulator or the C64Debugger because of some issues with how the final PRG file was named. These problewms have been addressed, and it should be a little smarter now when it is building the final path for your compiled program. Here are scenarios that the extension tries to handle with respect to this setting. The scenarios work the same on all filesystems (we hope).

"""
Example 1:

With an Output setting of 

    "" (blank) 

and a source filename of 

    /home/user/workspace/coolgame.asm

this method will return

    /home/user/workspace/coolgame.prg


Example 2:

with an output of 

    "output" or "./output"

and a source filename of

    /home/user/workspace/coolgame.asm

this method will return


    /home/user/workspace/output/coolgame.prg


Example 3:

with an output of

    "/home/user/build"

and a source filename of 

    /home/user/workspace/coolgame.asm

this method will return

    /home/user/build/coolgame.asm
"""
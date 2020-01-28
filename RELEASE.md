# Release Notes

## v0.3.0

This is a big release that is adding a lot of functionality to make your coding experience with the extension more complete. I feel that were are getting very close to a final release soon.

In this release Lubber did some amazing work adding in support for Illegal, 65c02 and DTV opcodes. Of course, this also means that he added support for the `.cpu` directive as well.

![](/images/cpu-directive.gif)

Support for these opcodes are controlled using three new settings.

![](/images/cpu-directive-settings.png)

Whenever you build your program now, a short informational window will popup letting you know when it has started, and then when it has completed. The completion message also gives you an estimate of the time it took to compile.

![](/images/build-message.gif)

Also added in this release is code completion for the `.import` directive and `#import` pre-processor command. This is a VERY welcome addition to make it easier to add all of those code and macro libraries with much less typing.

![](/images/fileimport.gif)

The types of files that will show for the directives is controlled by a number of new settings.

![](/images/import-file-types.png)

An update to the hints for parameters has also been added to help you when you are using any macros, functions or internal functions now.

![](/images/parameterhints.gif)

As always, there was also some code cleanup made as well.

Again, a big thank you to @Lubber for all of his help and support for this extension. Without his hard work many of these new awesome features would not be available.

And a big thank you to everyone using the extension. Your feedback and bug reports are making this tool better.

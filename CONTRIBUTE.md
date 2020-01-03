### Building A Release
```
> vsce publish patch --baseContentUrl https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/blob/master --baseImagesUrl https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/raw/master
```

### Building A Local Copy
```
> vsce package --baseContentUrl https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/blob/master --baseImagesUrl https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext/raw/master
```

### Develop and Test locally
#### Prerequisities
- Fork https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext
- Clone your fork locally
```
> git clone https://gitlab.com/<yourgitlabuser>/<yourfork>.git
```
- Install npm modules
```
> cd <yourfork>
> npm install
```

#### Develop locally and test immediatly
- Open the fork folder in VSCode itself
- select `compile` from the NPM Scripts section of the files Tab
- Change to the Debug-Tab and Start "Client+Server"
Another VSCode Window will open which uses your just compiled local fork extension
 


/*
    Class: ProjectFile

        Represents one File in the Project

    Remarks:

        A Project can consist of one large
        source file, or many source files
        using the #import directives.

        Kick Assembler will combine the
        files and summarize them at the
        end of the compile process.

        Each of those files and their source
        will be put into its own project
        file that can be used.
*/

import Uri from "vscode-uri";
import StringUtils from "../utils/StringUtils";
import { Line, Scope, Comment } from "./Project";
import { AssemblerSyntax } from "../assembler/AssemblerInfo";

export class ProjectFile {

    //  the uri of the document
    private uri: Uri;

    //  the text of the document
    private text: string;

    //  lines of text
    private lines:Line[];
    private comments: Comment[];

    //  is the main project file
    private main:boolean;

    private scopes: Scope[];

    public constructor(uri: Uri, text: string, main: boolean, nextScope: number, assemblerSyntax:AssemblerSyntax[]) {
        this.uri = uri
        this.text = text;
        this.comments = this.fetchComments(assemblerSyntax);
        this.lines = this.createLines(nextScope);
        this.main = main;
    }

    //  returns the source code as one large string
    public getSource(): string | undefined {
        return this.text;
    }

    //  returns the source code as an array of strings(rows)
    public getSourceLines(): string[] | undefined {
        return StringUtils.splitIntoLines(this.text);    
    }

    public getLines(): Line[]|undefined {
        return this.lines;
    }

    public isMain(): boolean {
        return this.main;
    }

    public getUri(): string {
        return this.uri.toString();
    }

    public getScopes(): Scope[] {
        return this.scopes;
    }

    private fetchComments(assemblerSyntax:AssemblerSyntax[]):Comment[] {
        var comments:Comment[] = [];
        for (var syntax of assemblerSyntax) {
            if(syntax.type === 'comment') {
                comments.push({range:syntax.range});
            }
        }
        return comments;
    }

    private createLines(next:number):Line[] {

        let lines = [];
        let sourceLines = this.getSourceLines();
        let cleanedSourceLines = this.removeComments(this.getSourceLines());
        let last = [];
        let scope = 0;
        let lastPossibleScopeName = {
            name:'',
            line:0 
        };

        var possibleLabel;

        for (var i = 0; i < cleanedSourceLines.length; i++) {

            let line = <Line>{};

            line.scope = scope;
            line.text = sourceLines[i];

            let sourceLine = cleanedSourceLines[i].trim();
            if(sourceLine.substr(0,10).toLowerCase() === '.namespace'){
                possibleLabel=sourceLine.substr(10).match(/\w*/);
            } else {
                possibleLabel=sourceLine.match(/^\w*:/);
            }
            if(possibleLabel){
                lastPossibleScopeName = {
                    name:possibleLabel[0],
                    line: i
                }
            }
            
            let openingBrace = sourceLine.indexOf("{");
            let closingBrace = sourceLine.indexOf("}");
//make sure to support a closing abd opening in brace in the same line
            if (closingBrace >= 0 && closingBrace < openingBrace) {
                scope = last.pop();
            }
            //	search for {  - add to scope
            if (openingBrace >= 0) {
                last.push(scope);
                scope = next++;
                this.scopes.push({
                    id: scope,
                    name: lastPossibleScopeName.name,
                    line: lastPossibleScopeName.line
                });
                lastPossibleScopeName = {
                    name:'',
                    line: 0
                };
            }
            
            //	search for } - remove from scope
            if (closingBrace >= 0 && closingBrace > openingBrace) {
                scope = last.pop();
            }
            lines.push(line);
        }
        return lines;
    }

    private removeComments(sourceLines: string[]):string[] {
        this.comments.forEach(comment => {
            for(var i=comment.range.startLine;i<=comment.range.endLine;i++) {
                if(comment.range.startLine ==  comment.range.endLine) {
                    // dont trim but replace with spaces to support a possible a block comment in one line only and still has code at the end and keep symbol range positioning
                    sourceLines[i] = sourceLines[i].substr(0,comment.range.startPosition)+(' '.repeat(comment.range.endPosition-comment.range.startPosition+1))+sourceLines[i].substr(comment.range.endPosition);
                } else {
                  if (i == comment.range.startLine) {
                    sourceLines[i] = sourceLines[i].substr(0,comment.range.startPosition);
                  }
                  if (i == comment.range.endLine) {
                    sourceLines[i] = sourceLines[i].substr(comment.range.endPosition);
                  } else {
                    sourceLines[i] = "";  
                  }
                }
            }
        });
        return sourceLines;
    }
}
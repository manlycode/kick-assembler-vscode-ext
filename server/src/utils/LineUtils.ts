import {
	Position,
	Range,
} from "vscode-languageserver";
import StringUtils from "./StringUtils";
import { Line } from "../project/Project";

interface TokenPosition {
	start: number;
	end: number;
	length: number;
}

export default class LineUtils {

	/**
	 * Given a Starting Line Number Read Backwards looking for Remarks
	 *
	 * @param lines
	 */
	public static getRemarksAboveLine(lines:Line[], lineNumber:number):string|undefined {

		var found = false;
		var remark = undefined;
		var beg = -1;
		var end = -1;

		if (lineNumber <= 0) return remark;

		var _line = lines[lineNumber].text.trim(); 
		var possibleLineComment = _line.indexOf('//');

		if (possibleLineComment > 0) {
			return _line.substr(possibleLineComment + 2);
		}
		while (!found) {

			lineNumber -= 1;
			if (lineNumber < 1)
				break;

			if(!lines[lineNumber].text)
				continue;

			_line = lines[lineNumber].text.trim();
			// stop when another one-line declaration is found 
			if(_line[0] == '.') {
				break;
			}

			possibleLineComment = _line.indexOf('//');
			// ignore pure line comments , those are supposed to be possible comments now 
			if (possibleLineComment > 0) {
				_line = _line.substr(0,possibleLineComment);
			}
			// last character on line is }
			if (_line[_line.length - 1] == "}")
				break;

			if (_line.substr(0,2) == "//") {
				//detect a possible outcomment of the same symbol delaration
				if(_line.substr(2).trim()[0] !== '.') {
					beg = lineNumber - 1;
					end = lineNumber + 1;
					found = true;
				}
			}

			if (end < 0) {
				var e = lines[lineNumber].text.indexOf("*/");
				if (e >= 0)
					end = lineNumber;
			}

			if (beg < 0) {
				var b = lines[lineNumber].text.indexOf("/**");
				if (b >= 0)
					beg = lineNumber;
			}

			if (beg > 0 && end > 0)
				found = true;
		}

		if (found) {
			remark = "";
			var remarkLine;
			for (var i = beg + 1; i < end; i++) {
				if(lines[i].text) {
					remarkLine = this.removeComments( lines[i].text).trim();
					if (remarkLine[0] == '*') {
						remarkLine = remarkLine.substr(1).trim();
					}
					if (remarkLine.substr(0,2) == '//') {
						remarkLine = remarkLine.substr(2).trim();
					}
					remark += remarkLine;
				}
				remark += "\r";
			}
		}

		return remark;
	}

	public static getTokenAtSourcePosition2(sourceLines: string[] | undefined, line: number, column: number): string | undefined{
		if (sourceLines && sourceLines.length > line) {
			// Find the char and the surrounding symbol it relates to
			const sourceLine = LineUtils.removeComments(sourceLines[line]);
			return LineUtils.getTokenAtLinePosition(sourceLine, column);
		}
		return undefined;
	}

	public static getTokenAtLinePosition2(sourceLine: string | undefined, column: number): string | undefined{

		const tokens = StringUtils.splitIntoTokens(sourceLine.replace(/[=-+]/," $& "));

		var tL = tokens.length;
		if (tL === 0) return undefined;

		if (tL === 1) return tokens[0];

		for (var i = 0; i < tL; i++) {
			var pos = sourceLine.indexOf(tokens[i]);
			if (pos > column) return tokens[i - 1];
		}

		return tokens[tL - 1];
	}

	/**
	 * Given a list of lines, returns what is the assumed symbol/label/value at a specific position
	 */
	public static getTokenAtSourcePosition(sourceLines: string[] | undefined, line: number, column: number): string | undefined {
		if (sourceLines && sourceLines.length > line) {
			// Find the char and the surrounding symbol it relates to
			const sourceLine = LineUtils.removeComments(sourceLines[line]);
			return LineUtils.getTokenAtLinePosition(sourceLine, column);
		}

		return undefined;
	}

	/**
	 * Given a line, returns what is the assumed symbol/label/value at a specific position
	 */
	public static getTokenAtLinePosition(sourceLine: string | undefined, column: number): string | undefined {
		if (sourceLine && column <= sourceLine.length) {
			let targetRegex = new RegExp("^.{0," + Math.max(column, 0) + "}\\b([\\w.]*)\\b.*$");
			let targetMatch = sourceLine.match(targetRegex);
			if (!targetMatch || !targetMatch[1]) {
				// Fallback: this regex is more lenient, so we can have rename working from the end of the string...
				// but it may give false positives
				targetRegex = new RegExp("^.{0," + Math.max(column - 1, 0) + "}\\b([\\w.]*)\\b.*$");
				targetMatch = sourceLine.match(targetRegex);
			}
console.log(targetMatch);
			if (targetMatch && targetMatch[1]) {
				return targetMatch[1].split(".")[0];
			}
		}

		return undefined;
	}

	/**
	 * Given a line and a token, returns the location in that line (start and end) that the token is in
	 * A `character` parameter can be used when the token needs to be in that position
	 */
	public static getTokenPosition(line: string, token: string, character: number = -1): TokenPosition | undefined {
		const len = token.length;
		let pos = line.indexOf(token);
		while (pos > -1) {
			if (character < 0 || (pos <= character && pos + len >= character)) {
				return { start: pos, end: pos + len, length: len };
			}
			pos = line.indexOf(token, pos + len);
		}
		return undefined;
	}

	/**
	 * Given a line and a token, returns all the location in that line (start and end) that the token is in
	 */
	public static getTokenPositions(line: string, token: string): TokenPosition[] {
		const len = token.length;
		let pos = line.indexOf(token);
		const positions = [];
		while (pos > -1) {
			positions.push({ start: pos, end: pos + len, length: len });
			pos = line.indexOf(token, pos + len);
		}
		return positions;
	}

	/**
	 * Same as getTokenPosition(), but returning a range of a specific line
	 */
	public static getTokenRange(line: string, token: string, lineNumber: number, character: number = -1): Range | undefined {
		const pos = LineUtils.getTokenPosition(line, token, character);
		if (pos) {
			return Range.create(Position.create(lineNumber, pos.start), Position.create(lineNumber, pos.end));
		}
		return undefined;
	}

	/**
	 * Returns a line without comments
	 */
	public static removeComments(line: string): string | undefined {
		const removeCommentsRegex = /^(.+?)(\/\/.+|)$/;
		const sourceLineNoCommentsMatch = line.match(removeCommentsRegex);
		if (sourceLineNoCommentsMatch && sourceLineNoCommentsMatch[1]) {
			return sourceLineNoCommentsMatch[1];
		}
		return undefined;
	}
}

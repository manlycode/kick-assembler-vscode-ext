import { stringify } from "querystring";

export default class StringUtils {

	public static splitIntoTokens(text:string):string[] {
		return text.match(/\S+/g);
	}

	public static splitIntoLines(text:string):string[] {
		return text.split(/\r?\n/g);
    }

	public static splitFunction(text:string):string[]|undefined {

		let vals:string[] = [];
		var pos;
		var parm_text;

		//	remove code after comments
		pos = text.indexOf("//");
		if (pos > 0) {
			text = text.substring(0, pos);
		}

		//	remove code after open paren "{"
		pos = text.indexOf("{");
		if (pos > 0) {
			text = text.substring(0, pos);
		}

		//	get parameters
		pos = text.indexOf("(");
		if (pos > 0) {
			parm_text = text.substring(pos);
			text = text.substring(0, pos);
		}

		//	remove parenthesis
		parm_text = parm_text.replace("(", " ");
		parm_text = parm_text.replace(")", " ");
		parm_text = parm_text.trim();

		//	split by blanks to get type and name of function
		let v1 = text.split(" ");
		v1 = this.removeEmptyArray(v1);
		vals.push(v1[0].trim());
		vals.push(v1[1].trim());
		
		//	split parms by comma

		if (parm_text) {
			let parms = parm_text.split(",");
			for (var parm of parms) {
				vals.push(parm);
			}
		}

		return vals;
	}

	public static splitPseudoCommand(text:string):string[]|undefined {

		let vals:string[] = [];
		var _work:string = text;

		//	remove code portion after {
		if (_work.indexOf("{") > 0 ) {
			_work = _work.substr(0,_work.indexOf("{"));
		}


		//	split by blanks to get function name and parms
		let _array = _work.split(" ");

		//	remove any blank values
		_array = this.removeEmptyArray(_array);

		//	first value is name
		vals.push(_array[1].trim());

		for (var i = 2; i < _array.length; i++) {
			var _next = _array[i];
			_next = _next.replace(":", "");
			_next = _next.replace(" ", "");
			if (_next.length > 0) {
				vals.push(_next);
			}
		}
		
		return vals;
	}

	public static joinStringArray(text:string[]):string {
		var ret = "";
		for (var i = 0; i < text.length; i++) {
			ret += text[i] + "\n";
		}
		return ret;
	}

	public static removeCRLF(text:string):string {
		return text.replace(/(\r\n|\n|\r)/gm,"");
	}

	public static removeEmptyArray(values:string[]):string[] {
		var _values:string[] = [];

		for(var i = 0; i < values.length; i++) {
			if (values[i].length > 0) {
				_values.push(values[i]);
			}
		}

		return _values;
	}

	/**
	 * Returns a Word at a given position in a line.
	 * 
	 * @param text 
	 * @param position 
	 */
	public static GetWordAt(text:string, position:number):string {
		// make pos point to a character of the word
		while (text[position] == " ") position--;
		// find the space before that word
		// (add 1 to be at the beginning of that word)
		// (note that it works even if there is no space before that word)
		position = text.lastIndexOf(" ", position) + 1;
		// find the end of the word
		var end = text.indexOf(" ", position);
		if (end == -1) end = text.length; // set to length if it was the last word
		// return the result
		return text.substring(position, end);
	  }

	/**
	 * Returns the Words Before a position on a line.
	 * 
	 * For example:
	 * 
	 * 		var str = The Quick Brown Fox
	 * 
	 * 		var words = GetWordsBefore(str, 11)
	 * 
	 * 		words = ['The', 'Quick']
	 * 
	 * @param text 
	 * @param position 
	 */
	public static GetWordsBefore(text:string, position:number):string[] {

		var index = text.lastIndexOf(" ", position) + 1;

		if (index < 0)
			return;

		var workText = text.substring(0, index);
		var workText = workText.trim();
		var words = workText.split(" ");
		return words;
	}

	/**
	 * Returns the Words After a position on a line.
	 * 
	 * For example:
	 * 
	 * 		var str = The Quick Brown Fox
	 * 
	 * 		var words = GetWordsBefore(str, 5)
	 * 
	 * 		words = ['Brown', 'Fox']
	 * 
	 * @param text 
	 * @param position 
	 */
	public static GetWordsAfter(text:string, position:number):string[] {

		var index = text.indexOf(" ", position);
		
		if (index < 0) 
			return;

		var workText = text.substring(index);
		var workText = workText.trim();
		var words = workText.split(" ");
		return words;
	}

}
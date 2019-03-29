
export default class StringUtils {

	public static splitIntoTokens(text:string):string[] {
		return text.match(/\S+/g);
	}

	public static splitIntoLines(text:string):string[] {
		return text.split(/\r?\n/g);
    }

	public static splitFunction(text:string):string[]|undefined {
		let vals:string[] = [];
		//	remove parenthesis
		text = text.replace("(", " ");
		text = text.replace(")", " ");
		text = text.replace("{", " ");
		text = text.replace("/", " ");
		text = text.trim();

		//	split by blanks to get function name and parms
		let v1 = text.split(" ");
		v1 = this.removeEmptyArray(v1);
		vals.push(v1[0].trim());
		vals.push(v1[1].trim());
		
		//	split parms by comma
		if (v1[2]) {
			let parms = v1[2].split(",");
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

}
export default class NumberUtils {

	public static asDecimal(value:number):string {
		return value.toString(10);
	}

	public static asBinary(value:number):string {
		return "%" + value.toString(2);
	}

	public static asOctal(value:number):string {
		return "0" + value.toString(8);
	}

	public static asHexa(value:number):string {
		return "$" + value.toString(16);
	}

	/**
	 * Takes a String and Tries to convert it
	 * to a Decimal value.
	 * 
	 * @param value the String to Convert
	 */
	public static toDecimal(value:string):number {
		if (value.substr(0, 2) == "#$") {
			var num = parseInt(value.substr(2), 16);
			return num;
		}

		if (value.substr(0, 1) == "$") {
			var num = parseInt(value.substr(1), 16);
			return num;
		}

		if (value.substr(0, 1) == "#") {
			var num = parseInt(value.substr(1), 10);
			return num;
		}

		if (value.substr(0, 1) == "%") {
			var num = parseInt(value.substr(1), 2);
			return num;
		}
	}

}
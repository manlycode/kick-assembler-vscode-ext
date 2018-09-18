
export default class StringUtils {

	public static splitIntoTokens(text:string):string[] {
		return text.match(/\S+/g);
	}

	public static splitIntoLines(text:string):string[] {
		return text.split(/\r?\n/g);
    }
}
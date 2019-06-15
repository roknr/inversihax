/**
 * Defines functionality for a parser of a particular type.
 * @type {T} The type to parse to.
 */
export interface IParser<T> {

    /**
     * Parses the string content to the specified type.
     * @param content The content to parse.
     */
    parse(content: string): T;
}
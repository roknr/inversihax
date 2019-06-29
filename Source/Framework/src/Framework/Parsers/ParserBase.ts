import { injectable } from "inversify";
import { IParser } from "../../Core/Interfaces/Parsers/IParser";

/**
 * The base parser class. Derive from it to create a custom parser.
 *
 * Is injectable.
 */
@injectable()
export abstract class ParserBase<T> implements IParser<T> {

    // tslint:disable-next-line
    public abstract parse(content: string): T;
}
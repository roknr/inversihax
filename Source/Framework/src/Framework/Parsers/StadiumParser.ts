import { IStadiumParser } from "../../Core/Interfaces/Parsers/IStadiumParser";
import { Stadium } from "../../Core/Models/Stadium/Stadium";
import { ParserBase } from "./ParserBase";

/**
 * The default stadium parser. Parses the string contents of an .hbs file to a Stadium model.
 *
 * Is injectable through the ParserBase class.
 */
export class StadiumParser extends ParserBase<Stadium> implements IStadiumParser<Stadium> {
    /**
     * Parses the stadium .hbs file contents into a Stadium model by using custom property names.
     * @param content The string contents of the .hbs file.
     */
    public parse(content: string): Stadium {
        // This is the default stadium parser, deserialize the JSON based on property names on models
        const stadium = JSON.parse(content) as Stadium;
        return stadium;
    }
}
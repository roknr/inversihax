import { IChatMessageParser } from "../../Core/Interfaces/Parsers/IChatMessageParser";
import { ParserBase } from "./ParserBase";

/**
 * The default chat message parser. Parses the message into words.
 *
 * Is injectable through the ParserBase class.
 */
export class ChatMessageParser extends ParserBase<string[]> implements IChatMessageParser {

    /**
     * Parses the chat message from the string content into words by using default parsing logic.
     * @param content The message being sent.
     */
    public parse(content: string): string[] {
        // This is the default chat message parser, no special logic, just split the message by whitespace
        // and ignore any leading and trailing whitespace
        const words = content.match(/\S+/g) || [];
        return words;
    }
}
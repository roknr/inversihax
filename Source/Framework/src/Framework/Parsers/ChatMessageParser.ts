import { IChatMessageParser } from "../../Core/Interfaces/Parsers/IChatMessageParser";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { Player } from "../../Core/Models/Player";
import { ParserBase } from "./ParserBase";

/**
 * The default chat message parser.
 *
 * Is injectable through the ParserBase class.
 */
export class ChatMessageParser extends ParserBase<ChatMessage<Player>> implements IChatMessageParser<ChatMessage<Player>> {

    /**
     * Parses the chat message from the string content by using default parsing logic.
     * @param content The message being sent.
     */
    public parse(content: string): ChatMessage<Player> {
        // This is the default chat message parser, no special logic, just split the message by whitespace
        const words = content.split(RegExp("\\s+"));

        // Create the message from the original and split words and return it
        const message = new ChatMessage<Player>(content, words);
        return message;
    }
}
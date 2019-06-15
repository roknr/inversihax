import { ChatMessage } from "../../Models/ChatMessage";
import { Player } from "../../Models/Player";
import { IParser } from "./IParser";

/**
 * Defines chat message parser functionality.
 * @type {TChatMessage} The type of chat message to parse to.
 */
export interface IChatMessageParser<TChatMessage extends ChatMessage<Player>> extends IParser<TChatMessage> {

}
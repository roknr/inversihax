import { IPlayerObject } from "../../HeadlessAPI/Interfaces/IPlayerObject";
import { ICommand } from "../Interfaces/Commands/ICommand";

/**
 * The chat message that encapsulates the actual message and the player that sent it, alongside other information.
 */
export class ChatMessage {

    //#region Private members

    /**
     * The original message that was sent (set as the message when the object was constructed).
     */
    private mOriginalMessage = null;

    /**
     * The message represented as words.
     */
    private mWords: string[];

    /**
     * The extracted command arguments from the sent message - basically the message as words excluding the first word, which denotes the
     * command name. Undefined if the message does not represent a command invocation.
     */
    private mCommandParameters: string[] = null;

    //#endregion

    //#region Protected members

    /**
     * The message that is being sent.
     */
    protected mMessage: string = null;

    //#endregion

    //#region Public properties

    /**
     * The actual whole message that is being sent. Can be modified.
     */
    public get message(): string {
        return this.mMessage;
    }

    /**
     * The actual whole message that is being sent. Can be modified.
     */
    public set message(value: string) {
        this.mMessage = value;

        // Also, if first time, set the original message as this message
        if (this.mOriginalMessage == null) {
            this.mOriginalMessage = value;
        }
    }

    /**
     * The original message that was sent (set as the message when the object was constructed).
     */
    public get originalMessage(): string {
        return this.mOriginalMessage;
    }

    /**
     * Flag indicating whether the message should be broadcasted forward to everyone in the room. The value will by default be equal to
     * true.
     */
    public broadcastForward: boolean = true;

    /**
     * The player that sent the message.
     */
    public readonly sentBy: IPlayerObject = null;

    /**
     * The player to which to send the message as a personal message. The value will by default be equal to the player that the personal
     * message is meant for, if personal messages have been configured in the RoomHostBuilder, undefined otherwise.
     */
    public sentTo: IPlayerObject = undefined;

    /**
     * The command for this message. Will be set if the room was configured to use commands and the message represents a command invocation,
     * undefined otherwise.
     */
    public command: ICommand = undefined;

    /**
     * Flag indicating whether this message represents a command invocation.
     */
    public get isCommand(): boolean {
        return this.command != null;
    }

    /**
     * The message represented as words. Set on construction - usually supposed to be set by the parser. If not defined,
     * this will be the message split by whitespace characters.
     *
     * In case of it being split by whitespace characters:
     * @example
     * const message: string = "The message    being  sent";
     * const messageAsWords: string[] = [ "The", "message", "being", "sent" ];
     */
    public get words(): string[] {
        return this.mWords;
    }

    /**
     * The extracted command arguments from the sent message - basically the message as words excluding the first word, which denotes the
     * command name. Undefined if the message does not represent a command invocation.
     */
    public get commandParameters(): string[] {
        // If the chat message does not represent a command invocation, return undefined
        if (!this.isCommand) {
            return undefined;
        }

        // If command arguments were already accessed, return them
        if (this.mCommandParameters != null) {
            return this.mCommandParameters;
        }

        // Otherwise get the message as words (slice to make a copy)
        const commandArguments = this.words.slice();

        // Remove the first word which represents the command name by shifting the words array
        commandArguments.shift();

        // The remaining words are command arguments, so set and return them
        this.mCommandParameters = commandArguments;

        return this.mCommandParameters;
    }

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the ChatMessage class.
     * @param sentBy The player that sent the message.
     * @param message The actual message.
     * @param words The message represented as words.
     */
    public constructor(sentBy: IPlayerObject, message: string, words: string[] = null) {
        this.sentBy = sentBy;
        this.message = message;

        // If words have not been set, split the message by whitespace characters by default
        if (!words || words.length === 0) {
            this.mWords = this.message.match(/\S+/g) || [];
        }
        else {
            this.mWords = words;
        }
    }

    //#endregion
}
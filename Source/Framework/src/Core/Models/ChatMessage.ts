import { ICommand } from "../Interfaces/Commands/ICommand";
import { Player } from "./Player";

/**
 * The chat message that encapsulates the actual message and the player that sent it, alongside other information.
 *
 * @type {TPlayer} The type of player sending and receiving the message.
 */
export class ChatMessage<TPlayer extends Player> {

    //#region Private members

    /**
     * The original message that was sent (set as the message when the object was constructed).
     */
    private mOriginalMessage = null;

    //#endregion

    //#region Protected members

    /**
     * The message that is being sent.
     */
    protected mMessage: string = null;

    //#endregion

    //#region Public properties

    /**
     * The player that sent the message.
     */
    public readonly sentBy: TPlayer = null;

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
     * true or the one configured in the RoomHostBuilder.
     */
    public broadcastForward: boolean = true;

    /**
     * The player to which to send the message as a personal message. The value will by default be equal to the player that the personal
     * message is meant for, if personal messages have been configured in the RoomHostBuilder, undefined otherwise.
     */
    public sentTo: TPlayer = undefined;

    /**
     * The command for this message. Will be set if the room was configured to use commands and the message represents a command invocation,
     * undefined otherwise.
     */
    public command: ICommand<TPlayer> = undefined;

    /**
     * Flag indicating whether this message represents a command invocation.
     */
    public get isCommand(): boolean {
        return this.command != null;
    }

    /**
     * The message split by whitespace characters - represented as words.
     * @example
     * const message: string = "The message    being  sent";
     * const messageAsWords: string[] = [ "The", "message", "being", "sent" ];
     */
    public get words(): string[] {
        return this.message.split(RegExp("\\s+"));
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

        // Otherwise get the message as words
        const commandArguments = this.words;

        // Remove the first word which represents the command name by shifting the words array
        commandArguments.shift();

        // The remaining words are command arguments, so return them
        return commandArguments;
    }

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the ChatMessage class.
     * @param sentBy The player that sent the message.
     * @param message The actual message.
     */
    public constructor(sentBy: TPlayer, message: string) {
        this.sentBy = sentBy;
        this.message = message;
    }

    //#endregion
}
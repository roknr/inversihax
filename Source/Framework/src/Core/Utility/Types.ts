import { ICommand } from "../Interfaces/Commands/ICommand";
import { IChatMessageInterceptor } from "../Interfaces/Interceptors/IChatMessageInterceptor";
import { ChatMessage } from "../Models/ChatMessage";
import { Player } from "../Models/Player";

/**
 * The symbols that identify the corresponding objects (classes, interfaces etc.).
 */
export const Types = {
    // Miscellaneous
    Startup: Symbol.for("Startup"),
    IRoom: Symbol.for("IRoom"),
    IRoomConfigObject: Symbol.for("IRoomConfigObject"),
    ICommand: Symbol.for("ICommand"),
    IChatMessageInterceptor: Symbol.for("IChatMessageInterceptor"),
    IBackgroundTask: Symbol.for("IBackgroundTask"),

    // Services
    IEmojiService: Symbol.for("IEmojiService"),
    IPlayerService: Symbol.for("IPlayerService"),
    ICommandService: Symbol.for("ICommandService"),

    // Options
    CommandOptions: Symbol.for("CommandOptions"),
    EmojiOptions: Symbol.for("EmojiOptions"),

    // Factories
    IChatMessageInterceptorFactory: Symbol.for("IChatMessageInterceptorFactory"),
    ICommandFactory: Symbol.for("ICommandFactory"),
};

/**
 * The type shorthand that represents a constructor.
 * @type The type we want to work with.
 */
export type ConstructorType<T> = { new(...args: any[]): T };

//#region Factory types

/**
 * The IChatMessageInterceptor factory type. Instantiates all registered IChatMessage interceptors.
 */
export type IChatMessageInterceptorFactoryType = () => Array<IChatMessageInterceptor<ChatMessage<Player>>>;

/**
 * The ICommand factory type. Instantiates a command based on the specified name.
 */
export type ICommandFactoryType = (commandName: string) => ICommand<Player>;

//#endregion
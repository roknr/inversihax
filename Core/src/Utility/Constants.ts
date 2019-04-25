/**
 * Provides constant values related to the framework.
 */
export class Constants {

    //#region Public properties

    /**
     * The id of the room's host player.
     */
    public static readonly HostPlayerId: number = 0;

    /**
     * The default command prefix.
     */
    public static readonly DefaultCommandPrefix: string = "!";

    //#endregion

    /**
     * Private constructor, so the class cannot be instantiated and can act as a static class.
     */
    private constructor() { }
}

/**
 * The metadata keys. Used internally for accessing metadata through the Reflect API.
 */
export const MetadataKeys = {
    Command: Symbol.for("hax-framework:command"),
};

/**
 * The error message and function constants.
 */
export const Errors = {
    DuplicateCommand: (commandName: string) => `Duplicate command ${commandName}. Commands must not have duplicate names (class names).`,
    DuplicateCommandName: (name: string) => `Duplicate command name ${name}. Command names must be unique.`,
    MissingCommandNames: (commandName: string) => `Missing names for command ${commandName}. A command must have at least one name.`,
    InvalidCommandType: (commandType: string) => `Invalid command type ${commandType}. All commands must inherit from CommandBase class.`,
};
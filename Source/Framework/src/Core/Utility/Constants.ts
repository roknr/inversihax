/**
 * The metadata keys. Used for accessing metadata through the Reflect API.
 */
export const MetadataKeys = {
    Command: Symbol.for("inversihax:command"),
};

/**
 * The error message and function constants.
 */
export const Errors = {
    DuplicateCommand: (commandName: string) => `Duplicate command '${commandName}'. Commands must not have duplicate names (class names).`,
    DuplicateCommandName: (name: string) => `Duplicate command name '${name}'. Command names must be unique.`,
    MissingCommandNames: (commandName: string) => `Missing names for command '${commandName}'. A command must have at least one name.`,
    InvalidCommandType: (commandType: string) => `Invalid command type '${commandType}'. All commands must inherit from CommandBase class.`,
    InvalidCommandPrefix: (prefix: string) => `Invalid command prefix '${prefix}'. Command prefix must be a valid string value.`,
};

/**
 * Constants related to the framework.
 */
export const Constants = {
    /**
     * The id of the player hosting the room.
     */
    HostPlayerId: 0,

    /**
     * The default prefix for commands.
     */
    DefaultCommandPrefix: "!",

    /**
     * The player radius.
     */
    PlayerRadius: 10,
};
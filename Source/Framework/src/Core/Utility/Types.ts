/**
 * The symbols that identify the corresponding objects (classes, interfaces etc.).
 */
export const Types = {
    Startup: Symbol.for("Startup"),
    IRoom: Symbol.for("IRoom"),
    IRoomConfigObject: Symbol.for("IRoomConfigObject"),
    ICommand: Symbol.for("ICommand"),
    IChatMessageInterceptor: Symbol.for("IChatMessageInterceptor"),

    IPlayerManager: Symbol.for("IPlayerManager"),
    ICommandManager: Symbol.for("ICommandManager"),

    CommandOptions: Symbol.for("CommandOptions"),

    Container: Symbol.for("Container"),
};
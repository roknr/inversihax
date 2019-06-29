/**
 * The command options.
 */
export class CommandOptions {

    /**
     * The command prefix.
     */
    public readonly prefix: string;

    /**
     * The mapping that defines which names map to which command.
     */
    public readonly namesToCommands: ReadonlyMap<string, string>;

    /**
     * The flag indicating whether command name checks should be case sensitive or not. False by default.
     */
    public readonly caseSensitive: boolean;

    /**
     * Initializes a new instance of the CommandOptions class.
     * @param prefix The command prefix.
     * @param namesToCommands The mapping that defines which names map to which command.
     * @param caseSensitive The flag indicating whether command name checks should be case sensitive.
     */
    public constructor(prefix: string, namesToCommands: Map<string, string>, caseSensitive: boolean = false) {
        this.prefix = prefix;
        this.namesToCommands = namesToCommands;
        this.caseSensitive = caseSensitive;
    }
}
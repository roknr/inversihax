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
     * Initializes a new instance of the CommandOptions class.
     * @param prefix The command prefix.
     * @param namesToCommands The mapping that defines which names map to which command.
     */
    public constructor(prefix: string, namesToCommands: Map<string, string>) {
        this.prefix = prefix;
        this.namesToCommands = namesToCommands;
    }
}
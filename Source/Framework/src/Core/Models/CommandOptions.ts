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
}
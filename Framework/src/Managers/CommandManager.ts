import { inject, injectable } from "inversify";
import { CommandOptions, ICommandManager, Types } from "types-haxframework-core";

/**
 * The command manager. Provides functionality for dealing with commands.
 *
 * Is injectable.
 */
@injectable()
export class CommandManager implements ICommandManager {

    /**
     * The room's command options.
     */
    public readonly options: CommandOptions;

    /**
     * Initializes a new instance of the ICommandManager class.
     * @param options The command options.
     */
    public constructor(
        @inject(Types.CommandOptions) options: CommandOptions,
    ) {
        this.options = options;
    }
}
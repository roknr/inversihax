import { CommandOptions } from "../../Models/CommandOptions";

/**
 * The command manager. Provides functionality for dealing with commands.
 */
export interface ICommandManager {

    /**
     * The room's command options.
     */
    options: CommandOptions;
}
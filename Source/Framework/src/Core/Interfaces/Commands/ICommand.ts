import { IPlayerObject } from "../../../HeadlessAPI/Interfaces/IPlayerObject";

/**
 * Defines a command.
 */
export interface ICommand {

    /**
     * Returns a value indicating whether the specified player is allowed to invoke the command.
     * @param player The player trying to invoke the command.
     */
    canExecute(player: IPlayerObject): boolean;

    /**
     * Executes the command by the specified player with the specified arguments.
     * @param player The player executing the command.
     * @param args The arguments to the command.
     */
    execute(player: IPlayerObject, args: string[]): void;
}
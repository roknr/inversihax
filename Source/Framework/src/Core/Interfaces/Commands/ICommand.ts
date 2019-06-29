import { Player } from "../../Models/Player";

/**
 * Defines a command.
 * @type {TPlayer} The type of player to use with the command.
 */
export interface ICommand<TPlayer extends Player> {

    /**
     * Returns a value indicating whether the specified player is allowed to invoke the command.
     * @param player The player trying to invoke the command.
     */
    canExecute(player: TPlayer): boolean;

    /**
     * Executes the command by the specified player with the specified arguments.
     * @param player The player executing the command.
     * @param args The arguments to the command.
     */
    execute(player: TPlayer, args: string[]): void;
}
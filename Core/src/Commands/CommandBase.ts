import { injectable } from "inversify";
import { ICommand } from "../Interfaces/Commands/ICommand";
import { Player } from "../Models/Player";

/**
 * The base command class.
 *
 * Is injectable.
 * @type {TPlayer} The type of player to use with the command.
 */
@injectable()
export abstract class CommandBase<TPlayer extends Player> implements ICommand<TPlayer> {

    /**
     * Returns a value indicating whether the specified player is allowed to invoke the command.
     * @param player The player trying to invoke the command.
     */
    public abstract canExecute(player: TPlayer): boolean;

    /**
     * Executes the command by the specified player with the specified arguments.
     * @param player The player executing the command.
     * @param args The arguments to the command.
     */
    public abstract execute(player: TPlayer, args: string[]): void;
}
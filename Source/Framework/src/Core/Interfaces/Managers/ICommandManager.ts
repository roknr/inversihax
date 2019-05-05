import { Player } from "../../Models/Player";
import { ICommand } from "../Commands/ICommand";

/**
 * The command manager. Provides functionality for dealing with commands.
 */
export interface ICommandManager {

    /**
     * Returns true if the specified word indicates a command, false otherwise (and in the case the commands have not been configured).
     *
     * NOTE - this only checks if the word indicates a command, NOT if the command with the name represented by the word exists.
     * @param word The word to check.
     */
    isCommand(word: string): boolean;

    /**
     * Gets a command by name. Returns undefined if command for the name does not exist.
     * @param name The name of the command to get.
     */
    getCommandByName(name: string): ICommand<Player>;
}
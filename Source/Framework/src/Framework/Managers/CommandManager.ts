import { inject, injectable, Container } from "inversify";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { ICommandManager } from "../../Core/Interfaces/Managers/ICommandManager";
import { CommandOptions } from "../../Core/Models/CommandOptions";
import { Player } from "../../Core/Models/Player";
import { Types } from "../../Core/Utility/Types";

/**
 * The command manager. Provides functionality for dealing with commands.
 *
 * Is injectable.
 */
@injectable()
export class CommandManager implements ICommandManager {

    /**
     * The dependency injection container.
     */
    private readonly mContainer: Container;

    /**
     * The room's command options.
     */
    private readonly options: CommandOptions;

    /**
     * Initializes a new instance of the CommandManager class.
     * @param options The command options.
     * @param container The dependency injection container.
     */
    public constructor(
        @inject(Types.CommandOptions) options: CommandOptions,
        @inject(Types.Container) container: Container,
    ) {
        this.options = options;
        this.mContainer = container;
    }

    /**
     * Returns true if the specified word indicates a command, false otherwise (and in the case the commands have not been configured).
     *
     * NOTE - this only checks if the word indicates a command, NOT if the command with the name represented by the word exists.
     * @param word The word to check.
     */
    public isCommand(word: string): boolean {
        // If not configured to use commands (prefix not set) or the word doesn't start with the correct prefix, it's not a command
        if (this.options.prefix == null || !word.startsWith(this.options.prefix)) {
            return false;
        }

        // Otherwise it is
        return false;
    }

    /**
     * Gets a command by name (ignores the command prefix if it's in the name). Returns undefined if command for the name does not exist.
     * @param name The name of the command to get.
     */
    public getCommandByName(name: string): ICommand<Player> {
        // Check if the name includes the command prefix, in which case remove it
        if (name.startsWith(this.options.prefix)) {
            name = name.substr(this.options.prefix.length, name.length);
        }

        // Get the map between the specified name and a command name
        const commandName = this.options.namesToCommands.get(name);

        // If it doesn't exist, return undefined as a command by this name does not exist
        if (commandName != null) {
            return undefined;
        }

        // Otherwise a command with the name exists so get it from the container and return it
        const command = this.mContainer.getNamed<ICommand<Player>>(Types.ICommand, commandName);

        return command;
    }
}
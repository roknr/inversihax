import { inject, injectable } from "inversify";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { ICommandService } from "../../Core/Interfaces/Services/ICommandService";
import { CommandOptions } from "../../Core/Models/Options/CommandOptions";
import { ICommandFactoryType, Types } from "../../Core/Utility/Types";

/**
 * The command service. Provides functionality for dealing with commands.
 *
 * Is injectable.
 */
@injectable()
export class CommandService implements ICommandService {

    //#region Private members

    /**
     * The command factory.
     */
    private readonly mCommandFactory: ICommandFactoryType;

    /**
     * The room's command options.
     */
    private readonly options: CommandOptions;

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the CommandService class.
     * @param options The command options.
     * @param commandFactory The command factory.
     */
    public constructor(
        @inject(Types.CommandOptions) options: CommandOptions,
        @inject(Types.ICommandFactory) commandFactory: ICommandFactoryType,
    ) {
        this.options = options;
        this.mCommandFactory = commandFactory;
    }

    //#endregion

    //#region Public methods

    /**
     * Returns true if the specified word indicates a command, false otherwise (and in the case the commands have not been configured).
     *
     * NOTE - this only checks if the word indicates a command, NOT if the command with the name represented by the word exists.
     * @param word The word to check.
     */
    public isCommand(word: string): boolean {
        // If the word doesn't start with the correct prefix, it's not a command
        if (!word.startsWith(this.options.prefix)) {
            return false;
        }

        // Otherwise it is
        return true;
    }

    /**
     * Gets a command by name (ignores the command prefix if it's in the name). Returns undefined if command for the name does not exist.
     * @param name The name of the command to get.
     */
    public getCommandByName(name: string): ICommand {
        // Check if the name includes the command prefix, in which case remove it
        if (name.startsWith(this.options.prefix)) {
            name = name.substr(this.options.prefix.length, name.length);
        }

        // If case sensitivity doesn't matter, convert the name to lowercase as lowercase was used on initialization of command names
        if (!this.options.caseSensitive) {
            name = name.toLowerCase();
        }

        // Get the map between the specified name and a command name
        const commandName = this.options.namesToCommands.get(name);

        // If it doesn't exist, return undefined as a command by this name does not exist
        if (commandName == null) {
            return undefined;
        }

        // Otherwise a command with the name exists so get it from the factory and return it
        const command = this.mCommandFactory(commandName);
        return command;
    }

    //#endregion
}
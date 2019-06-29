import { interfaces } from "inversify";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { Player } from "../../Core/Models/Player";
import { ICommandFactoryType, Types } from "../../Core/Utility/Types";

/**
 * Creates the command factory that instantiates a command from the DI container based on the name.
 * @param context The DI context.
 */
export function createCommandFactory(context: interfaces.Context): ICommandFactoryType {
    return (commandName: string) => {
        // If no command with the specified name was bound, return undefined
        if (!context.container.isBoundNamed(Types.ICommand, commandName)) {
            return undefined;
        }

        // Otherwise create the command from the context's container and return it
        const command = context
            .container
            .getNamed<ICommand<Player>>(Types.ICommand, commandName);

        return command;
    };
}
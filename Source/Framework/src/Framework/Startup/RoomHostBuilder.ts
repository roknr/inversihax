import { Container } from "inversify";
import { CommandBase } from "../../Core/Commands/CommandBase";
import { IRoom } from "../../Core/Interfaces/IRoom";
import { ICommandManager } from "../../Core/Interfaces/Managers/ICommandManager";
import { CommandOptions } from "../../Core/Models/CommandOptions";
import { Player } from "../../Core/Models/Player";
import { Constants, Errors } from "../../Core/Utility/Constants";
import { DecoratorsHelper } from "../../Core/Utility/Helpers/DecoratorsHelper";
import { Types } from "../../Core/Utility/Types";
import { CommandManager } from "../Managers/CommandManager";
import { StartupBase } from "./StartupBase";

/**
 * The room builder.
 *
 * @type {TStartup} The room's startup type.
 *
 * @todo Make this more generic, e.g. so that no special container bindings will be needed by the user to use the default room, maybe only
 * method calls with configuration lambdas etc.
 * Options:
 *  - make a separate builder for the default room
 *  - make a base builder and a derived one for the default room
 *  - use interfaces instead of strictly typed builder class
 */
export class RoomHostBuilder<TStartup extends StartupBase> {

    //#region Private members

    /**
     * The startup class type.
     */
    private readonly mStartupType: { new(...args: any[]): TStartup };

    /**
     * The room class type.
     */
    private readonly mRoomType: { new(...args: any[]): IRoom<Player> };

    /**
     * The configure services action.
     */
    private mConfigureServicesAction: (container: Container) => void = null;

    //#endregion

    //#region Public properties

    /**
     * The room's dependency injection container.
     */
    public readonly container: Container = new Container();

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the RoomHostBuilder class. Uses the specified types to correctly bind the types.
     * @param startupType The startup class type.
     * @param roomType The room class type.
     */
    public constructor(
        startupType: { new(...args: any[]): TStartup },
        roomType: { new(...args: any[]): IRoom<Player> },
    ) {
        this.mStartupType = startupType;
        this.mRoomType = roomType;
    }

    //#endregion

    //#region Public methods

    /**
     * Sets the configure services action that will be called when building the room. When using default, you should at least configure the
     * IRoomConfigObject, so that it can get injected into the IRoom.
     * @param configureServicesAction The action to configure the services.
     */
    public setConfigureServicesAction(configureServicesAction: (container: Container) => void): RoomHostBuilder<TStartup> {
        // Set the configure services action
        this.mConfigureServicesAction = configureServicesAction;

        // Return this for chaining
        return this;
    }

    /**
     * Configures the room to use commands.
     * @param prefix The command prefix to use. If not specified, uses the framework default which is '!'.
     */
    public useCommands(prefix: string = Constants.DefaultCommandPrefix): RoomHostBuilder<TStartup> {
        // Bind commands to the container
        const namesToCommands = this.bindCommands();

        // Setup the command options and bind them to the container
        const commandOptions = <CommandOptions>{
            namesToCommands: namesToCommands,
            prefix: prefix,
        };

        this.container.bind<CommandOptions>(Types.CommandOptions).toConstantValue(commandOptions);

        // Also bind the command manager
        this.container.bind<ICommandManager>(Types.ICommandManager).to(CommandManager).inSingletonScope();

        // Return this for chaining
        return this;
    }

    /**
     * Configures the room to use behaviors.
     */
    public useBehaviors(): RoomHostBuilder<TStartup> {
        // TODO

        // Return this for chaining
        return this;
    }

    /**
     * Builds and starts hosting the room.
     */
    public buildAndRun(): void {
        // First configure the services
        if (this.mConfigureServicesAction != null) {
            this.mConfigureServicesAction(this.container);
        }

        // Bind the container itself
        this.container.bind<Container>(Types.Container).toConstantValue(this.container);

        // Bind the specified startup and room to the room's DI container
        this.container.bind<TStartup>(Types.Startup).to(this.mStartupType);
        this.container.bind<IRoom<Player>>(Types.IRoom).to(this.mRoomType).inSingletonScope();

        // Use the container to create the specified startup type, so that it can get all dependencies via DI
        const startup = this.container.get<TStartup>(Types.Startup);

        // Configure the room using the startup class
        startup.configure();
    }

    //#endregion

    //#region Private helpers

    /**
     * Binds commands to the container and returns the name to command mapping.
     */
    private bindCommands(): Map<string, string> {
        // Get all registered command metadata for classes decorated with @CommandDecorator
        const commands = DecoratorsHelper.getCommandsMetadata();

        // Prepare the names to commands map
        const namesToCommands = new Map<string, string>();

        // Go through all the command constructors
        commands.forEach((commandMetadata) => {
            const commandName = commandMetadata.target.constructor.name;

            // Validate for:
            // - duplicate command-class names (not allowed)
            // - inheritance from CommandBase (must inherit)
            // - no provided names (not allowed, must have at least 1)
            if (this.container.isBoundNamed(Types.ICommand, commandName)) {
                throw new Error(Errors.DuplicateCommand(commandName));
            }
            else if (commandMetadata.target.prototype instanceof CommandBase === false) {
                throw new Error(Errors.InvalidCommandType(commandMetadata.target.name));
            }
            else if (commandMetadata.metadata.names == null || commandMetadata.metadata.names.length === 0) {
                throw new Error(Errors.MissingCommandNames(commandName));
            }

            // Go through all the names of the command
            commandMetadata.metadata.names.forEach((name) => {
                // Only allow unique command names/identifiers (different to the above check, that's the actual class name)
                if (namesToCommands.has(name)) {
                    throw new Error(Errors.DuplicateCommandName(name));
                }

                // Create a map between the command name and the command (name of the command class)
                namesToCommands.set(name, commandName);
            });

            // Bind the command's constructor to its name; NOTE - cast to 'any' as type 'Function' is not assignable to type
            // 'new (...args: any[]) => {}', but it's the constructor so it's fine to ignore the type error
            this.container.bind(Types.ICommand)
                .to(commandMetadata.target as any)
                .inRequestScope()
                .whenTargetNamed(commandName);
        });

        // Return the name-command mapping
        return namesToCommands;
    }

    //#endregion
}
import { Container } from "inversify";
import {
    CommandBase, CommandOptions, Constants, DecoratorsHelper, Errors, ICommandManager, ICommandMetadata, IRoom, MetadataKeys, Player,
    Types,
} from "types-haxframework-core";
import { CommandManager } from "../Managers/CommandManager";
import { StartupBase } from "./StartupBase";

/**
 * The room builder.
 *
 * @type {TStartup} The room's startup type.
 * @type {TPlayer} The type of player to use with the room.
 *
 * @todo Make this more generic, e.g. so that no special container bindings will be needed by the user to use the default room, maybe only
 * method calls with configuration lambdas etc.
 * Options:
 *  - make a separate builder for the default room
 *  - make a base builder and a derived one for the default room
 *  - use interfaces instead of strictly typed builder class
 */
export class RoomHostBuilder<TStartup extends StartupBase, TPlayer extends Player> {

    //#region Private members

    /**
     * The startup class type.
     */
    private readonly mStartupType: { new(...args: any[]): TStartup };

    /**
     * The room class type.
     */
    private readonly mRoomType: { new(...args: any[]): IRoom<TPlayer> };

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
        roomType: { new(...args: any[]): IRoom<TPlayer> },
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
    public setConfigureServicesAction(configureServicesAction: (container: Container) => void): RoomHostBuilder<TStartup, TPlayer> {
        // Set the configure services action
        this.mConfigureServicesAction = configureServicesAction;

        // Return this for chaining
        return this;
    }

    /**
     * Configures the room to use commands.
     * @param prefix The command prefix to use. If not specified, uses the framework default which is '!'.
     * @param commands The list of predefined commands that are supported out-of-the-box by the framework to use. If not specified, uses
     * no default framework commands.
     */
    public useCommands(prefix: string = Constants.DefaultCommandPrefix, commands?: string[]): RoomHostBuilder<TStartup, TPlayer> {
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
    public useBehaviors(): RoomHostBuilder<TStartup, TPlayer> {
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

        // Bind the specified startup and room to the room's DI container
        this.container.bind<TStartup>(Types.Startup).to(this.mStartupType);
        this.container.bind<IRoom<TPlayer>>(Types.IRoom).to(this.mRoomType).inSingletonScope();

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
        // Get all of the classes' constructors that were decorated with the @CommandDecorator
        const commandConstructors = DecoratorsHelper.getCommandsFromMetadata();

        // Prepare the names to commands map
        const namesToCommands = new Map<string, string>();

        // Go through all the command constructors
        commandConstructors.forEach((constructor) => {
            const commandName = constructor.constructor.name;

            // Check and don't allow duplicate command names
            if (this.container.isBoundNamed(Types.ICommand, commandName)) {
                throw new Error(Errors.DuplicateCommand(commandName));
            }

            // Check and don't allow commands to not inherit from CommandBase class
            if (constructor.prototype instanceof CommandBase === false) {
                throw new Error(Errors.InvalidCommandType(constructor.name));
            }

            // Get the metadata for the command
            const commandMetadata = DecoratorsHelper.getMetadata<ICommandMetadata>(MetadataKeys.Command, constructor);

            // Check and don't allow using commands with no names
            if (commandMetadata.names == null || commandMetadata.names.length === 0) {
                throw new Error(Errors.MissingCommandNames(commandName));
            }

            // Go through all the names of the command
            commandMetadata.names.forEach((name) => {
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
                .to(constructor as any)
                .inRequestScope()
                .whenTargetNamed(commandName);
        });

        // Return the name-command mapping
        return namesToCommands;
    }

    //#endregion
}
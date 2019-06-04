import { interfaces, Container, ContainerModule } from "inversify";
import { ICommand } from "../../Core/Interfaces/Commands/ICommand";
import { IRoom } from "../../Core/Interfaces/IRoom";
import { IChatMessageInterceptor } from "../../Core/Interfaces/Interceptors/IChatMessageInterceptor";
import { ICommandService } from "../../Core/Interfaces/Services/ICommandService";
import { IPlayerService } from "../../Core/Interfaces/Services/IPlayerService";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { CommandOptions } from "../../Core/Models/CommandOptions";
import { Player } from "../../Core/Models/Player";
import { Constants, Errors } from "../../Core/Utility/Constants";
import { DecoratorsHelper } from "../../Core/Utility/Helpers/DecoratorsHelper";
import { ConstructorType, Types } from "../../Core/Utility/Types";
import { CommandBase } from "../Commands/CommandBase";
import { createChatMessageInterceptorFactory } from "../Factories/ChatMessageInterceptorFactory";
import { createCommandFactory } from "../Factories/CommandFactory";
import { CommandInterceptor } from "../Interceptors/CommandInterceptor";
import { CommandService } from "../Services/CommandService";
import { PlayerService } from "../Services/PlayerService";
import { StartupBase } from "./StartupBase";

/**
 * The room builder.
 *
 * TODO: Make this more generic, e.g. so that no special container bindings will be needed by the user to use the default room, maybe only
 * method calls with configuration lambdas etc.
 * Options:
 *  - make a separate builder for the default room
 *  - make a base builder and a derived one for the default room
 *  - use interfaces instead of strictly typed builder class
 */
export class RoomHostBuilder {

    //#region Private members

    /**
     * The startup class type.
     */
    private readonly mStartupType: ConstructorType<StartupBase>;

    /**
     * The room class type.
     */
    private readonly mRoomType: ConstructorType<IRoom<Player>>;

    /**
     * The user's container module that contains service configuration bindings.
     */
    private readonly mServicesModule: ContainerModule;

    //#endregion

    //#region Public properties

    /**
     * The room's dependency injection container.
     *
     * TODO: make this private, no need to publicly expose... tests will have to change
     */
    public readonly container: Container = new Container();

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the RoomHostBuilder class. Uses the specified types to correctly bind the types.
     * @param startupType The startup class type.
     * @param roomType The room class type.
     * @param servicesModule The container module that contains service configuration bindings.
     */
    public constructor(
        startupType: ConstructorType<StartupBase>,
        roomType: ConstructorType<IRoom<Player>>,
        servicesModule: ContainerModule,
    ) {
        this.mStartupType = startupType;
        this.mRoomType = roomType;
        this.mServicesModule = servicesModule;
    }

    //#endregion

    //#region Public methods

    /**
     * Configures the room to use commands.
     * @param prefix The command prefix to use. If not specified, uses the framework default which is '!'.
     * @param customCommandServiceType The custom command service type to use. If not specified, uses the
     * framework's default CommandService type.
     */
    public useCommands(
        prefix: string = Constants.DefaultCommandPrefix,
        customCommandServiceType?: ConstructorType<ICommandService>,
    ): RoomHostBuilder {
        // Bind commands and the command factory to the container
        const namesToCommands = this.bindCommands();
        this.bindCommandFactory();

        // Setup the command options and bind them to the container
        const commandOptions = new CommandOptions(prefix, namesToCommands);
        this.container
            .bind<CommandOptions>(Types.CommandOptions)
            .toConstantValue(commandOptions);

        // Also bind the command service
        const commandServiceType = customCommandServiceType == null ? CommandService : customCommandServiceType;
        this.container
            .bind<ICommandService>(Types.ICommandService)
            .to(commandServiceType)
            .inRequestScope();

        // And the command interceptor
        this.container
            .bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor)
            .to(CommandInterceptor)
            .inRequestScope();

        // Return this for chaining
        return this;
    }

    /**
     * Builds and starts hosting the room.
     */
    public buildAndRun(): void {
        // Bind services that should be bound before loading the user's services module
        this.bindBeforeUserServices();

        // Configure the user's services
        if (this.mServicesModule != null) {
            this.container.load(this.mServicesModule);
        }

        // Bind services that should be bound after the user's services module has been loaded
        this.bindAfterUserServices();

        // Use the container to create the specified startup type, so that it can get all dependencies via DI
        const startup = this.container.get<StartupBase>(Types.Startup);

        // Configure the room using the startup class
        startup.configure();

        // Unbind the Startup type since it is only used for startup
        this.container.unbind(Types.Startup);
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

            // Bind the command's constructor to its name; NOTE - cast to "any" as type "Function" is not assignable to type
            // "new (...args: any[]) => {}", but it's the constructor so it's fine to ignore the type error
            this.container.bind(Types.ICommand)
                .to(commandMetadata.target as any)
                .inRequestScope()
                .whenTargetNamed(commandName);
        });

        // Return the name-command mapping
        return namesToCommands;
    }

    /**
     * Binds services before loading the user's service module.
     *
     * NOTE: need to bind framework interceptors before load of the user's service module.
     */
    private bindBeforeUserServices(): void {
        // Bind the specified startup and room
        this.container
            .bind<StartupBase>(Types.Startup)
            .to(this.mStartupType);
        this.container
            .bind<IRoom<Player>>(Types.IRoom)
            .to(this.mRoomType)
            .inSingletonScope();

        // Bind the chat message interceptor factory
        this.bindChatMessageInterceptorFactory();
    }

    /**
     * Binds services after the user's services module has been loaded. Binds other necessary types, that were perhaps not
     * bound by the user but are needed.
     */
    private bindAfterUserServices(): void {
        // PlayerService is needed in the Room, so bind it to the framework's default one if user did not
        if (!this.container.isBound(Types.IPlayerService)) {
            this.container
                .bind<IPlayerService<Player>>(Types.IPlayerService)
                .to(PlayerService);
        }
    }

    //#region Factory bindings

    /**
     * Binds the chat message interceptor factory to the container.
     */
    private bindChatMessageInterceptorFactory(): void {
        this.container
            .bind<interfaces.Factory<Array<IChatMessageInterceptor<ChatMessage<Player>>>>>(Types.IChatMessageInterceptorFactory)
            .toFactory((context: interfaces.Context) => {
                return createChatMessageInterceptorFactory(context);
            });
    }

    /**
     * Binds the command factory to the container.
     */
    private bindCommandFactory(): void {
        this.container
            .bind<interfaces.Factory<ICommand<Player>>>(Types.ICommandFactory)
            .toFactory((context: interfaces.Context) => {
                return createCommandFactory(context);
            });
    }

    //#endregion

    //#endregion
}
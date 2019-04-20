import { Container } from "inversify";
import { IRoom, Player, Types } from "types-haxframework-core";
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
export class RoomHostBuilder<TStartup extends StartupBase<TPlayer>, TPlayer extends Player> {

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
     * @param commandPrefix The prefix to use for commands.
     * @param commands The list of predefined commands that are supported out-of-the-box by the framework to use.
     */
    public useCommands(commandPrefix: string, commands?: string[]): RoomHostBuilder<TStartup, TPlayer> {
        // TODO

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
}
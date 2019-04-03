import { Container } from "inversify";
import { IRoom, Types } from "types-haxframework-core";
import { Room } from "../Room/Room";
import { StartupBase } from "./StartupBase";

/**
 * The room builder.
 */
export class RoomHostBuilder {

    //#region Private members

    /**
     * The room's dependency injection container.
     */
    private mContainer: Container = new Container();

    //#endregion

    //#region Public methods

    /**
     * Calls the specified method to configure the services. When using defaults, you should at least configure the IRoomConfigObject, so
     * that it can get injected into the IRoom.
     * @param configureAction The action to configure the services.
     */
    public configureServices(configureAction: (container: Container) => void): void {
        if (configureAction) {
            configureAction(this.mContainer);
        }
    }

    /**
     * Builds and starts hosting the room.
     * @param startupType The Startup class type to use when configuring the room.
     */
    public buildAndRun<TStartup extends StartupBase>(startupType: { new(...args: any[]): TStartup }): void {
        // Bind the specified startup class to the room's DI container
        this.mContainer.bind<TStartup>(Types.Startup).to(startupType);

        // Bind the room to specific type
        this.mContainer.bind<IRoom>(Types.IRoom).to(Room).inSingletonScope();

        // Use the container to create the specified startup type, so that it can get all dependencies via DI
        const startup = this.mContainer.get<TStartup>(Types.Startup);

        // Configure the room using the startup class
        startup.configure();

        // TODO
        // return this.mContainer.get<IRoom>(Types.IRoom);
    }

    //#endregion
}
import { injectable } from "inversify";

/**
 * The base startup class. Use this class to inject any dependencies, configured in the RoomHostBuilder
 * and configure the room.
 *
 * Inject needed dependencies through the constructor and configure the room in the configure method.
 */
@injectable()
export abstract class StartupBase {

    /**
     * Implement this method to configure the room.
     */
    public abstract configure(): void;
}
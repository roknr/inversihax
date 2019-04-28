import { injectable } from "inversify";
import { IRoom } from "../../Core/Interfaces/IRoom";
import { Player } from "../../Core/Models/Player";

/**
 * The base startup class. Derive from this class to inject any dependencies, configured in the RoomHostBuilder
 * and configure the room.
 *
 * Inject needed dependencies through the constructor and configure the room in the configure method.
 *
 * NOTE: you must inject the IRoom<TPlayer> class to the derived class and pass it manually to the base's constructor.
 *
 * @type {TPlayer} The type of player to use with the room.
 */
@injectable()
export abstract class StartupBase {

    //#region Protected members

    /**
     * The room.
     */
    protected readonly mRoom: IRoom<Player>;

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the StartupBase class.
     * @param room The room.
     */
    public constructor(room: IRoom<Player>) {
        this.mRoom = room;
    }

    //#endregion

    //#region Public methods

    /**
     * Implement this method to configure the room.
     */
    public abstract configure(): void;

    //#endregion
}
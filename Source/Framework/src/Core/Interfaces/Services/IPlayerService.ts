import { IPlayerObject } from "../../../HeadlessAPI/Interfaces/IPlayerObject";
import { Player } from "../../Models/Player";

/**
 * Defines functionality for dealing with player management.
 * @type {TPlayer} The type of players to manage.
 */
export interface IPlayerService<TPlayer extends Player> {

    // TODO: Is this method really necessary? The Player implements IPlayerObject, so it's cast-able by default..
    // But what about custom derived classes? They might have custom properties, so it might be good to have this cast method
    // to set them, as the user can inject any service into this user service, so he has more options?? This is also a RoomBase
    // dependency which doesn't seem like the best option.
    /**
     * Casts the base Headless API's player object into the specified player type.
     * @param player The player object to cast.
     */
    cast(player: IPlayerObject): TPlayer;
}
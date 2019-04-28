import { TeamID } from "../Enums/TeamID";
import { IPosition } from "./IPosition";

/**
 * The player object interface.
 */
export interface IPlayerObject {

    /**
     * The id of the player, each player that joins the room gets a unique id that will never change.
     */
    id: number;

    /**
     * The name of the player.
     */
    name: string;

    /**
     * The team of the player.
     */
    team: TeamID;

    /**
     * Whether the player has admin rights.
     */
    admin: boolean;

    /**
     * The player's position in the field, if the player is not in the field the value will be null.
     */
    position: IPosition;

    /**
     * The player's public ID. Can be null if the ID validation fails. This
     * property is only set in the RoomObject.onPlayerJoin event.
     */
    auth: string;

    /**
     * A string that uniquely identifies the player's connection, if two players join using the same
     * network this string will be equal. This property is only set in the RoomObject.onPlayerJoin event.
     */
    conn: string;
}
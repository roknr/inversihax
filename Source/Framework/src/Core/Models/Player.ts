import { IPlayerObject, IPosition, TeamID } from "types-haxball-headless-api";
import { Role } from "./Role";

/**
 * The base player class that implements the Headless API's IPlayerObject interface. Inherit from this class to implement custom
 * functionality.
 */
export class Player<TRole extends Role = Role> implements IPlayerObject {

    //#region Public properties

    /**
     * The player's room id.
     */
    public readonly id: number;

    /**
     * The player's room name.
     */
    public readonly name: string;

    /**
     * The player's team id.
     */
    public readonly team: TeamID;

    /**
     * The flag indicating whether the player is an admin in the room.
     */
    public readonly admin: boolean;

    /**
     * The player's position in the room.
     */
    public readonly position: IPosition;

    /**
     * The player's public id.
     */
    public readonly auth: string;

    /**
     * Unique id of the player's connection.
     */
    public readonly conn: string;

    /**
     * The player's roles.
     */
    public readonly roles: Set<TRole> = new Set();

    //#endregion

    //#region Constructor

    /**
     * Initializes a new instance of the Player class.
     * @param id The player's id.
     * @param name The player's name in the room.
     * @param team The player's team id.
     * @param admin Flag indicating whether the player is an admin in the room.
     * @param position The player's position.
     * @param conn The string that uniquely identifies the player's connection.
     * @param auth The player's public id.
     * @param roles The player's roles.
     */
    public constructor(
        id: number,
        name: string,
        team: TeamID,
        admin: boolean,
        position: IPosition,
        conn: string,
        auth: string = null,
        roles: Set<TRole> = null,
    ) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.admin = admin;
        this.position = position;
        this.conn = conn;

        if (auth != null) {
            this.auth = auth;
        }

        if (roles != null) {
            this.roles = roles;
        }
    }

    //#endregion
}
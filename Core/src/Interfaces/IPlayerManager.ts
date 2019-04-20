import { IPlayerObject } from "types-haxball-headless-api";
import { Player } from "../Models/Player";

/**
 * Defines functionality for dealing with player management.
 * @type {TPlayer} The type of players to manage.
 */
export interface IPlayerManager<TPlayer extends Player> {

    /**
     * Casts the base Headless API's player object into the specified player type.
     * @param player The player object to cast.
     */
    cast(player: IPlayerObject): TPlayer;
}
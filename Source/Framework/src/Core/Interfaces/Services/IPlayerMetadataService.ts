import { IPlayerObject } from "../../../HeadlessAPI/Interfaces/IPlayerObject";
import { PlayerMetadata } from "../../Models/PlayerMetadata";

/**
 * Defines functionality for dealing with player metadata.
 * @type {TPlayerMetadata} The type of custom player metadata to use with the players in the room.
 */
export interface IPlayerMetadataService<TPlayerMetadata extends PlayerMetadata = PlayerMetadata> {

    /**
     * Gets the custom player metadata for the specified player.
     * @param player The player to get the metadata for.
     */
    getMetadataFor(player: IPlayerObject): TPlayerMetadata;

    /**
     * Sets the custom player metadata for the specified player.
     * @param player The player to set the metadata for.
     * @param metadata The metadata to set for the specified player.
     */
    setMetadataFor(player: IPlayerObject, metadata: TPlayerMetadata): void;

    /**
     * Handles the metadata for the player that joined. Called internally from the RoomBase when a player join the room.
     * @param player The player that joined.
     */
    handleOnPlayerJoin(player: IPlayerObject): void;

    /**
     * Handles the metadata for the player that left. Called internally from the RoomBase when a player leaves the room.
     * @param player The player that left.
     */
    handleOnPlayerLeave(player: IPlayerObject): void;
}
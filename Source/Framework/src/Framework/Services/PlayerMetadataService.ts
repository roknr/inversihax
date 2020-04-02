import { injectable } from "inversify";
import { IPlayerMetadataService } from "../../Core/Interfaces/Services/IPlayerMetadataService";
import { PlayerMetadata } from "../../Core/Models/PlayerMetadata";
import { IPlayerObject } from "../../HeadlessAPI/Interfaces/IPlayerObject";

/**
 * The default player metadata service. Provides functionality for dealing with default custom player metadata.
 *
 * Is injectable.
 */
@injectable()
export class PlayerMetadataService implements IPlayerMetadataService<PlayerMetadata> {

    //#region Private members

    /**
     * The map of players (ids) to their metadata.
     */
    private mPlayerMetadataMap: Map<number, PlayerMetadata> = new Map();

    //#endregion

    //#region Public methods

    /**
     * Gets the custom player metadata for the specified player.
     * @param player The player to get the metadata for.
     */
    public getMetadataFor(player: IPlayerObject): PlayerMetadata {
        return this.mPlayerMetadataMap.get(player.id);
    }

    /**
     * Sets the custom player metadata for the specified player.
     * @param player The player to set the metadata for.
     */
    public setMetadataFor(player: IPlayerObject, metadata: PlayerMetadata): void {
        this.mPlayerMetadataMap.set(player.id, metadata);
    }

    //#endregion

    //#region Event handlers

    /**
     * Handles the metadata for the player that joined.
     * @param player The player that joined.
     */
    public handleOnPlayerJoin(player: IPlayerObject): void {

        // Create new metadata for the player that joined
        this.mPlayerMetadataMap.set(player.id, new PlayerMetadata());
    }

    /**
     * Handles the metadata for the player that left.
     * @param player The player that left.
     */
    public handleOnPlayerLeave(player: IPlayerObject): void {

        // Delete the metadata for the player that left
        this.mPlayerMetadataMap.delete(player.id);
    }

    //#endregion
}
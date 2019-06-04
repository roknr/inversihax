import { injectable } from "inversify";
import { IPlayerObject } from "types-haxball-headless-api";
import { IPlayerService } from "../../Core/Interfaces/Services/IPlayerService";
import { Player } from "../../Core/Models/Player";

/**
 * The default player service. Provides functionality for dealing with default player types.
 *
 * Is injectable.
 */
@injectable()
export class PlayerService implements IPlayerService<Player> {

    /**
     * Casts the base Headless API player into a default Player type.
     * @param player The base Headless API player object.
     */
    public cast(player: IPlayerObject): Player {
        return new Player(
            player.id,
            player.name,
            player.team,
            player.admin,
            player.position,
            player.conn,
            player.auth,
        );
    }
}
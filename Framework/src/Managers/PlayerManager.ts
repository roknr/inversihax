import { injectable } from "inversify";
import { IPlayerObject } from "types-haxball-headless-api";
import { IPlayerManager, Player } from "types-haxframework-core";

/**
 * The default player manager. Provides functionality for dealing with default player types.
 *
 * Is injectable.
 */
@injectable()
export class PlayerManager implements IPlayerManager<Player> {

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
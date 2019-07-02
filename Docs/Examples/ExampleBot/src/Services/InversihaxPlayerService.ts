import { IPlayerObject } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";
import { injectable } from "inversify";
import * as _ from "lodash";
import { IInversihaxPlayerService } from "../Interfaces/IInversihaxPlayerService";

@injectable()
export class InversihaxPlayerService implements IInversihaxPlayerService {

    /**
     * Where we keep our player types, since the room only provides the base IPlayerObject.
     */
    private mPlayerMap: Map<number, InversihaxPlayer> = new Map();

    public handlePlayerJoin(player: IPlayerObject): void {
        const ourPlayerType = new InversihaxPlayer(
            player.id,
            player.name,
            player.team,
            player.admin,
            player.position,
            player.conn,
            player.auth,
        );
        this.mPlayerMap.set(player.id, ourPlayerType);
    }

    // Methods for handling player events, they are hooked up in the room:

    public handlePlayerLeave(player: InversihaxPlayer): void {
        this.mPlayerMap.delete(player.id);
    }

    public handlePlayerTeamChange(player: IPlayerObject): void {
        this.mPlayerMap.get(player.id).team = player.team;
    }

    public handlePlayerAdminChange(player: IPlayerObject): void {
        this.mPlayerMap.get(player.id).admin = player.admin;
    }

    public handlePlayerPositions(players: IPlayerObject[]): void {
        // We need to update only positions of the players that are playing, others don't have position
        const playingPlayers = _.filter(players, (player) => player.position != null);
        playingPlayers.forEach((player) => {
            this.mPlayerMap.get(player.id).position = player.position;
        });
    }

    /**
     * Our implementation of the case method, as we want to return an existing player since
     * we're keeping track of them.
     */
    public cast(player: IPlayerObject): InversihaxPlayer {
        // Handle undefined player
        if (player == null) {
            return null;
        }

        // If we have a player set for this id, return it
        const ourPlayer = this.mPlayerMap.get(player.id);
        if (ourPlayer != null) {
            return ourPlayer;
        }

        // Otherwise create a new one
        return new InversihaxPlayer(
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
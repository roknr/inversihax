import { IPlayerService, IPlayerObject, Types } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";
import { inject, injectable } from "inversify";
import { IInversihaxRoom } from "../Interfaces/IInversihaxRoom";
import * as _ from "lodash";
import { IInversihaxPlayerService } from "../Interfaces/IInversihaxPlayerService";

@injectable()
export class InversihaxPlayerService implements IInversihaxPlayerService {

    /**
     * Where we keep our player types, since the room only provides the base IPlayerObject.
     */
    private mPlayerMap: Map<number, InversihaxPlayer> = new Map();

    /**
     * We inject the room, no issue with circular dependency since both this service and the room are singletons.
     */
    public constructor() {
        // this.mRoom = room;

        // // Add the player to our container on join
        // this.mRoom.onPlayerJoin.addHandler((player) => {

        // });

        // // Remove the player on leave
        // this.mRoom.onPlayerLeave.addHandler((player) => );

        // // Update player team on change
        // this.mRoom.onPlayerTeamChange.addHandler((changedPlayer, byPlayer) => {
        //     console.log(this.mRoom.getPlayerBase(changedPlayer.id));
        //     this.mPlayerMap.get(changedPlayer.id).team = this.mRoom.getPlayerBase(changedPlayer.id).team;
        // });

        // // Update player admin on change
        // this.mRoom.onPlayerAdminChange.addHandler((changedPlayer, byPlayer) => {
        //     console.log(this.mRoom.getPlayerBase(changedPlayer.id));
        //     this.mPlayerMap.get(changedPlayer.id).admin = this.mRoom.getPlayerBase(changedPlayer.id).admin;
        // });

        // // We want to update all the player's positions, so do this on every game tick
        // this.mRoom.onGameTick.addHandler(() => {
        //     const allPlayers = this.mRoom.getPlayerListBase();

        //     // We need to update only positions of the player's that are playing, others don't have position
        //     const playingPlayers = _.filter(allPlayers, (player) => player.position != null);
        //     playingPlayers.forEach((player) => {
        //         this.mPlayerMap.get(player.id).position = player.position;
        //     });
        // });
    }

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
        console.log(this.mPlayerMap);
    }

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
        // We need to update only positions of the player's that are playing, others don't have position
        const playingPlayers = _.filter(players, (player) => player.position != null);
        playingPlayers.forEach((player) => {
            this.mPlayerMap.get(player.id).position = player.position;
        });
    }

    public cast(player: IPlayerObject): InversihaxPlayer {
        console.log(player);
        const ourPlayer = this.mPlayerMap.get(player.id);
        console.log(ourPlayer);

        let ret = ourPlayer != null ? ourPlayer : new InversihaxPlayer(
            player.id,
            player.name,
            player.team,
            player.admin,
            player.position,
            player.conn,
            player.auth,
        );

        console.log(ret);

        return ret;
    }
}
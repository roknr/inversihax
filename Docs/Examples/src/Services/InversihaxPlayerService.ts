import { IPlayerService, IPlayerObject } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";

export class InversihaxPlayerService implements IPlayerService<InversihaxPlayer> {

    private mPlayerMap: Map<number, InversihaxPlayer> = new Map();

    cast(player: IPlayerObject): InversihaxPlayer {
        return this.mPlayerMap.get(player.id);
    }
}
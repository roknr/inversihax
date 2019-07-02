import { IPlayerService, IPlayerObject } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";

export interface IInversihaxPlayerService extends IPlayerService<InversihaxPlayer> {

    handlePlayerJoin(player: IPlayerObject): void;
    handlePlayerLeave(player: InversihaxPlayer): void;
    handlePlayerTeamChange(player: IPlayerObject): void;
    handlePlayerAdminChange(player: IPlayerObject): void;
    handlePlayerPositions(players: IPlayerObject[]): void;
}
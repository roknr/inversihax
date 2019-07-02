import { injectable } from "inversify";
import { IPlayerObject, IPlayerService } from "inversihax";
import { CustomPlayer } from "../Models/CustomPlayer";
import { newGuid } from "../Utilities";

@injectable()
export class CustomPlayerService implements IPlayerService<CustomPlayer> {

    public cast(player: IPlayerObject): CustomPlayer {
        return new CustomPlayer(
            player.id,
            player.name,
            player.team,
            player.admin,
            player.position,
            player.conn,
            player.auth,
            newGuid(),
        );
    }
}
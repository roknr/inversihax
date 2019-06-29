import { Player } from "inversihax";
import { IPosition, TeamID } from "../../../../HeadlessAPI/lib";

export class CustomPlayer extends Player {

    public readonly guid: string;

    constructor(
        id: number,
        name: string,
        team: TeamID,
        admin: boolean,
        position: IPosition,
        conn: string,
        auth: string,
        guid: string,
    ) {
        super(id, name, team, admin, position, conn, auth);

        this.guid = guid;
    }
}
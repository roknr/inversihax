import { Player, TeamID, IPosition } from "inversihax";
import { InversihaxRole } from "./InversihaxRole";

/**
 * Our custom player model that uses our custom roles.
 */
export class InversihaxPlayer extends Player<InversihaxRole> {

    /**
     * We need to provide all the following parameters in the constructor so that we can pass them
     * to the base class.
     */
    public constructor(
        id: number,
        name: string,
        team: TeamID,
        admin: boolean,
        position: IPosition,
        conn: string,
        auth: string,
        roles: Set<InversihaxRole>,
    ) {
        super(id, name, team, admin, position, conn, auth, roles);

        // Every player should have the basic player role so add it on construction.
        this.roles.add(InversihaxRole.Player);
    }
}
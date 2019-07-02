import { CommandBase, CommandDecorator, Types } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";
import { inject } from "inversify";
import { IInversihaxRoom } from "../Interfaces/IInversihaxRoom";
import { InversihaxRole } from "../Models/InversihaxRole";

/**
 * A command that will give the player the admin rights and admin role upon successful invocation.
 */
@CommandDecorator({
    names: ["admin", "a"],  // the names that will identify the command in a chat message
})
export class GiveAdminCommand extends CommandBase<InversihaxPlayer> {

    /**
     * The reference to our room, which will be set in the constructor.
     */
    private readonly mRoom: IInversihaxRoom;

    public constructor(
        @inject(Types.IRoom) room: IInversihaxRoom,
    ) {
        super();

        this.mRoom = room;
    }

    // Any player can execute this command
    canExecute(player: InversihaxPlayer): boolean {
        return true;
    }

    /**
     * Gives the player the admin status and role.
     */
    execute(player: InversihaxPlayer, args: string[]): void {
        // If player provided correct password
        if (args[0] === "password") {
            // And game is not in progress and he is in spectators, set the status and role
            if (this.mRoom.isGameInProgress && player.position != null) {
                this.mRoom.sendChat("Don't write during the game!");
                return;
            }

            this.mRoom.setPlayerAdmin(player.id, true);
            player.roles.add(InversihaxRole.Admin);
        }
        else {
            // Otherwise kick him
            this.mRoom.kickPlayer(player.id, "Invalid password.", false);
        }
    }
}
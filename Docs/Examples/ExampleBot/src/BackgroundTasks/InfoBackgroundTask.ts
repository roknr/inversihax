import { IBackgroundTask, Types } from "inversihax";
import { injectable, inject } from "inversify";
import { IInversihaxRoom } from "../Interfaces/IInversihaxRoom";

/**
 * A background task that provides information every 30 seconds.
 * Must be decorated with the "@injectable()" decorator so it can be instantiated by the DI container.
 */
@injectable()
export class InfoBackgroundTask implements IBackgroundTask {

    private readonly mRoom: IInversihaxRoom;

    public constructor(@inject(Types.IRoom) room: IInversihaxRoom) {
        this.mRoom = room;
    }

    /**
     * Starts running the task.
     */
    start(): void {
        // Provide player information every 30 seconds
        setInterval(() => {
            // Get all the players from the room (ignore the host with id == 0)
            const players = this.mRoom.getPlayerList();
            players.forEach((player) => {
                if (player.id === 0) {
                    return;
                }

                // Send position information for every player
                let message = "";
                if (player.position != null)
                    message = `POSITION ${player.name} (${player.position.x}, ${player.position.y})`;
                else
                    message = `POSITION ${player.name} N/A`;

                this.mRoom.sendChat(message);
            });
        }, 30000);
    }

    /**
     * Stops running the task, but not needed in this example.
     */
    stop(): void { }
}
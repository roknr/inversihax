import { IBackgroundTask, Types } from "inversihax";
import { injectable, inject } from "inversify";
import { IInversihaxRoom } from "../Interfaces/IInversihaxRoom";
import { throws } from "assert";

/**
 * A background task that provides information every 60 seconds.
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
        setInterval(() => {
            this.mRoom.sendChat("A message from the info background task... next message in 60 seconds...");
        }, 60000);

        // setInterval(() => {
        //     const players = this.mRoom.getPlayerList();
        //     players.forEach((player) => {
        //         let message = "";
        //         if (player.position != null)
        //             message = `POSITION ${player.name} (${player.position.x}, ${player.position.y})`;
        //         else
        //             message = `POSITION ${player.name} N/A`;

        //         this.mRoom.sendChat(message);
        //     });
        // }, 5000);
    }

    /**
     * Stops running the task, but not needed in this example.
     */
    stop(): void { }
}
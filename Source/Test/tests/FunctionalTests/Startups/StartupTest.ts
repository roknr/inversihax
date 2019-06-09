import { inject } from "inversify";
import { StartupBase, Types } from "inversihax";
import { ICustomTestRoom } from "../Rooms/CustomTestRoom";

export class StartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: ICustomTestRoom,
    ) {
        super(room);
    }

    // TODO: fix this test/error (this should be un-assignable, so the error is correct, find a different way to test)
    configure(): void {
        // this.mRoom.onPlayerChat = (player, message) => {
        //     if (player.id === 3) {
        //         return true;
        //     }
        //     return false;
        // };
    }
}
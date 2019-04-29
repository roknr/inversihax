import { inject } from "inversify";
import { StartupBase, Types } from "types-haxframework";
import { ICustomTestRoom } from "../Rooms/CustomTestRoom";

export class StartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: ICustomTestRoom,
    ) {
        super(room);
    }

    configure(): void {
        this.mRoom.onPlayerChat = (player, message) => {
            if (player.id === 3) {
                return true;
            }
            return false;
        };
    }
}
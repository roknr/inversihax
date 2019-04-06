import { inject } from "inversify";
import { StartupBase } from "types-haxframework";
import { IRoom, Types } from "types-haxframework-core";

export class StartupTest extends StartupBase {

    private readonly mRoom: IRoom;

    constructor(
        @inject(Types.IRoom) room: IRoom,
    ) {
        super();

        this.mRoom = room;
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
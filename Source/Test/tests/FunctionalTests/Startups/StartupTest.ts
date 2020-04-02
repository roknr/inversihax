import { inject } from "inversify";
import { IPlayerObject, StartupBase, Types } from "inversihax";
import { ICustomTestRoom } from "../Rooms/CustomTestRoom";

export class StartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: ICustomTestRoom,
    ) {
        super(room);
    }

    configure(): void {
        // Cast to any to be able to mock the method, only for testing
        (this.mRoom.onPlayerChat as any) = (player: IPlayerObject, message: string) => {
            if (player.id === 3) {
                return true;
            }
            return false;
        };
    }
}
import { inject } from "inversify";
import { StartupBase } from "types-haxframework";
import { IRoom, Player, Types } from "types-haxframework-core";

export class StartupTest extends StartupBase<Player> {

    constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
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
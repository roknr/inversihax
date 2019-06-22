import { inject } from "inversify";
import { IRoom, Player, StartupBase, Types } from "inversihax";

export class CommonStartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
    ) {
        super(room);
    }

    configure(): void {

    }
}
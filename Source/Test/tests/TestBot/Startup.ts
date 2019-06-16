import { inject } from "inversify";
import { IRoom, Player, StartupBase, Types } from "inversihax";

export class Startup extends StartupBase {

    public constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
    ) {
        super(room);
    }

    public configure(): void {

    }
}
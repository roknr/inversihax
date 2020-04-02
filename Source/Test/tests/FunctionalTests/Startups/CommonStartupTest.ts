import { inject } from "inversify";
import { IRoom, StartupBase, Types } from "inversihax";

export class CommonStartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: IRoom,
    ) {
        super(room);
    }

    configure(): void {

    }
}
import { inject } from "inversify";
import { IRoom, StartupBase, Types } from "inversihax";

export class Startup extends StartupBase {

    public constructor(
        @inject(Types.IRoom) room: IRoom,
    ) {
        super(room);
    }

    public configure(): void {

    }
}
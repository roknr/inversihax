import { inject } from "inversify";
import { CommandBase, CommandDecorator, IPlayerMetadataService, IPlayerObject, PlayerMetadataService, Types } from "inversihax";
import { ICustomRoom } from "../Room/ICustomRoom";

@CommandDecorator({
    names: ["info", "i"],
})
export class InfoCommand extends CommandBase {

    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
        @inject(Types.IPlayerMetadataService) playerMetadataService: IPlayerMetadataService,
    ) {
        super(playerMetadataService);

        this.mRoom = room;
    }

    public canExecute(player: IPlayerObject): boolean {
        return true;
    }

    public execute(player: IPlayerObject, args: string[]): void {
        this.mRoom.sendChat("This is just a simple command that shows how to implement a command");
    }
}
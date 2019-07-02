import { inject } from "inversify";
import { CommandBase, CommandDecorator, Types } from "inversihax";
import { CustomPlayer } from "../Models/CustomPlayer";
import { ICustomRoom } from "../Room/ICustomRoom";

@CommandDecorator({
    names: ["info", "i"],
})
export class InfoCommand extends CommandBase<CustomPlayer> {

    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
    ) {
        super();

        this.mRoom = room;
    }

    public canExecute(player: CustomPlayer): boolean {
        return true;
    }

    public execute(player: CustomPlayer, args: string[]): void {
        this.mRoom.sendChat("This is just a simple command that shows how to implement a command");
    }
}
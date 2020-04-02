import { inject } from "inversify";
import { CommandBase, CommandDecorator, IPlayerObject, Types } from "inversihax";
import { CustomRole } from "../Models/CustomRole";
import { ICustomRoom } from "../Room/ICustomRoom";
import { ICustomPlayerMetadataService } from "../Services/ICustomPlayerMetadataService";

@CommandDecorator({
    names: ["auth"],
})
export class AuthenticateCommand extends CommandBase<CustomRole, ICustomPlayerMetadataService> {

    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
        @inject(Types.IPlayerMetadataService) playerMetadataService: ICustomPlayerMetadataService,
    ) {
        super(playerMetadataService);

        this.mRoom = room;
    }

    public canExecute(player: IPlayerObject): boolean {
        return true;
    }

    public execute(player: IPlayerObject, args: string[]): void {

        if (args[0] === "123") {
            const metadata = this.mPlayerMetadataService.getMetadataFor(player);
            if (!metadata.roles.has(CustomRole.SuperAdmin)) {
                metadata.roles.add(CustomRole.SuperAdmin);
                this.mRoom.setPlayerAdmin(player.id, true);
            }
        }
    }
}
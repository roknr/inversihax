import { inject } from "inversify";
import { CommandBase, CommandDecorator, IPlayerObject, Types } from "inversihax";
import { CustomRole } from "../Models/CustomRole";
import { ICustomRoom } from "../Room/ICustomRoom";
import { ICustomPlayerMetadataService } from "../Services/ICustomPlayerMetadataService";

@CommandDecorator({
    names: ["test-auth"],
})
export class TestAuthCommand extends CommandBase<CustomRole, ICustomPlayerMetadataService> {

    private readonly mRoom: ICustomRoom;

    protected mRoles = new Set([CustomRole.SuperAdmin]);

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
        @inject(Types.IPlayerMetadataService) playerMetadataService: ICustomPlayerMetadataService,
    ) {
        super(playerMetadataService);

        this.mRoom = room;
    }

    public canExecute(player: IPlayerObject): boolean {
        return this.hasRoleBasedAccess(player);
    }

    public execute(player: IPlayerObject, args: string[]): void {
        this.mRoom.sendChat("You have SuperAdmin role.", player.id);
    }
}
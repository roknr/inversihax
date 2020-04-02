import { inject, injectable } from "inversify";
import { ChatMessage, IChatMessageInterceptor, PlayerMetadataService, Types } from "inversihax";
import { ICustomRoom } from "../Room/ICustomRoom";
import { ICustomPlayerMetadataService } from "../Services/ICustomPlayerMetadataService";

@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage> {

    private readonly mRoom: ICustomRoom;
    private readonly mPlayerMetadataService: ICustomPlayerMetadataService;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
        @inject(Types.IPlayerMetadataService) playerMetadataService: ICustomPlayerMetadataService,
    ) {
        this.mRoom = room;
        this.mPlayerMetadataService = playerMetadataService;
    }

    intercept(message: ChatMessage): boolean {
        if (message.command == null || !message.command.canExecute(message.sentBy)) {
            return true;
        }

        message.broadcastForward = false;
        message.command.execute(message.sentBy, message.commandParameters);

        const playerGuid = this.mPlayerMetadataService.getMetadataFor(message.sentBy).guid;

        // this.mRoom.sendChat(`Command executed by player "${message.sentBy.name}" with id "${playerGuid}"`);

        return false;
    }
}
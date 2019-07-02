import { inject, injectable } from "inversify";
import { ChatMessage, IChatMessageInterceptor, Types } from "inversihax";
import { CustomPlayer } from "../Models/CustomPlayer";
import { ICustomRoom } from "../Room/ICustomRoom";

@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage<CustomPlayer>> {

    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
    ) {
        this.mRoom = room;
    }

    intercept(message: ChatMessage<CustomPlayer>): boolean {
        if (message.command == null || !message.command.canExecute(message.sentBy)) {
            return true;
        }

        message.broadcastForward = false;
        message.command.execute(message.sentBy, message.words);

        this.mRoom.sendChat(`Info command executed by player "${message.sentBy.name}" with id "${message.sentBy.guid}"`);

        return false;
    }
}
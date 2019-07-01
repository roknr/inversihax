import { injectable, inject } from "inversify";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";
import { IChatMessageInterceptor, ChatMessage, IRoom, Player, Types } from "inversihax";

/**
 * The interceptor that will execute the command if it exists.
 */
@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage<InversihaxPlayer>> {
    public intercept(message: ChatMessage<Player>): boolean {
        // No command or insufficient rights to invoke it, continue with next interceptor in the chain
        if (message.command == null || !message.command.canExecute(message.sentBy)) {
            return true;
        }

        // Command defined, don't broadcast forward the message and execute it
        message.broadcastForward = false;
        message.command.execute(message.sentBy, message.commandParameters);

        // And don't invoke the next interceptor
        return false;
    }
}
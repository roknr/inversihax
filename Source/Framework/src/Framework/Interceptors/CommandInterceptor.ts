import { inject, injectable } from "inversify";
import { IChatMessageInterceptor } from "../../Core/Interfaces/Interceptors/IChatMessageInterceptor";
import { ICommandManager } from "../../Core/Interfaces/Managers/ICommandManager";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { Player } from "../../Core/Models/Player";
import { Types } from "../../Core/Utility/Types";

/**
 * The command chat message interceptor that always gets invoked and sets up the chat message's command.
 */
@injectable()
export class CommandInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {

    /**
     * The room's command manager.
     */
    private readonly mCommandManager: ICommandManager;

    /**
     * Initializes a new instance of the DefaultChatMessageInterceptor class.
     * @param commandManager The room's command manager.
     */
    public constructor(
        @inject(Types.ICommandManager) commandManager: ICommandManager,
    ) {
        this.mCommandManager = commandManager;
    }

    /**
     * Intercepts and sets the chat message properties based on the RoomHostBuilder configuration.
     * @param message The chat message being sent.
     */
    public intercept(message: ChatMessage<Player>): boolean {
        // Handle command data
        this.setCommand(message);

        // Always invoke the next interceptor in the chain
        return true;
    }

    /**
     * Sets the command data for the message.
     * @param message The chat message being sent.
     */
    private setCommand(message: ChatMessage<Player>): void {
        // If the message does not represent a command (check by checking the first word of the message), do nothing
        if (!this.mCommandManager.isCommand(message.words[0])) {
            return;
        }

        // Otherwise, try to get the command and set it as the message's command if it exits
        const command = this.mCommandManager.getCommandByName(message.words[0]);

        if (command != null) {
            message.command = command;
        }
    }
}
import { inject, injectable } from "inversify";
import { IChatMessageInterceptor } from "../../Core/Interfaces/Interceptors/IChatMessageInterceptor";
import { ICommandService } from "../../Core/Interfaces/Services/ICommandService";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { Types } from "../../Core/Utility/Types";

/**
 * The command chat message interceptor that always gets invoked and sets up the chat message's command.
 */
@injectable()
export class CommandInterceptor implements IChatMessageInterceptor {

    /**
     * The room's command service.
     */
    private readonly mCommandService: ICommandService;

    /**
     * Initializes a new instance of the DefaultChatMessageInterceptor class.
     * @param commandService The room's command service.
     */
    public constructor(
        @inject(Types.ICommandService) commandService: ICommandService,
    ) {
        this.mCommandService = commandService;
    }

    /**
     * Intercepts and sets the chat message properties based on the RoomHostBuilder configuration.
     * @param message The chat message being sent.
     */
    public intercept(message: ChatMessage): boolean {
        // Handle command data
        this.setCommand(message);

        // Always invoke the next interceptor in the chain
        return true;
    }

    /**
     * Sets the command data for the message.
     * @param message The chat message being sent.
     */
    private setCommand(message: ChatMessage): void {
        // If the message does not represent a command (check by checking the first word of the message), do nothing
        if (!this.mCommandService.isCommand(message.words[0])) {
            return;
        }

        // Otherwise, try to get the command and set it as the message's command if it exits
        const command = this.mCommandService.getCommandByName(message.words[0]);

        if (command != null) {
            message.command = command;
        }
    }
}
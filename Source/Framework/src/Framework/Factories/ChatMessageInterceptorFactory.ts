import { interfaces } from "inversify";
import { IChatMessageInterceptor } from "../../Core/Interfaces/Interceptors/IChatMessageInterceptor";
import { ChatMessage } from "../../Core/Models/ChatMessage";
import { IChatMessageInterceptorFactoryType, Types } from "../../Core/Utility/Types";

/**
 * Creates the chat message interceptor factory that instantiates all registered chat message interceptors
 * from the DI container.
 * @param context The DI context.
 */
export function createChatMessageInterceptorFactory(context: interfaces.Context): IChatMessageInterceptorFactoryType {
    return () => {
        // If no interceptors were bound, return an empty array
        if (!context.container.isBound(Types.IChatMessageInterceptor)) {
            return [];
        }

        // Otherwise create all the bound interceptors and return them
        const interceptors = context
            .container
            .getAll<IChatMessageInterceptor<ChatMessage>>(Types.IChatMessageInterceptor);

        return interceptors;
    };
}
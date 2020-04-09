import { ChatMessage } from "../../Models/ChatMessage";

/**
 * Intercepts and handles chat messages.
 *
 * @type {TChatMessage} The type of chat messages to intercept.
 */
export interface IChatMessageInterceptor<TChatMessage extends ChatMessage = ChatMessage> {

    /**
     * Intercepts and handles the sent chat message. Returns true to indicate that the next interceptor should be invoked or false to
     * indicate that the next interceptor should not be invoked - effectively ending the interceptor chain.
     * @param message The chat message that is sent and to be intercepted.
     */
    intercept(message: TChatMessage): boolean;
}
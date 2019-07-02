# Chat messages and interceptors
Chat message interceptors are an Inversihax feature, an abstraction over the base Headless API way of handling chat messages. The base API provides only an event to which you can hook up to, to handle sent chat messages. It provides you with two parameters - the player object that sent the message and the actual message. The chat message interceptor system abstracts this in such a way, that no special event hook up is needed, rather, you create interceptors that intercept the messages and handle them.

## The `ChatMessage<TPlayer extends Player>` model
This is a model class that Inversihax provides as the mentioned abstraction model for chat message handling. It contains more information on the chat message being sent, including a reference to player object of the custom player type that sent the message. It provides the following properties:
- `originalMessage` - the original string message 

A chat message interceptor is merely a class that implements the `IChatMessageInterceptor`

Interceptors fully support DI. They are instantiated and called by Inversihax for each sent chat message, in the order they were registered to the DI container. Each interceptor has a way of either continuing or breaking the invocation chain - with the return value of the 

 As the name suggests, they intercept the message being sent and provide ways of manipulating the message and whether it should be broadcasted forward or not. They are called in a chain (in the order they were registered to the DI container) and each interceptor indicates whether the next one should be invoked through the `intercept()` method, which also provides intercepting logic. Also, instead of working with a `string` and an `IPlayerObject`, you are provided with a custom `ChatMessage<TPlayer>` model. The model provides more information, references to the player that sent the message of the custom player type and the command, if the room was configured to use them and it exists.

A chat message interceptor is just a regular class that implements the `IChatMessageInterceptor<TChatMessage>` interface and is decorated with the Inversify's `@injectable()` decorator. It must implement a method named `intercept(chatMessage: TChatMessage): boolean` that accepts a chat message and returns a boolean value. The return value indicates whether the next interceptor in the chain should be invoked or the chain should end. An example interceptor that executes a command and end the chain might look like so:

```ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player, IRoom, Types } from "inversihax";

@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    private readonly mRoom: IRoom<Player>;

    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        this.mRoom = room;
    }

    intercept(message: ChatMessage<Player>): boolean {
        if (message.command == null || !message.command.canExecute(message.sentBy)) {
            return true; // No command, invoke the next interceptor
        }

        // Command defined, don't broadcast forward the message and execute it
        message.broadcastForward = false;
        message.command.execute(message.sentBy, message.commandParameters);

        return false; // And don't invoke the next interceptor
    }
}
```

The command will be executed if it exists. The parameters to the `execute()` method will be the player that sent the message and the arguments he provided alongside in the message. The arguments are accessible in the `commandParameters` property on the chat message, if the message indicates a command invocation and the value is the `words` property excluding the first word which denotes the command name. The `words` are by default set by Inversihax through the `IChatMessageParser` that is injected into the `RoomBase`. By default this is the message sent split by whitespace characters, but you can provide your own custom parsing logic by registering an `IChatMessageParser` in the services module.

To have this interceptor intercept chat messages, it must be registered to the services module like so:

```ts
import { ContainerModule } from "inversify";
import { IChatMessageInterceptor, Types } from "inversihax";
import { ExecuteCommandInterceptor } from "./ExecuteCommandInterceptor.ts";

const services = new ContainerModule((bind) => {
    bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IBackgroundTask)
        .to(ExecuteCommandInterceptor)
        .inSingletonScope();
});
```
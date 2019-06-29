# Chat messages and interceptors
Chat message interceptors are an Inversihax feature, an abstraction over the base Headless API way of handling chat messages. The base API provides only an event to which you can hook up to, to handle sent chat messages. It provides you with two parameters - the player object that sent the message and the actual message. The chat message interceptor system abstracts this in such a way, that no special event hook up is needed, rather, you create interceptors that intercept the messages and handle them.

## The `ChatMessage<TPlayer extends Player>` model
This is a model class that Inversihax provides as the mentioned abstraction model for chat message handling. It contains more information on the chat message being sent, including a reference to player object of the custom player type that sent the message. It provides the following properties:
- `originalMessage: string` - the original string message that was sent. This is the value that will be broadcasted forward if configured to do so.
- `message: string` - the chat message being sent. Can be modified (NOTE - changing this won't affect the message if being broadcasted forward).
- `broadcastForward: boolean` - the flag indicating whether the (original) message should be broadcasted forward in the room. True by default.
- `sentBy: TPlayer` - the reference to the player that sent the message.
- `sentTo: TPlayer` - the reference to the player the message is meant for. This is currently not supported and will always be undefined, but the property is available for you to implement this functionality. 
- `command: ICommand<TPlayer, Role>` - the command that the message represents, if the room is configured to use commands and the message actually represents a successful command invocation.
- `isCommand: boolean` - the flag indicating whether this chat message represents a successful command invocation (checks if the `command` is set).
- `words: string[]` - the message represented as words (parsed). It is set on construction of the object. In the whole flow, Inversihax instantiates the chat message so it is responsible for setting this property. That is done through the chat message parser (further explained bellow).
- `commandParameters: string[]` - the command parameters, which are set if the `isCommand` is true. This is basically the `words` excluding the first one (as the first one is the command name).

### Chat message parsing
As mentioned in the above `words` property description, the property is set on construction. The construction of the message is done by Inversihax, so Inversihax must have some sort of logic to parse it. It does - it uses its own implementation of the `IChatMessageParser` interface - the `ChatMessageParser`. The parser provides a parse method that converts the string content to an array of strings - the words. By default Inversihax just splits the message by whitespace. The chat message parser is injected into the `RoomBase` which uses it to parse every received chat message to construct the `ChatMessage` object. If you want to use your own chat message parsing logic, you can do so by implementing your own chat message parser. Just create a class that implements the `IChatMessageParser` interface, implement your custom parsing logic and register the parser to the services module.

```ts
// CustomChatMessageParser.ts
import { ParserBase, IChatMessageParser } from "inversihax";

export class CustomChatMessageParser extends ParserBase<string[]> implements IChatMessageParser {
    public parse(content: string): string[] {
        const parsedMessage = []; // Parse the message with your logic here
        return parsedMessage;
    }
}
```

```ts
import { ContainerModule } from "inversify";
import { IChatMessageParser, Types } from "inversihax";
import { CustomChatMessageParser } from "./CustomChatMessageParser";

const services = new ContainerModule((bind) => {
    bind<IChatMessageParser>(Types.IChatMessageParser)
        .to(ChatMessageParser)
        .inTransientScope();
});
```

By implementing the parser by deriving from the `ParserBase<T>` class you don't have to decorate your class with the `@injectable()` decorator as the base class is already decorated. You would have to decorate it in case you don't derive from it.

## The `IChatMessageInterceptor<TChatMessage extends ChatMessage>` interface
A chat message interceptor is merely a class that implements the `IChatMessageInterceptor<TChatMessage extends ChatMessage>` interface. The interface provides a method that serves intercepting and handling a chat message and providing a return value that indicates whether the next interceptor in the chain should be invoked, as the chat message interceptors are invoked by Inversihax in a chain (more on that shortly). An example interceptor that does nothing but invoke the next one in the chain can look like this:

```ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player } from "inversihax";

@injectable()
export class MyInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    public intercept(message: ChatMessage<Player>): boolean {
        return true;
    }
}
```

NOTE - the interceptor class must be decorated with the `@injectable()` class decorator so it can be used with DI.

### Dependency injection
Interceptors fully support DI, meaning they are instantiated and called by Inversihax for each sent chat message, in the order they were registered to the DI container and they also provide a way of requesting dependencies through their constructor. They are registered in a request scope and instantiated for each sent chat message - meaning that if you have a service registered in request scope and you inject the service into all interceptors, then the same instance of the service will be provided to each interceptor.

```ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player } from "inversihax";

@injectable()
export class MyInterceptor1 implements IChatMessageInterceptor<ChatMessage<Player>> {
    private readonly service: IMyRequestScopeService;

    public constructor(@inject(MyTypes.MyRequestScopeService) service: IMyRequestScopeService) {
        this.service = service;
    }

    public intercept(message: ChatMessage<Player>): boolean {
        return true;
    }
}
```

```ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player } from "inversihax";

@injectable()
export class MyInterceptor2 implements IChatMessageInterceptor<ChatMessage<Player>> {
    private readonly service: IMyRequestScopeService;

    public constructor(@inject(MyTypes.MyRequestScopeService) service: IMyRequestScopeService) {
        this.service = service;
    }

    public intercept(message: ChatMessage<Player>): boolean {
        return true;
    }
}
```

Assuming that the `MyRequestScopeService` was registered in request scope, the service instance injected into `MyInterceptor1` and `MyInterceptor2` will be the same in both interceptors.

### The intercepting chain
As already mentioned, Inversihax instantiates the interceptors and calls their `intercept(chatMessage: TChatMessage): boolean` method in a chain, in the order they were registered to the container. Each interceptor has a way of either continuing or breaking the invocation chain - with the return value of the `intercept` method. The method takes the chat message being sent (of the specified type) as the argument, processes it and returns a value indicating whether the next interceptor in the chain should be invoked (`true` to invoke the next one, `false` to end the chain). 

Let's look at an example of two interceptors:

```ts
// ExecuteCommandInterceptor.ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player, IRoom, Types } from "inversihax";

@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {

    }

    public intercept(message: ChatMessage<Player>): boolean {
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

```ts
// InfoInterceptor.ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player, IRoom, Types } from "inversihax";

@injectable()
export class InfoInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    private readonly mRoom: IRoom<Player>;

    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        this.mRoom = room;
    }

    public intercept(message: ChatMessage<Player>): boolean {
        this.mRoom.sendChat("Successfully reached info interceptor");

        return false;
    }
}
```

```ts
import { ContainerModule } from "inversify";
import { IChatMessageInterceptor, Types } from "inversihax";
import { ExecuteCommandInterceptor } from "./ExecuteCommandInterceptor";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { InfoInterceptor } from "./InfoInterceptor";
import { SomeCommand } from "./SomeCommand";

SomeCommand;

const services = new ContainerModule((bind) => {
    bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor)
        .to(ExecuteCommandInterceptor)
        .inRequestScope();
    bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor)
        .to(InfoInterceptor)
        .inRequestScope();
});

const builder = new RoomHostBuilder(Startup, Room, services);
builder.useCommands().buildAndRun();
```

In this scenario, we created two interceptors - the first one that executes a command and the second one that just sends a message to the room. As we registered the first one to the services module first, that means that if a message that is a command is sent, the interceptor will return false and end the chain. If a regular message is sent, the interceptor will however return true and the chain will continue and the message will reach the second interceptor which will send a message to the room.
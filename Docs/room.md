# The `RoomBase` class and `IRoom` interface

## The `IRoom<TPlayer extends Player>`
This interface provides a contract of how a room should look like and what it should offer, alongside what player type it should work with. It is a wrapper around the base Headless API's `IRoomObject` and provides all of its events methods. Additionally, the events provide multiple handler registrations, whereas the base `IRoomObject` provides only single handler registrations.

### *The `TypedEvent<THandler>`*
This is a custom Inversihax event object, that allows multiple handler registrations. The type parameter indicates the type of handlers it should allow registering. Example of using a typed event with a type of handler that takes no parameters and returns no value:

```ts
import { TypedEvent } from "inversihax";

const event = new TypedEvent<() => void>();

// Register 2 handlers
event.addHandler(() => console.log("Handler 1"));
event.addHandler(() => console.log("Handler 2"));

// Invoke all registered handlers
// Note - pass an array of parameters of the same type as the handler's (empty array in this case
// as no expected parameters)
event.invoke([]);

// Remove all handlers
event.removeAllHandlers();

// Expected output:
//  "Handler 1"
//  "Handler 2"
```

This was an example for a type of handler that takes no parameters. If we would like to use parameters, we just need to pass them in an array to the `invoke` call:

```ts
import { TypedEvent } from "inversihax";

const event = new TypedEvent<(x: number, str: string) => void>();

let orgX = 5;
let orgStr = "test";

event.addHandler((x, str) => {
    orgX += x;
    orgStr += str;
});

// Pass an ARRAY of parameters, they must be of the same types as expected parameters and in the same order
event.invoke([10, "_test"]);

// Expected values:
// orgX == 10
// orgStr == "test_test"
```

All room events are of the `TypedEvent<THandler>` type and therefore provide support for multiple handler registrations.

## The `RoomBase<TPlayer extends Player>`
The `RoomBase<TPlayer extends Player>` class is a base room class that implements the `IRoom<TPlayer extends Player>` interface and makes it easy for you to start working with a room, since it takes care of all the initialization. It is highly recommended to inherit from this base class instead of writing up your own completely from scratch (but you can of course do that too as you just pass it to the `RoomHostBuilder` on construction).

### The constructor parameters
Here is a brief explanation of the constructor parameters that the `RoomBase` expects:
1. *`roomConfig`* - the base Headless API's room configuration - the `IRoomConfigObject`.
2. *`playerService`* - an `IPlayerService<TPlayer extends Player>`. This is a base player service that provides a method: `cast(player: IPlayerObject>): TPlayer`. This method is used for converting an `IPlayerObject` into the player type used by the room. By default, Inversihax uses its own implementation which just returns a new instance of the `Player` class with the same properties as the passed in player. It is also available in the derived room as it is marked as `protected`.
3. *`chatMessageInterceptorFactory`* - a chat message interceptor factory. This is a method that is used for instantiation of `IChatMessageInterceptor`s. It is used internally by the `RoomBase` so it is not available in the derived class.
4. *`chatMessageParser`* - an `IChatMessageParser`, which provides parsing logic for the chat messages. It is used internally when parsing chat messages, but it is also available in the derived class, if needed.

### Implementing a custom room by inheriting from the `RoomBase<TPlayer extends Player>`
Inheriting from the `RoomBase<TPlayer extends Player>` class makes it very easy to create a room. You just implement a constructor that takes the following four arguments in your derived class and pass them to the base and provide the player type argument (which can be the Inversihax default `Player` one or a custom one derived from it) like so:

```ts
import { IRoomConfigObject, RoomBase, IPlayerService, IChatMessageInterceptorFactoryFactoryType, IChatMessageParser } from "inversihax";

export class Room extends RoomBase<Player> {
    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) playerService: IPlayerService<TPlayer>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);
    }
}
```

That's it for the most simple case. You can build upon that by adding custom properties, events, methods... whatever you'd like to it. Of course you can also inject any service you'd like through the constructor. Let's create a room that keeps track of the game state inside a property:

```ts
// CustomRoom.ts
import { IRoomConfigObject, RoomBase, IPlayerService, IChatMessageInterceptorFactoryFactoryType, IChatMessageParser, Types } from "inversihax";

export class CustomRoom extends RoomBase<Player> {
    public constructor(
        @inject(Types.IRoomConfigObject) roomConfig: IRoomConfigObject,
        @inject(Types.IPlayerService) playerService: IPlayerService<TPlayer>,
        @inject(Types.IChatMessageInterceptorFactory) chatMessageInterceptorFactory: IChatMessageInterceptorFactoryType,
        @inject(Types.IChatMessageParser) chatMessageParser: IChatMessageParser,
    ) {
        super(roomConfig, playerService, chatMessageInterceptorFactory, chatMessageParser);

        // Hook up to the room events that change the game state and update it accordingly
        this.onGameStart.addHandler((byPlayer) => this.mIsGameInProgress = true);
        this.onGameStop.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGamePause.addHandler((byPlayer) => this.mIsGameInProgress = false);
        this.onGameUnpause.addHandler((byPlayer) => this.mIsGameInProgress = true);
    }

    // The private variable which we can modify to keep track of the game state
    private mIsGameInProgress: boolean = false;

    // The public property that keeps track of the game state 
    public get isGameInProgress(): boolean {
        return this.mIsGameInProgress;
    }
}
```

We have created a room that keeps track of the game state, that is only modifiable from the inside of the class, through the private variable. We hooked up to the already implemented events of the `RoomBase` class and change the state accordingly from inside the handlers. This now means that you can use this room in other modules of your application through DI and have access to the custom room property. To achieve this though, you will first want to create an interface for your custom room which extends the base `IRoom<TPlayer extends Player>`:

```ts
// ICustomRoom.ts
import { IRoom } from "inversihax";

export interface ICustomRoom extends IRoom<Player> {
    readonly isGameInProgress: boolean;
}
```

This gives you the possibility of working with properties of your `CustomRoom` class when you request the room as a dependency somewhere else, for example in a command:

```ts
// StatsCommand.ts
import { inject } from "inversify";
import { CommandBase, CommandDecorator, Types, Player } from "inversihax";
import { ICustomRoom } from "./ICustomRoom";
import { CustomRoom } from "./CustomRoom";

@CommandDecorator({
    names: ["stats"],
})
export class StatsCommand extends CommandBase<Player> {
    private readonly mRoom: ICustomRoom;

    public constructor(
        @inject(Types.IRoom) room: ICustomRoom,
    ) {
        super();
        this.mRoom = room;
    }

    public canExecute(player: Player): boolean {
        return !this.mRoom.isGameInProgress;
    }

    public execute(player: Player, args: string[]): void {
        // Show stats...
    }
}
```

In this example, we allow command execution only in the case when the game is not in progress, which we read from our room's custom property. As you can see, this makes it possible to access properties of your custom room. This would not be possible in case you were to inject an `IRoom<Player>` instead, as the custom property doesn't exist on it.
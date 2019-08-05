# Inversihax

## About
Inversihax is a [Haxball Headless API](https://github.com/haxball/haxball-issues/wiki/Headless-Host#api) framework written in Typescript that simplifies Haxball bot projects development *(credit to Basro - the creator of Haxball and the public Headless API)*.

Instead of working with the base Headless API features and types, Inversihax provides you with its own API, which is easily extendable, configurable and fully supporting dependency injection. The API provides all of the base functionality alongside custom features, such as commands, chat message interceptors, roles and more.

The primary focus of Inversihax is on inversion of control and dependency injection. To achieve this, the popular [InversifyJS](https://github.com/inversify/InversifyJS) inversion of control container is used to provide dependency injection functionality.

## Prerequisites
To use the Inversihax framework, it is highly recommended to understand the fundamentals of the dependency injection principle itself and the [InversifyJS](https://github.com/inversify/InversifyJS) API, since it is used in the core of the framework.

## Installation and configuration
To include Inversihax in your project, run:
```shell
npm install inversihax --save
```

As a prerequisite for being able to build the code, you must allow the use of `experimentalDecorators` in your project's `tsconfig.json` under the `compilerOptions` settings like so:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        ...
    }
}
```

For the code to run successfully (not throw a runtime error) you will need to `import "reflect-metadata"` at the very beginning of your code. This is a mandatory import as it is needed for dependency injection to work. Code example of where to include the statement will follow.

## Changelog
The changelog can be found [here](Docs/changelog.md).

## Getting started
This "getting started" guide provides a quick overview of the API and simple scenarios. Individual features are further explained in the [documentation](Docs/README.md) while you can find examples in the [Examples](Docs/Examples) folder. The acronym "DI" in later uses refers to "dependency injection".

### 1 Creating a room
Let's look at how to quickly set up a very simple room.

#### *a) Create a `Startup` class*
A startup class can be as simple as:

```ts
// Startup.ts
import { StartupBase, IRoom, Types } from "inversihax";

export class Startup extends StartupBase {
    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        super(room);
    }

    public configure(): void { }
}
```

This class provides a way to run custom configuration logic right after initialization. In the simplest scenario, it can be empty and requires no special logic, as long as it derives from the `StartupBase` class and provides a constructor that expects an `IRoom`. NOTE: `Types` refers to Inversihax's type identifier constants. More on that [here](Docs/dependency-injection.md).

#### *b) Create a `Room` class*
The `Room` class is the core of the bot. It wraps all of the room events and methods that the base Headless API provides and provides additional functionality. A simple room can look like this:

```ts
// Room.ts
import {
    IRoomConfigObject,
    RoomBase,
    IPlayerService,
    IChatMessageInterceptorFactoryFactoryType,
    IChatMessageParser,
    Types
} from "inversihax";

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

The `Room` should inherit from the `RoomBase<TPlayer extends Player>` class which implements the `IRoom<TPlayer extends Player>` interface. Inversihax provides a default `Player` type which wraps the base Headless API's `IPlayerObject`. It must also define a constructor that takes the above seen four arguments. Inversihax handles the last three by default, if you did not explicitly specify them when configuring the room through DI (more on that later). The only one you will have to manage is the `roomConfig` which is the Headless API's `IRoomConfigObject` and provides the room configuration.

#### *c) Create the services module*
The services module is an InversifyJS `ContainerModule` that specifies all of your type bindings that Inversify will use to resolve dependencies. As mentioned above, the simplest case for a services module requires you to specify only the room configuration:

```ts
// Services.ts
import { ContainerModule } from "inversify";
import { Types } from "inversihax";

export const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject)
        .toConstantValue({
            playerName: "Inversihax bot",
            roomName: "Test room",
            public: false,
        });
});
```

This will make the DI container resolve a type of `IRoomConfigObject` to a configuration object with the specified values.

#### *d) Use `Startup`, `Room` and the services module to create the room*
Now that we have defined the two necessary classes and the services module, we can use them to create the actual room/bot. This is done by passing them to an instance of the `RoomHostBuilder` class and then using the builder to build and run the room.

```ts
import "reflect-metadata" // This is the before mentioned import statement - it must be at the very top of your code
import { RoomHostBuilder } from "inversihax";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { services } from "./Services";

const builder = new RoomHostBuilder(Startup, Room, services);
builder.buildAndRun();
```

This will effectively start running a private room with the name of "Test room" and "Inversihax bot" as the name of the host player.

It might seem a bit overwhelming at first - why go through all this just to create a simple room? Well, the way this is set up now means that you can use dependency injection throughout your whole bot project. You can build your bot using modules that only do specific things and are not tightly coupled with each other. You just specify them as dependencies (usually through the class constructors), tag them with Inversify's `inject()` and `injectable()` decorators, provide the type bindings on initialization and let Inversihax take care of everything else. More explanation and examples will follow.

### 2 The `Player` type
As already mentioned above, Inversihax provides a custom `Player` model that wraps (implements) the base Headless API's `IPlayerObject`. It is used by default everywhere where there is a need for a player type as the base class (e.g. in the `RoomBase<TPlayer extends Player>` class), meaning you can either use this type or create your custom one by inheriting from it and using it as the player type parameter where needed. An example where we extend the base `Player` class to provide a custom property can look like this:

```ts
import { Player } from "inversihax";

export class MyPlayer extends Player {
    public isAfk: boolean;
}
```

We could then use this custom player type in the room by providing it as the type parameter: `class Room extends RoomBase<MyPlayer>`. We would then have access to the `isAfk` property on every player reference inside the room. NOTE - if using a custom player type, you will probably want to implement your own version of the `IPlayerService`. More information available [here](Docs/players-and-roles.md).

Alongside the base properties of the Headless API that the `Player` class wraps, it also contains a `roles` property (an empty `Set<TRole>` by default), which is an Inversihax feature. The `Player` class actually expects a role type parameter (`Player<TRole>`) but defaults to the base `Role` type so you don't need to worry about providing it if you do not wish to use roles.

### 3 Roles
As briefly mentioned above, Inversihax provides a role feature. The base of this feature is the `Role` abstract class. It provides two properties:
- `id` - the role identifier, a number
- `name` - the name of the role, a string

In order to use roles, you must define a class that derives from it. It is recommended to define the class like so:

```ts
import { Role } from "inversihax";

export class MyRole extends Role {
    public static readonly Admin = new MyRole(1, "admin");
    public static readonly SuperAdmin = new MyRole(2, "super-admin");

    private constructor(id: number, name: string) {
        super(id, name);
    }
}
```

Note the `private constructor` and `static readonly` properties - this is recommended because it prevents instantiation from outside the class and the static properties serve kind of like an `enum` with extra values. By doing this, you can now use the roles like so (example of checking if a player has the admin role):

```ts
function isPlayerAdmin(player: Player<MyRole>): boolean {
    return player.roles.has(MyRole.Admin);
}
```

Since the roles are static instances, you can compare them straight through references instead of, for example checking their ids or some other custom way. This is also the default way that Inversihax's compares them.

### 4 Commands
Inversihax provides a command system out of the box. All you need to do to use it is to implement your commands and set the room up to use them.

A command must derive from the `CommandBase<TPlayer extends Player>` class which implements the `ICommand<TPlayer extends Player>` interface and must also be decorated with the `@CommandDecorator()`. The `ICommand<TPlayer extends Player>` interface defines that the command must implement two methods:
- `canExecute(player: TPlayer): boolean` - returns a value indicating whether the player can execute the command
  - player - the player trying to invoke the command
- `execute(player: TPlayer, args: string[]): void` - executes the command
  - player - the player invoking the command
  - args - the arguments passed to the command

The names in the `@CommandDecorator` specify the command identifiers - what Inversihax should look for in sent chat messages to identify the command. These must be unique between and inside of each command.

Like everything else, commands are also handled by the DI container and can therefore require dependencies which will automatically be resolved. Just require them in the constructor and decorate them with the `@inject()` decorator.

A simple info command that is identified by the names "info" and "i", allows execution by anyone and echoes a message with the name of the player that invoked the command might look like this:

```ts
import { inject } from "inversify";
import { CommandBase, CommandDecorator, Types, Player, IRoom } from "inversihax";

@CommandDecorator({
    names: ["info", "i"],
})
export class InfoCommand extends CommandBase<Player> {
    private readonly mRoom: IRoom<Player>;

    public constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
    ) {
        super();
        this.mRoom = room;
    }

    public canExecute(player: Player): boolean {
        return true;
    }

    public execute(player: Player, args: string[]): void {
        this.mRoom.sendChat(`Info command invoked by player ${player.name}.`);
    }
}
```

To configure the room to use the commands, simply call the `RoomHostBuilder`'s `useCommands()` method before the `buildAndRun()`.

```ts
import { RoomHostBuilder } from "inversihax";
import { InfoCommand } from "./InfoCommand";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { services } from "./Services";

// NOTE - you probably have to import and declare the commands at the very start of your bot like so,
// depending on the way you will build the code (e.g. when using browserify), so that the commands
// will also get transpiled into JS
InfoCommand;

const builder = new RoomHostBuilder(Startup, Room, services);
builder.useCommands().buildAndRun();
```

This will set the room up to use commands - it will parse the chat messages being sent, check if the message starts with "!" (by default, can be configured otherwise) and set the command on the message being sent if the message represents an invocation of a command that exists. More info on command configuration can be found [here](Docs/commands.md). Info on how to use them follows in the next chapter.

### 5 Chat messages
The base Headless API provides an event that is fired with the message string and the player object that sent the message as parameters. Inversihax provides an abstraction over this. Instead of needing to hook up to the event, you are able to create chat message interceptors. As the name suggests, they intercept the message being sent and provide ways of manipulating the message and whether it should be broadcasted forward or not. They are called in a chain (in the order they were registered to the DI container) and each interceptor indicates whether the next one should be invoked through the `intercept()` method, which also provides intercepting logic. Also, instead of working with a `string` and an `IPlayerObject`, you are provided with a custom `ChatMessage<TPlayer extends Player>` model. The model provides more information, references to the player that sent the message of the custom player type and the command, if the room was configured to use them and it exists.

A chat message interceptor is just a regular class that implements the `IChatMessageInterceptor<TChatMessage>` interface and is decorated with the Inversify's `@injectable()` decorator. It must implement a method named `intercept(chatMessage: TChatMessage): boolean` that accepts a chat message and returns a boolean value. The return value indicates whether the next interceptor in the chain should be invoked or the chain should end. An example interceptor that executes a command and ends the chain might look like so:

```ts
import { injectable } from "inversify";
import { IChatMessageInterceptor, ChatMessage, Player, IRoom, Types } from "inversihax";

@injectable()
export class ExecuteCommandInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    private readonly mRoom: IRoom<Player>;

    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        this.mRoom = room;
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

The command will be executed if it exists. The parameters to the `execute()` method will be the player that sent the message and the arguments he provided alongside in the message. The arguments are accessible in the `commandParameters` property on the chat message, if the message indicates a command invocation and the value is the `words` property excluding the first word which denotes the command name. The `words` are by default set by Inversihax through the `IChatMessageParser` that is injected into the `RoomBase`. By default this is the message sent split by whitespace characters, but you can provide your own custom parsing logic by registering an `IChatMessageParser` in the services module.

To have this interceptor intercept chat messages, it must be registered to the services module like so:

```ts
import { ContainerModule } from "inversify";
import { IChatMessageInterceptor, Types } from "inversihax";
import { ExecuteCommandInterceptor } from "./ExecuteCommandInterceptor";

const services = new ContainerModule((bind) => {
    bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor)
        .to(ExecuteCommandInterceptor)
        .inRequestScope();
});
```

### 6 Background tasks
Inversihax also provides you a way of running things in the background asynchronously with the `IBackgroundTask` interface. Define a class that implements this interface, decorate it with the `@injectable()` decorator and provide your custom logic. You can inject anything you'd like through the constructor, the same as with other Inversihax features. An example of a background task that sends a message every 30 seconds would be:

```ts
import { inject, injectable } from "inversify";
import { IBackgroundTask, Types, IRoom, Player } from "inversihax";

@injectable()
export class MyBackgroundTask implements IBackgroundTask {
    private readonly mRoom: IRoom<Player>;

    public constructor(@inject(Types.IRoom) room: IRoom<Player>) {
        this.mRoom = room;
    }

    public start(): void {
        setInterval(() => {
            const players = this.mRoom.getPlayerList();

            let message = "";
            players.forEach((player) => message += `${player.name} `);
            this.mRoom.sendChat(message);
        }, 30000);
    }

    public stop(): void { }
}
```

To configure the background tasks no special configuration is needed other than registering it to the DI container in the services module like so:

```ts
import { ContainerModule } from "inversify";
import { IBackgroundTask, Types } from "inversihax";
import { MyBackgroundTask } from "./MyBackgroundTask.ts";

const services = new ContainerModule((bind) => {
    bind<IBackgroundTask>(Types.IBackgroundTask)
        .to(MyBackgroundTask)
        .inSingletonScope();
});
```

Recommended scope is singleton, as you can later access the object and stop the task.

---
This was a quick overview of the Inversihax framework and its features. For more information take a look at [the documentation](Docs/README.md);

## Contributions
Feel free to contribute by making your own enhancements through pull requests or creating new feature request and suggestions in the issues section.

### A word regarding development
If you want to develop, Visual Studio Code editor is recommended. Inversihax consists of two projects - the Framework and the Tests project. The Framework one contains all the framework features while the test one provides tests for it. Both can be open simultaneously with VS Code by opening the `Inversihax.code-workspace`.

#### The Framework project
The framework project contains a `tasks.json` file in the `.vscode` folder. The file contains a `Lint` task and a `Build-Watch` task. You can run the `Lint` task to lint the project or run the `Build-Watch` task to start the build/watch. This task also has has an `auto` property set to true - this is used by the [AutoLaunch](https://marketplace.visualstudio.com/items?itemName=philfontaine.autolaunch) VS Code extension which starts up the tasks that have the `auto` property set to true by default when you launch the VS Code editor - so you don't have to run the task manually.

#### The Test project
This project contains the tests for the framework and references it locally. It contains scripts for running all the tests (all files that end with `.test.ts`) inside the `package.json` and building a test bot using `browserify` (if running the script to build this bot, make sure the `dist` folder exists inside the same directory as the `package.json` as it is not registered to source control). The project also contains a `launch.json` script inside the `.vscode` folder. This file provides test debugging functionality inside VS Code - so you can set a breakpoint inside the editor and debug the tests themselves.
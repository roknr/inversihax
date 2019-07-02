# Commands
Commands are a custom Inversihax feature. They allow you to define player commands. These are classes that are decorated with the `@CommandDecorator()` and derive from the `CommandBase<TPlayer extends Player>` class which implements the `ICommand<TPlayer extends Player>` interface. They allow for a well organized player action system.

## The `ICommand<TPlayer extends Player>` interface
This interface defines a contract that enforces the implementing class to define two methods:
- `canExecute(player: TPlayer): boolean`
  - this method returns a value indicating whether the specified player should be allowed to invoke the command  
- `execute(player: TPlayer, args: string[]): void`
  - this method provides execution logic for the command by accepting the player invoking the command and the arguments that the player passed in when invoking the command

## The `CommandBase<TPlayer extends Player, TRole extends Role>` class
This is the base class for a command and commands must inherit from it. It implements the `ICommand<TPlayer extends Player>` interface through which it is also injectable. The implemented methods are marked as `abstract` as they should be implemented by the specific commands - by you. The class also provides the support for marking the command with particular roles that the commands allows invocation for. The type of roles is specified by the `TRole` type parameter, which defaults to `Role` if not specified. The roles are provided by the protected `mRoles` property, which is by default not set - you must specify the roles in the derived classes. Alongside this property, it also provides a protected method to check if a player satisfies the role conditions - `hasRoleBasedAccess(player: TPlayer): boolean`. The method returns a boolean value indicating whether the player has access to the command based on his roles. The default logic for this is a check whether the player has a role which is also specified in the command roles set, but it can be overridden in the derived class. If the command does not specify roles, it is assumed that no roles are necessary for the command invocation.

## The `@CommandDecorator()`
This is a class decorator that denotes a command and provides metadata to it by accepting an object of `ICommandMetadata`. The metadata contains the command names which serve as commands identifiers. These must be unique inside of and between each command - a single command cannot have duplicate names and two commands cannot have duplicated names.

```ts
// Invalid example 1

@CommandDecorator({
    names: ["command", "command"]
})
export class Command extends CommandBase<Player> {
    ...
}
```

```ts
// Invalid example 2

@CommandDecorator({
    names: ["command"]
})
export class Command1 extends CommandBase<Player> {
    ...
}

@CommandDecorator({
    names: ["command"]
})
export class Command2 extends CommandBase<Player> {
    ...
}
```

```ts
// Valid example

@CommandDecorator({
    names: ["command1", "c1"]
})
export class Command1 extends CommandBase<Player> {
    ...
}

@CommandDecorator({
    names: ["command2", "c2"]
})
export class Command2 extends CommandBase<Player> {
    ...
}
```

## Dependency injection with commands
You can use dependency injection with commands. This allows you to inject necessary dependencies through the constructor and use them:

```ts
import { CommandDecorator, CommandBase, Player, Types, IRoom } from "inversihax";
import { MyTypes } from "./MyTypes";
import { MyService } from "./MyService";
import { IMyService } from "./IMyService";

@CommandDecorator({
    names: ["test"]
})
export class TestCommand extends CommandBase<Player> {
    private readonly mRoom: IRoom<Player>;
    private readonly mMyService: IMyService;
    
    public constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
        @inject(MyTypes.IMyService) myService: IMyService,
    ) {
        super();
        this.mRoom = room;
        this.mMyService = myService;
    }

    public canExecute(player: TPlayer): boolean {
        return this.myService.canPlayerDoSomething(player);
    }

    public execute(player: TPlayer, args: string[]): void {
        this.mRoom.sendChat("Executing test command");
        this.mMyService.doSomething(player, args[0]);
    }
}
```

You can inject any service that you (or Inversihax) registered in the services module at room initialization.

## Example command with roles
The following is a command that works with a custom player type and uses roles:

```ts
import { inject } from "inversify";
import { CommandBase, Types, IRoom, CommandDecorator } from "inversihax";
import { CustomPlayer } from "./CustomPlayer";
import { CustomRole } from "./CustomRole";

@CommandDecorator({
    names: ["command"]
})
export class CustomCommand extends CommandBase<CustomPlayer, CustomRole> {
    private readonly mRoom: IRoom<CustomPlayer>;

    protected mRoles = new Set([CustomRole.Admin, CustomRole.SuperAdmin, CustomRole.Owner]);
    
    public constructor(
        @inject(Types.IRoom) room: IRoom<CustomPlayer>,
    ) {
        super();
        this.mRoom = room;
    }

    public canExecute(player: TPlayer): boolean {
        return this.hasRoleBasedAccess(player) && player.isRegistered;
    }

    public execute(player: TPlayer, args: string[]): void {
        this.mRoom.sendChat("Successfully executed command with custom player type and roles.");
    }
}
```

As you can see, by providing the type arguments to the command for the player and the role, we are able to access their specific properties.

## Command configuration
To configure the commands you must do so with the `RoomHostBuilder` on room initialization. You call the builder's `useCommands()` method, to which you can pass optional parameters. The method accepts three optional parameters:
- *`caseSensitive`* - indicates whether Inversihax should compare names using case sensitivity, `false` by default.
- *`prefix`* - the prefix to use for commands, indicates the string prefix Inversihax should look for when identifying a command.
- *`customCommandServiceType`* - the type to use as the commands service. Inversihax by default uses its own implementation of a command service (which implements the `ICommandService`). It is recommended to use the Inversihax default one, but you can specify your custom one here if you'd like to use your own.

```ts
import { RoomHostBuilder } from "inversihax";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { services } from "./Services";
import { MyCommandService } from "./MyCommandService";

const builder = new RoomHostBuilder(Startup, Room, services);
builder
    .useCommands(
        true,   // Inversihax will compare names with case sensitivity
        "!!",   // The command prefix will be "!!" when looking for a command invocation
        MyCommandService    // The service used by Inversihax for command identification and instantiation will be a custom command service
    ).buildAndRun();
```

Inverishax would in this case (if we assume we're using commands from the above valid example) identify the following as commands:

- `!!command1 example`
- `!!c1 another example`
- `!!command2 another`
- `!!c2 ...`

It would NOT identify the following:
- `!!COMMAND1 example`
- `!!C1 another example`
- `!!CoMMaNd2 another`
- `!c2 ...`

### The `ICommandService`
This is the interface that defines command service functionality. The service is expected to provide methods for indicating whether a string indicates a command invocation and another one that returns an `ICommand` for a given string (name). So if you'd like to implement your own, you could do something like:

```ts
// MyCommandService.ts
import { ICommandService, ICommand, Player } from "inversihax";

export class MyCommandService implements ICommandService {
    public isCommand(word: string): boolean {
        // Provide your logic
    }

    public getCommandByName(name: string): ICommand<Player> {
        // Provide your logic
    }
}
```

You would then use this specific command service when configuring the room as shown in the above code example - by providing it as the third parameter to the `useCommands()` method.

Note - this is only an example that shows that you can create your own command service. The command service is then used by the `RoomBase` to instantiate commands as necessary. It is however recommended to use the Inversihax's own `CommandService`, rather than implement your own.

## Declaring commands
Depending on the way you build your project and transpile it into JS, you will probably want to/need to declare your commands at the very beginning of your starting point - before you use the `RoomHostBuilder` like so:

```ts
import { RoomHostBuilder } from "inversihax";
import { TestCommand } from "./TestCommand";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { services } from "./Services";

TestCommand; // Declaration here

const builder = new RoomHostBuilder(Startup, Room, services);
builder.useCommands().buildAndRun();
```

This is because your command is not explicitly referenced anywhere. It is discovered, registered to the DI container and used by Inversihax through the decorator. The decorator registers it to the global `Reflect` object and Inversihax reads the command metadata from that object - this is why it has to run (be declared) at the very beginning - so that the decorator can do its job before Inversihax.

## Using commands
Inversihax does not execute the command itself, it merely sets it on the `ChatMessage` object. It is up to you to call the command, with the correct parameters. This can be achieved by implementing a chat message interceptor, in which you handle command invocation. Further explanation is available [here](./chat-messages-and-interceptors.md).
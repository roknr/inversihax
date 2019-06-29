# Players and roles

## Roles
`Role`s are an Inversihax feature that provides you a way of using roles in your application - you can assign them to players and commands.

A `Role` is an Inversihax class that encapsulates two properties:
- `id` - a number which serves as the role's identifier
- `name` - the name for the role

The class also overrides the `toString()` method to return the role's `name` property. `Role` is an abstract class, which means you must inherit from it to use roles.

### Using roles
To use roles you must create a class that inherits from the `Role` class, as it is abstract and you cannot create instances of it. The recommended way of implementation is to make your class' constructor private - that way, no instances can be created from outside the class. The next thing is to define the roles you want to use as `static readonly` properties, so they can be accessed like `enum` values and cannot be changed. Additionally, you can implement the class in a way so that it can contain more information (by implementing additional properties).

```ts
import { Role } from "inversihax";

export class CustomRole extends Role {
    public static readonly Player = new MyRole(1, "player", 10);
    public static readonly Admin = new MyRole(2, "admin", 50);
    public static readonly SuperAdmin = new MyRole(3, "super-admin", 90);
    public static readonly Owner = new MyRole(4, "owner", 100);

    public readonly weight: number;

    private constructor(id: number, name: string, weight: number) {
        super(id, name);
        this.weight = weight;
    }
}
```

By using this approach, comparison of roles is reference based, meaning you can compare the objects themselves, instead of comparing for example their ids. This is also the default way that Inversihax compares them.

## The `Player` class
The `Player` class is a model which wraps (inherits from) the base Headless API's `IPlayerObject`. It  therefore provides the same properties, alongside a custom Inversihax feature and property - the roles. By default, Inversihax uses this model everywhere it expects a Player type, but you can implement and use your own. The class also expects a roles type argument, but uses the `Role` class by default so you can omit it if you do not wish to use them or the base `Role` class is enough.

### Creating a custom `Player`
You can easily extend the base `Player` class by simply inheriting from it. And by providing a type argument to use custom roles:

```ts
// CustomPlayer.ts
import { Player } from "inversihax";
import { CustomRole } from "./CustomRole";

export class CustomPlayer extends Player<CustomRole> {
    public isAfk: boolean;
    public isRegistered: boolean;
    public stats: IStats;
    ...
}
```

You can then use this custom type wherever Inversihax expects the `Player` type by providing it as the type argument...

... in you room:

```ts
import { RoomBase } from "inversihax";
import { CustomPlayer } from "./CustomPlayer";

export class Room extends RoomBase<CustomPlayer> {
    ...
}
```

... in your commands:

```ts
import { RoomBase, CommandDecorator } from "inversihax";
import { CustomPlayer } from "./CustomPlayer";

@CommandDecorator({
    names: ["command"]
})
export class MyCommand extends CommandBase<CustomPlayer> {
    ...
}
```

### Conversion from `IPlayerObject` type to the custom player type
The base Headless API only works with the base `IPlayerObject` interface, so Inversihax must provide a way to cast that object to an object of the specified player type. For this reason, the `IPlayerService<TPlayer extends Player>` exists which provides a `cast(player: IPlayerObject): TPlayer` method that casts the base player object to a `TPlayer`. The service is required as a dependency in the `RoomBase` so that the room can internally call the method to convert the player to the specified type. By default, Inversihax provides its own implementation of the `IPlayerService`, which just creates a new instance of the `Player` class and returns it. Meaning, if you want to somehow keep track of the player references, you will have to provide your own implementation of the interface and provide custom logic.

```ts
import { IPlayerService } from "inversihax";
import { CustomPlayer } from "./CustomPlayer";

export class MyPlayerService implements IPlayerService<CustomPlayer> {
    public cast(player: IPlayerObject): CustomPlayer {
        // Provide your logic here
        return ...
    }
}
```

To use your custom implementation instead of the default Inversihax one simply register it to the services module in initialization:

```ts
import { ContainerModule } from "inversify";
import { RoomHostBuilder, Types, IPlayerService } from "inversihax";
import { Startup } from "./Startup";
import { Room } from "./Room";
import { CustomPlayerService } from "./CustomPlayerService";

const services = new ContainerModule((bind) => {
    bind<IPlayerService>(Types.IPlayerService)
        .to(CustomPlayerService)
        .inSingletonScope();
});

const builder = new RoomHostBuilder(Startup, Room, services);
builder.buildAndRun();
```

A thing to note - since the `RoomBase` requires the player service as its dependency, that means that the reference to the service inside the room will be a single instance, since the `RoomBase` is a singleton, even if you'd register the service as transient, for example.
# Inversihax and dependency injection

## Introduction
To use Inversihax it is highly recommended to understand the fundamentals of the dependency injection principle, as it is the framework's main feature and everything is based on it. You can find information on it on the web (e.g. [wikipedia](https://en.wikipedia.org/wiki/Dependency_injection)), while the [InversifyJS GitHub site](https://github.com/inversify/InversifyJS) provides documentation and examples on how to use Inversify itself. Since Inversihax is using InversifyJS as its inversion of control container, it is highly recommended to be familiar with the InversifyJS API.

## Motivation
The motivation behind basing the whole framework on dependency injection is in making it possible to write your application in smaller, more organized pieces where one piece is not tightly coupled with another and each piece has a specific purpose, so the concerns of your application are separated.

## Using DI in Inversihax
Most classes in Inversihax support dependency injection. Those that do not are the models (like the `Player` and `ChatMessage` classes) and the `RoomHostBuilder`.

### Type identifiers
The ones that do support DI have their identifiers set in an object called `Types` (this is an Inversify feature, see [here](https://github.com/inversify/InversifyJS/blob/master/wiki/symbols_as_id.md) for more details). The Inversihax identifiers inside the `Types` object are `Symbol`s, as recommended by Inversify. If you need to work with any Inversihax types and features, you can find their identifiers in the mentioned `Types` object. If you are working with your own, it is recommended that you define your own object that will hold your `Symbol` identifiers. Example usage of Inversihax identifiers when binding types on initialization:

```ts
import { ContainerModule } from "inversify";
import { IPlayerService, Types } from "inversihax";

const services = new ContainerModule((bind) => {
    bind<IPlayerService>(Types.IPlayerService)
        .to(MyPlayerService)
        .inSingletonScope();
});
```

Identifiers are also used when requiring the services as dependencies:

```ts
...
public constructor(@inject(Types.IPlayerService)) {

}
...
```

For Inversify to be able to instantiate the dependencies, they must be marked with the `@injectable()` decorator, which is an Inversify feature. Identifiers however are not needed here:

```ts
import { injectable } from "inversify"

@injectable()
export class PlayerService {
    ...
}
```

### Lifetime scopes
Scopes are a feature of the DI principle, so they won't be explained here in detail. More information on scopes (specifically on the InversifyJS scopes) can be found [here](https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md). The types that Inversihax binds by default are registered in different lifetime scopes. They are as follows:
- `IRoom` - is a singleton. There can only be one instance of the room, which is obtained from the base Headless API's `HBInit()` method call.
- `IChatMessageInterceptor`s - have a request scope lifetime. They are created per sent message.
- `ICommand`s - have a request scope. They are created per command invocation.
- `IBackgroundTask`s - there are none by default from the Inversihax side, but they are recommended to be singleton objects. One instance is then created per concrete implementation of the interface.
- `IChatMessageParser`s - have a transient scope.
- `IPlayerService` - is a singleton. Since it is a dependency of the `RoomBase`, it makes the most sense. It can therefore also be used to save states.
- `ICommandService` - has a request scope.
- `Startup` - has no real scope - it will be created only once through the DI container and after the binding will be unregistered.

The above list means that you can inject any class you register to the services module to any implementation of the above interfaces (e.g. to your room class, to any of your commands, background tasks etc.).
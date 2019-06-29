# Background tasks
Inversihax provides a way of running asynchronous background tasks with the `IBackgroundTask` interface. The interface provides two methods:
- `start(): void` - provides a way of starting the background task
- `stop(): void` - provides a way of stopping the background task

To implement a background task you must define a class that implements the `IBackgroundTask` interface and decorate the class with the `@injectable()` class decorator. As with other Inversihax features, background tasks fully support DI so you can inject needed dependencies through the constructor.

Configuring the background tasks requires no special configuration apart from registering it to the DI container in the services module on initialization.

Inversihax starts all background tasks immediately after room initialization. This means right after the `Startup`'s `configure()` method gets called.

An example of a background task that sends a message every 30 seconds would be:

```ts
// MyBackgroundTask.ts
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

... and its configuration:

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

As mentioned above, the interface provides  a `stop()` method, but it is currently not used by Inversihax. You could make use of it yourself if you wanted to - if registering the task in singleton scope, you could require it somewhere as a dependency and call the method to stop the task.
# The `Startup` class
The startup class serves as a place to request dependencies from the DI container and to configure anything that needs configuring. For this purpose, the `configure(): void` method must be implemented. This method gets called by Inversihax right after the room has been created and initialized. The room is a mandatory dependency so you must supply it as a constructor parameter and pass it on to the base.

Say you created some services that need configuring right at the very beginning. You can inject them into the startup class and configure them:

```ts
import { StartupBase, Types } from "inversihax";
import { MyTypes } from "./MyTypes";
import { IMyService1, IMyService2, MyService1, MyService2 } from "./MyServices";

export class Startup extends StartupBase {
    private readonly mMyService1: IMyService1;
    private readonly mMyService2: IMyService2;

    public constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
        @inject(MyTypes.IMyService1) myService1: IMyService1,
        @inject(MyTypes.IMyService2) myService2: IMyService2,
    ) {
        super(room);
        this.mMyService1 = myService1;
        this.mMyService2 = myService2;
    }

    public configure(): void {
        this.mMyService1.configure();
        this.mMyService2.configure();
    }

}
```

*The example assumes there are two interfaces (`IMyService1`, `IMyService2`) and concrete implementations of those (`MyService1`, `MyService2`) that both provide a `configure()` method and that the services were registered to the services module with the corresponding identifiers (`MyTypes.IMyService1`, `MyTypes.IMyService2`).*

Only a single instance of the `Startup` class will be created. It will (obviously) be created by the DI container and will be unregistered from the container right after the `configure()` method is called.
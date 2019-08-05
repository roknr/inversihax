// tslint:disable
import "reflect-metadata";
import { ContainerModule } from "inversify";
import { IPlayerService, IRoomConfigObject, RoomHostBuilder, Types, IBackgroundTask, IChatMessageInterceptor, ChatMessage } from "inversihax";
import { CustomPlayer } from "./Models/CustomPlayer";
import { CustomRoom } from "./Room/CustomRoom";
import { CustomPlayerService } from "./Services/CustomPlayerService";
import { Startup } from "./Startup";
import { InfoBackgroundTask } from "./BackgroundTasks/InfoBackgroundTask";
import { ExecuteCommandInterceptor } from "./Interceptors/ExecuteCommandInterceptor";
import { PhysicsCommand } from "./Commands/PhysicsCommand";
import { InfoCommand } from "./Commands/InfoCommand";
// tslint:enable

// List of all commands, must be here because using browserify to bundle everything for the browser and it needs the commands
// to be referenced at the very beginning in order for the command decorator to be able to apply the metadata to them
// TODO: maybe find a better way of bundling everything up for the browser, however, this is up to the user of the framework...
PhysicsCommand;
InfoCommand;

const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject)
        .toConstantValue({
            playerName: "Host",
            roomName: "Test room",
            public: false,
            noPlayer: true,
        });

    bind<IPlayerService<CustomPlayer>>(Types.IPlayerService)
        .to(CustomPlayerService)
        .inSingletonScope();

    bind<IBackgroundTask>(Types.IBackgroundTask)
        .to(InfoBackgroundTask)
        .inSingletonScope();

    bind<IChatMessageInterceptor<ChatMessage<CustomPlayer>>>(Types.IChatMessageInterceptor)
        .to(ExecuteCommandInterceptor)
        .inRequestScope();
});

new RoomHostBuilder(Startup, CustomRoom, services)
    .useCommands(true)
    .buildAndRun();
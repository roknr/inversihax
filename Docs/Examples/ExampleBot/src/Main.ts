import "reflect-metadata";  // This MUST be the first import - it is mandatory for dependency injection to work
import {
    RoomHostBuilder, IRoomConfigObject, Types, IChatMessageInterceptor,
    ChatMessage, IBackgroundTask, IPlayerService,
} from "inversihax";
import { Startup } from "./Startup";
import { InversihaxRoom } from "./InversihaxRoom";
import { ContainerModule } from "inversify";
import { GiveAdminCommand } from "./Commands/GiveAdminCommand";
import { ExecuteCommandInterceptor } from "./Interceptors/ExecuteCommandInterceptor";
import { InversihaxPlayer } from "./Models/InversihaxPlayer";
import { InfoBackgroundTask } from "./BackgroundTasks/InfoBackgroundTask";
import { InversihaxPlayerService } from "./Services/InversihaxPlayerService";

// Command declarations - so that the decorator can register the commands to the global Reflect object
GiveAdminCommand;

// Our services module - we provide all the type bindings here for dependency injection
const services = new ContainerModule((bind) => {
    // Bind the room configuration
    bind<IRoomConfigObject>(Types.IRoomConfigObject)
        .toConstantValue({
            playerName: "Inversihax bot",
            roomName: "Inversihax example room",
        });

    // Bind chat message interceptors
    bind<IChatMessageInterceptor<ChatMessage<InversihaxPlayer>>>(Types.IChatMessageInterceptor)
        .to(ExecuteCommandInterceptor)
        .inRequestScope();

    // Bind background tasks
    bind<IBackgroundTask>(Types.IBackgroundTask)
        .to(InfoBackgroundTask)
        .inSingletonScope();

    // Bind services
    bind<IPlayerService<InversihaxPlayer>>(Types.IPlayerService)
        .to(InversihaxPlayerService)
        .inSingletonScope();
});

// We create the room builder with our custom types and services module
const builder = new RoomHostBuilder(Startup, InversihaxRoom, services);
builder
    .useCommands(true) // let's use commands by making their names case sensitive and using the default prefix "!"
    .buildAndRun(); // let's build and run our bot
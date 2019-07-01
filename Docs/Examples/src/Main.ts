import { RoomHostBuilder, IRoomConfigObject, Types, IChatMessageInterceptor, ChatMessage } from "inversihax";
import { Startup } from "./Startup";
import { InversihaxRoom } from "./InversihaxRoom";
import { ContainerModule } from "inversify";
import { GiveAdminCommand } from "./Commands/GiveAdminCommand";
import { ExecuteCommandInterceptor } from "./Interceptors/ExecuteCommandInterceptor";
import { InversihaxPlayer } from "./Models/InversihaxPlayer";

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
});

// We create the room builder with our custom types and services module
const builder = new RoomHostBuilder(Startup, InversihaxRoom, services);
builder
    .useCommands(true) // let's use commands by making their names case sensitive and using the default prefix "!"
    .buildAndRun(); // let's build and run our bot
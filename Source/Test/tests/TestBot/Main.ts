// tslint:disable
import "reflect-metadata";
import { ContainerModule } from "inversify";
import { IPlayerMetadataService, IRoomConfigObject, RoomHostBuilder, Types, IBackgroundTask, IChatMessageInterceptor, ChatMessage } from "inversihax";
import { CustomPlayerMetadata } from "./Models/CustomPlayerMetadata";
import { CustomRoom } from "./Room/CustomRoom";
import { CustomPlayerMetadataService } from "./Services/CustomPlayerMetadataService";
import { Startup } from "./Startup";
import { InfoBackgroundTask } from "./BackgroundTasks/InfoBackgroundTask";
import { ExecuteCommandInterceptor } from "./Interceptors/ExecuteCommandInterceptor";
import { PhysicsCommand } from "./Commands/PhysicsCommand";
import { InfoCommand } from "./Commands/InfoCommand";
import { AuthenticateCommand } from "./Commands/AuthenticateCommand";
import { TestAuthCommand } from "./Commands/TestAuthCommand";
// tslint:enable

// List of all commands, must be here because using browserify to bundle everything for the browser and it needs the commands
// to be referenced at the very beginning in order for the command decorator to be able to apply the metadata to them
// TODO: maybe find a better way of bundling everything up for the browser, however, this is up to the user of the framework...
PhysicsCommand;
InfoCommand;
AuthenticateCommand;
TestAuthCommand;

const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject)
        .toConstantValue({
            playerName: "Host",
            roomName: "Test room",
            public: false,
            noPlayer: false,
        });

    bind<IPlayerMetadataService>(Types.IPlayerMetadataService)
        .to(CustomPlayerMetadataService)
        .inSingletonScope();

    bind<IBackgroundTask>(Types.IBackgroundTask)
        .to(InfoBackgroundTask)
        .inSingletonScope();

    bind<IChatMessageInterceptor<ChatMessage>>(Types.IChatMessageInterceptor)
        .to(ExecuteCommandInterceptor)
        .inRequestScope();
});

new RoomHostBuilder(Startup, CustomRoom, services)
    .useCommands(true)
    .buildAndRun();
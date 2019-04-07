import { inject } from "inversify";
import "reflect-metadata";
import { IRoomConfigObject } from "types-haxball-headless-api";
import { Room, RoomHostBuilder, StartupBase } from "types-haxframework";
import { IRoom, Types } from "types-haxframework-core";

class Startup extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: IRoom,
    ) {
        super();
    }

    configure(): void {

    }
}

const builder = new RoomHostBuilder();
builder.configureServices((container) => {
    container.bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
});
builder.buildAndRun<Startup>(Startup, Room);
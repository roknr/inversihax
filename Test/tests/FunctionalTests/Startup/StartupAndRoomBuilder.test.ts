import { expect } from "chai";
import "mocha";
import "reflect-metadata";
import { IRoomConfigObject } from "types-haxball-headless-api";
import { PlayerManager, RoomHostBuilder, StartupBase } from "types-haxframework";
import { IPlayerManager, IRoom, Player, Types } from "types-haxframework-core";
import { StartupTest } from "./StartupTest";
import { TestRoom } from "./TestRoom";

// TODO: improve this test...

// Create a test room, bind a mock room config object and start it
const builder = new RoomHostBuilder<StartupBase<Player>, Player>(StartupTest, TestRoom);
builder.setConfigureServicesAction((container) => {
    container.bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
    container.bind<IPlayerManager<Player>>(Types.IPlayerManager).to(PlayerManager).inSingletonScope();
}).buildAndRun();

describe("Starting up and building the room", function () {
    it("Should work properly by using dependency injection", function () {
        const results = [];
        const testPlayer1 = {
            id: 1,
        };
        const testPlayer2 = {
            id: 3,
        };

        const room = builder.container.get<IRoom<Player>>(Types.IRoom);
        results.push(room.onPlayerChat(testPlayer1 as any, null));
        results.push(room.onPlayerChat(testPlayer2 as any, null));

        expect(results).to.have.all.members([false, true]);
    });
});
import { expect } from "chai";
import "mocha";
import "reflect-metadata";
import { IRoomConfigObject } from "types-haxball-headless-api";
import { RoomHostBuilder } from "types-haxframework";
import { IRoom, Types } from "types-haxframework-core";
import { StartupTest } from "./StartupTest";
import { TestRoom } from "./TestRoom";

// TODO: improve this test...

// Create a test room, bind a mock room config object and start it
const builder = new RoomHostBuilder();
builder.configureServices((container) => {
    container.bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
});
builder.buildAndRun<StartupTest>(StartupTest, TestRoom);

describe("Starting up and building the room", function() {
    it("Should work properly by using dependency injection", function() {
        const results = [];
        const testPlayer1 = {
            id: 1,
        };
        const testPlayer2 = {
            id: 3,
        };

        const room = builder.container.get<IRoom>(Types.IRoom);
        results.push(room.onPlayerChat(testPlayer1 as any, null));
        results.push(room.onPlayerChat(testPlayer2 as any, null));

        expect(results).to.have.all.members([false, true]);
    });
});
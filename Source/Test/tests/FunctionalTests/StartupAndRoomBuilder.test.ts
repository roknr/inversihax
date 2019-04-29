import { expect } from "chai";
import "mocha";
import "reflect-metadata";
import { IRoomConfigObject } from "types-haxball-headless-api";
import { IPlayerManager, IRoom, Player, PlayerManager, RoomHostBuilder, StartupBase, Types } from "types-haxframework";
import { CustomTestRoom, ICustomTestRoom } from "./Rooms/CustomTestRoom";
import { StartupTest } from "./Startups/StartupTest";

// TODO: improve this test...

describe("RoomHostBuilder", function () {
    describe("Starting up and building the room", function () {
        it("Should work properly by using dependency injection with default IRoom", function () {
            // Create a test room, bind a mock room config object and start it
            const builder = new RoomHostBuilder<StartupBase>(StartupTest, CustomTestRoom);
            builder.setConfigureServicesAction((container) => {
                container.bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
                container.bind<IPlayerManager<Player>>(Types.IPlayerManager).to(PlayerManager).inSingletonScope();
            }).buildAndRun();

            const results = [];
            const testPlayer1 = { id: 1 };
            const testPlayer2 = { id: 3 };

            const room = builder.container.get<IRoom<Player>>(Types.IRoom);
            results.push(room.onPlayerChat(testPlayer1 as any, null));
            results.push(room.onPlayerChat(testPlayer2 as any, null));

            expect(results).to.have.all.members([false, true]);
        });

        it("Should work properly by using dependency injection with custom IRoom", function () {
            // Create a custom test room, bind a mock room config object and start it
            const builder = new RoomHostBuilder<StartupBase>(StartupTest, CustomTestRoom);
            builder.setConfigureServicesAction((container) => {
                container.bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
                container.bind<IPlayerManager<Player>>(Types.IPlayerManager).to(PlayerManager).inSingletonScope();
            }).buildAndRun();

            const room = builder.container.get<ICustomTestRoom>(Types.IRoom);

            expect(room.isGameInProgress).to.be.false;

            room.startGame();
            expect(room.isGameInProgress).to.be.true;

            room.pauseGame(true);
            expect(room.isGameInProgress).to.be.false;
        });
    });
});
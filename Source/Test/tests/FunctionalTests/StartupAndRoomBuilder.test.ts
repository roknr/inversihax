// tslint:disable
import "reflect-metadata";
import { expect } from "chai";
import { ContainerModule } from "inversify";
import { IPlayerService, IRoom, Player, PlayerService, RoomHostBuilder, StartupBase, Types } from "inversihax";
import "mocha";
import { IRoomConfigObject } from "types-haxball-headless-api";
import { CustomTestRoom, ICustomTestRoom } from "./Rooms/CustomTestRoom";
import { StartupTest } from "./Startups/StartupTest";
// tslint:enable

// TODO: improve this test...

const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
    bind<IPlayerService<Player>>(Types.IPlayerService).to(PlayerService).inSingletonScope();
});

describe("RoomHostBuilder", function () {
    describe("Starting up and building the room", function () {
        it("Should work properly by using dependency injection with default IRoom", function () {
            // Create a test room, bind a mock room config object and start it
            const builder = new RoomHostBuilder(StartupTest, CustomTestRoom, services);
            builder.buildAndRun();

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
            const builder = new RoomHostBuilder(StartupTest, CustomTestRoom, services);
            builder.buildAndRun();

            const room = builder.container.get<ICustomTestRoom>(Types.IRoom);

            expect(room.isGameInProgress).to.be.false;

            room.startGame();
            expect(room.isGameInProgress).to.be.true;

            room.pauseGame(true);
            expect(room.isGameInProgress).to.be.false;
        });
    });
});
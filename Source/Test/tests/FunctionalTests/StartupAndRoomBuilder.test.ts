// tslint:disable
import "reflect-metadata";
import { expect } from "chai";
import { ContainerModule, injectable } from "inversify";
import {
    IRoomConfigObject,
    IPlayerService,
    IRoom,
    Player,
    PlayerService,
    RoomHostBuilder,
    Types, CommandBase,
    CommandDecorator,
    IChatMessageInterceptor,
    ChatMessage
} from "inversihax";
import "mocha";
import { CustomTestRoom, ICustomTestRoom } from "./Rooms/CustomTestRoom";
import { StartupTest } from "./Startups/StartupTest";
import { getContainer } from "../Utilities";
import { CommonStartupTest } from "./Startups/CommonStartupTest";
// tslint:enable

// TODO: improve this test...

// A test interceptor that executes commands
@injectable()
class CommandExecutionInterceptor implements IChatMessageInterceptor<ChatMessage<Player>> {
    intercept(message: ChatMessage<Player>): boolean {
        if (message.isCommand && message.command.canExecute(message.sentBy)) {
            message.command.execute(message.sentBy, message.commandParameters);
        }
        return true;
    }
}

// A test command
@CommandDecorator({
    names: ["TeSt", "T"],
})
class TestCommand extends CommandBase<Player> {
    public static checkNameTestCI: boolean = false;
    public static checkNameTCI: boolean = false;
    public static checkNameTestCS: boolean = false;
    public static checkNameTCS: boolean = false;
    canExecute(player: Player): boolean { return true; }
    execute(player: Player, args: string[]): void {
        if (args[0] === "test") {
            TestCommand.checkNameTestCI = true;
        }
        else if (args[0] === "t") {
            TestCommand.checkNameTCI = true;
        }
        else if (args[0] === "TeSt") {
            TestCommand.checkNameTestCS = true;
        }
        else if (args[0] === "T") {
            TestCommand.checkNameTCS = true;
        }
    }
}

const services = new ContainerModule((bind) => {
    bind<IRoomConfigObject>(Types.IRoomConfigObject).toConstantValue({});
    bind<IPlayerService<Player>>(Types.IPlayerService).to(PlayerService).inSingletonScope();
    bind<IChatMessageInterceptor<ChatMessage<Player>>>(Types.IChatMessageInterceptor).to(CommandExecutionInterceptor).inRequestScope();
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

            const container = getContainer(builder);

            const room = container.get<IRoom<Player>>(Types.IRoom);
            results.push(room.onPlayerChat(testPlayer1 as any, null));
            results.push(room.onPlayerChat(testPlayer2 as any, null));

            expect(results).to.have.all.members([false, true]);
        });

        it("Should work properly by using dependency injection with custom IRoom", function () {
            // Create a custom test room, bind a mock room config object and start it
            const builder = new RoomHostBuilder(StartupTest, CustomTestRoom, services);
            builder.buildAndRun();

            const container = getContainer(builder);

            const room = container.get<ICustomTestRoom>(Types.IRoom);

            expect(room.isGameInProgress).to.be.false;

            room.startGame();
            expect(room.isGameInProgress).to.be.true;

            room.pauseGame(true);
            expect(room.isGameInProgress).to.be.false;
        });
    });

    describe("Using commands", function () {
        it("Should use case insensitive names by default", function () {
            const builder = new RoomHostBuilder(CommonStartupTest, CustomTestRoom, services);
            builder.useCommands()
                .buildAndRun();

            const container = getContainer(builder);

            const room = container.get<IRoom<Player>>(Types.IRoom);

            room.onPlayerChat(null, "!test test");
            room.onPlayerChat(null, "!t t");

            // Wait a bit since it's asynchronous
            this.timeout(1000);

            expect(TestCommand.checkNameTestCI).to.be.true;
            expect(TestCommand.checkNameTCI).to.be.true;
        });

        describe("Using commands", function () {
            it("Should use case sensitive names when configured to do so", function () {
                const builder = new RoomHostBuilder(CommonStartupTest, CustomTestRoom, services);
                builder.useCommands(true)
                    .buildAndRun();

                const container = getContainer(builder);

                const room = container.get<IRoom<Player>>(Types.IRoom);

                room.onPlayerChat(null, "!TeSt TeSt");
                room.onPlayerChat(null, "!t t");

                // Wait a bit since it's asynchronous
                this.timeout(1000);

                expect(TestCommand.checkNameTestCS).to.be.true;
                expect(TestCommand.checkNameTCS).to.be.false;
            });
        });
    });
});
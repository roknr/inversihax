import { expect } from "chai";
import { inject } from "inversify";
import "mocha";
import "reflect-metadata";
import { IRoomConfigObject, IRoomObject } from "types-haxball-headless-api";
import { PlayerManager, Room, RoomHostBuilder, StartupBase } from "types-haxframework";
import { IPlayerManager, IRoom, Player, Types } from "types-haxframework-core";

// TODO: improve this test...

/**
 * Extend the base room to override the room initialization process.
 */
export class TestRoom extends Room<Player> {

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initializeRoom(): IRoomObject {
        return {} as any;
    }
}

export class StartupTest extends StartupBase {

    constructor(
        @inject(Types.IRoom) room: IRoom<Player>,
    ) {
        super(room);
    }

    configure(): void {
        this.mRoom.onPlayerChat = (player, message) => {
            if (player.id === 3) {
                return true;
            }
            return false;
        };
    }
}

// Create a test room, bind a mock room config object and start it
const builder = new RoomHostBuilder<StartupBase, Player>(StartupTest, TestRoom);
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
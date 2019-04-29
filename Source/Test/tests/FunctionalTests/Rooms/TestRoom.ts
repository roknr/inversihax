import { IRoomObject } from "types-haxball-headless-api";
import { Player, RoomBase } from "types-haxframework";

export class TestRoom extends RoomBase<Player> {

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initializeRoom(): IRoomObject {
        return {} as any;
    }
}
import { Player, RoomBase } from "inversihax";
import { IRoomObject } from "types-haxball-headless-api";

export class TestRoom extends RoomBase<Player> {

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initialize(): IRoomObject {
        return {} as any;
    }
}
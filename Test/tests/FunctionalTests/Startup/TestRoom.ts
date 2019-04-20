import { IRoomObject } from "types-haxball-headless-api";
import { Room } from "types-haxframework";
import { Player } from "types-haxframework-core";

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
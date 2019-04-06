import { IRoomObject } from "types-haxball-headless-api";
import { Room } from "types-haxframework";

/**
 * Extend the base room to override the room initialization process.
 */
export class TestRoom extends Room {

    /**
     * Override for the initialize room method, so that we can use a mock room object, since HBInit only exists in the browser.
     */
    protected initializeRoom(): IRoomObject {
        return {} as any;
    }
}
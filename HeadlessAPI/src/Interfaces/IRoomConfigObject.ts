import { IGeo } from "./IGeo";

/**
 * The room configuration object interface.
 */
export interface IRoomConfigObject {

    /**
     * The name of the room. If not specified, the default is "Headless Room".
     */
    roomName?: string;

    /**
     * The name of the host player. If not specified, the default is "Host".
     */
    playerName?: string;

    /**
     * The password for the room (no password if omitted).
     */
    password?: string;

    /**
     * Max number of players the room accepts.
     */
    maxPlayers?: number;

    /**
     * If true the room will appear in the room list (false if omitted).
     */
    public?: boolean;

    /**
     * GeoLocation override for the room.
     */
    geo?: IGeo;

    /**
     * Can be used to skip the recaptcha by setting it to a token that can be obtained: from
     * @see https://www.haxball.com/headlesstoken
     *
     * These tokens will expire after a few minutes.
     */
    token?: string;
}
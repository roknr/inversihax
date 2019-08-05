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

    /**
     * If set to true the room player list will be empty, the playerName setting will be ignored.
     *
     * Default value is false for backwards compatibility reasons but it's recommended to set this to true.
     *
     * Warning! events will have null as the byPlayer argument when the event is caused by the host, so make sure to check for null values!
     */
    noPlayer?: boolean;
}
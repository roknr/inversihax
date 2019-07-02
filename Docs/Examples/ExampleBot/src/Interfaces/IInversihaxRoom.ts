import { IRoom } from "inversihax";
import { InversihaxPlayer } from "../Models/InversihaxPlayer";

/**
 * The interface for our custom room. We want to be able to use our functionality when injecting the room.
 * We can't do that if we're using the base IRoom interface, as it doesn't provide our functionality. We must
 * extend it though.
 */
export interface IInversihaxRoom extends IRoom<InversihaxPlayer> {

    /**
     * Flag indicating whether the game is in progress.
     */
    readonly isGameInProgress: boolean;
}
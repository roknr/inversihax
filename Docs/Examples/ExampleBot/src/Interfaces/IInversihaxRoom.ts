import { IRoom, IPlayerObject } from "inversihax";
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

    /**
     * Method that returns the players in the room as the base Headless API player type.
     * Check implementation and player service for more detail on why we need it.
     */
    getPlayerListBase(): IPlayerObject[];

    /**
     * Method that returns the player in the room as the base Headless API player type.
     * Similar to above method.
     */
    getPlayerBase(id: number): IPlayerObject;
}
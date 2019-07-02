import { IRoom } from "inversihax";
import { CustomPlayer } from "../Models/CustomPlayer";

export interface ICustomRoom extends IRoom<CustomPlayer> {

    isGameInProgress: boolean;
}
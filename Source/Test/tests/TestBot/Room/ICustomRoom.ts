import { IRoom } from "inversihax";

export interface ICustomRoom extends IRoom {

    isGameInProgress: boolean;
}
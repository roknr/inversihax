import { IRoomConfigObject } from "./Interfaces/IRoomConfigObject";
import { IRoomObject } from "./Interfaces/IRoomObject";

export { TeamID } from "./Enums/TeamID";

export { IGeo } from "./Interfaces/IGeo";
export { IPlayerObject } from "./Interfaces/IPlayerObject";
export { IPosition } from "./Interfaces/IPosition";
export { IRoomConfigObject } from "./Interfaces/IRoomConfigObject";
export { IRoomObject } from "./Interfaces/IRoomObject";
export { IScoresObject } from "./Interfaces/IScoresObject";

/**
 * Declaration of the global window.HBInit function available in the Headless host API.
 *
 * Should only be called once, when initializing the room.
 * @param roomConfig The room configuration object.
 */
export declare function HBInit(roomConfig: IRoomConfigObject): IRoomObject;